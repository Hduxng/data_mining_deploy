"""
Sequential Mining Module - Dựa trên PrefixSpan Algorithm
Implement pattern-based learning path recommendation theo notebook 03_data-mining.ipynb
"""

import pandas as pd
import numpy as np
import ast
import re
from typing import List, Dict, Any, Tuple, Optional
from pathlib import Path
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from prefixspan import PrefixSpan

class SequentialMiningRecommender:
    """Class xử lý sequential mining và recommendation dựa trên PrefixSpan"""
    
    def __init__(self, data_path: str = "data_final_fix.csv"):
        """
        Khởi tạo recommender với data
        
        Args:
            data_path: Đường dẫn tới file CSV chứa dữ liệu khóa học
        """
        # Try to find CSV file in multiple locations
        possible_paths = [
            Path(__file__).parent / data_path,
            Path(__file__).parent.parent / data_path,
            Path(__file__).parent.parent / "data_final_fix.csv",
        ]
        
        self.data_path = None
        for path in possible_paths:
            if path.exists():
                self.data_path = path
                break
        
        if self.data_path is None:
            self.data_path = possible_paths[0]
        
        # Data containers
        self.df = None
        self.df_processed = None
        self.sequences = []
        self.patterns = []
        
        # Load và xử lý data
        self._load_and_prepare_data()
        self._extract_skills()
        self._estimate_difficulty()
        self._create_sequences()
        self._mine_patterns()
    
    def _load_and_prepare_data(self):
        """Load và prepare data giống notebook"""
        if not self.data_path.exists():
            print(f"Warning: Data file not found at {self.data_path}")
            self.df = pd.DataFrame()
            return
        
        self.df = pd.read_csv(self.data_path)
        print(f"Loaded {len(self.df)} courses")
        
        # Clean numeric columns
        if 'num_students' in self.df.columns:
            self.df['num_students'] = self.df['num_students'].astype(str).str.replace(',', '').astype(float)
        if 'num_reviews' in self.df.columns:
            self.df['num_reviews'] = self.df['num_reviews'].astype(str).str.replace(',', '').astype(float)
        if 'discount' in self.df.columns:
            self.df['discount'] = self.df['discount'].astype(str).str.replace('%', '').astype(float) / 100
        
        # Parse duration
        def parse_duration(duration_str):
            if pd.isna(duration_str):
                return None
            hours = re.search(r'(\d+)h', str(duration_str))
            minutes = re.search(r'(\d+)m', str(duration_str))
            total = (int(hours.group(1)) if hours else 0) * 60
            total += (int(minutes.group(1)) if minutes else 0)
            return total
        
        if 'total_length' in self.df.columns:
            self.df['duration_minutes'] = self.df['total_length'].apply(parse_duration)
        
        # Remove duplicates
        if 'title' in self.df.columns:
            self.df = self.df.drop_duplicates(subset=['title'], keep='first')
    
    def _extract_skills(self):
        """Extract skills từ content dùng TF-IDF và keyword matching"""
        # Combine text fields
        self.df['full_content'] = (
            self.df.get('title', pd.Series([''] * len(self.df))).fillna('') + ' ' + 
            self.df.get('headline', pd.Series([''] * len(self.df))).fillna('') + ' ' + 
            self.df.get('related_topics', pd.Series([''] * len(self.df))).fillna('')
        )
        
        # Skill categories
        SKILL_CATEGORIES = {
            'programming_languages': ['python', 'java', 'javascript', 'r programming', 'sql'],
            'ml_frameworks': ['tensorflow', 'pytorch', 'keras', 'scikit', 'scikit learn'],
            'ml_concepts': ['machine learning', 'deep learning', 'neural network', 'ai'],
            'data_tools': ['pandas', 'numpy', 'matplotlib', 'tableau', 'excel'],
            'specialized': ['nlp', 'computer vision', 'reinforcement learning', 'time series'],
            'cloud_devops': ['aws', 'azure', 'docker', 'kubernetes', 'mlops']
        }
        
        ALL_SKILLS = [skill for category in SKILL_CATEGORIES.values() for skill in category]
        
        def extract_skills_from_text(text):
            text_lower = str(text).lower()
            found_skills = []
            for skill in ALL_SKILLS:
                if skill in text_lower:
                    found_skills.append(skill)
            return found_skills
        
        self.df['extracted_skills'] = self.df['full_content'].apply(extract_skills_from_text)
        print(f"Extracted skills for {len(self.df)} courses")
    
    def _estimate_difficulty(self):
        """Estimate difficulty based on multiple signals"""
        def estimate_difficulty_enhanced(row):
            title = str(row.get('title', '')).lower()
            headline = str(row.get('headline', '')).lower()
            
            beginner_keywords = ['beginner', 'basic', 'fundamental', 'introduction', 
                               'getting started', 'zero to', 'crash course', 'for beginners']
            advanced_keywords = ['advanced', 'expert', 'master', 'professional', 
                               'complete guide', 'ultimate', 'in-depth']
            
            beginner_score = sum(1 for kw in beginner_keywords if kw in title or kw in headline)
            advanced_score = sum(1 for kw in advanced_keywords if kw in title or kw in headline)
            
            duration = row.get('duration_minutes', 0)
            duration_score = 0
            if pd.notna(duration):
                if duration < 180:
                    duration_score = -1
                elif duration > 1200:
                    duration_score = 1
            
            num_skills = len(row.get('extracted_skills', []))
            skill_score = 0
            if num_skills <= 2:
                skill_score = -1
            elif num_skills >= 5:
                skill_score = 1
            
            total_score = beginner_score * (-1) + advanced_score + duration_score + skill_score
            
            if total_score < -1:
                return 'Beginner'
            elif total_score > 1:
                return 'Advanced'
            else:
                return 'Intermediate'
        
        self.df['difficulty'] = self.df.apply(estimate_difficulty_enhanced, axis=1)
        print(f"Difficulty distribution: {self.df['difficulty'].value_counts().to_dict()}")
    
    def _create_sequences(self):
        """Tạo sequences cho PrefixSpan"""
        MIN_COURSES_PER_TOPIC = 3
        sequences = []
        
        if 'related_topics' not in self.df.columns:
            self.sequences = []
            return
        
        topic_groups = self.df.groupby('related_topics')
        
        for topic, group in topic_groups:
            if len(group) < MIN_COURSES_PER_TOPIC:
                continue
            
            difficulty_order = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}
            group = group.copy()
            group['diff_order'] = group['difficulty'].map(difficulty_order)
            group_sorted = group.sort_values(['diff_order', 'num_students'], 
                                           ascending=[True, False])
            
            sequence = []
            seen_skills_global = set()
            
            for idx, course in group_sorted.iterrows():
                course_skills = set(course.get('extracted_skills', []))
                new_skills = course_skills - seen_skills_global
                
                if new_skills:
                    sequence.append(tuple(sorted(new_skills)))
                    seen_skills_global.update(new_skills)
            
            if len(sequence) >= 2:
                sequences.append(sequence)
        
        self.sequences = sequences
        print(f"Created {len(sequences)} sequences")
    
    def _mine_patterns(self, min_support: int = 10):
        """Mine patterns using PrefixSpan"""
        if not self.sequences:
            self.patterns = []
            return
        
        ps = PrefixSpan(self.sequences)
        self.patterns = ps.frequent(minsup=min_support)
        print(f"Mined {len(self.patterns)} patterns with min_support={min_support}")
    
    def get_recommendations(self, career_goal: str, max_courses: int = 7) -> List[Dict[str, Any]]:
        """
        Generate learning path recommendations based on patterns
        
        Args:
            career_goal: Career goal keyword
            max_courses: Maximum number of courses to return
            
        Returns:
            List of recommended courses
        """
        if self.df is None or self.df.empty:
            return []
        
        # Career-specific keywords mapping
        career_keywords_map = {
            'AI Engineer': ['ai', 'machine learning', 'deep learning', 'neural network'],
            'ML Engineer': ['machine learning', 'mlops', 'deployment', 'aws', 'tensorflow', 'pytorch'],
            'Data Scientist': ['data science', 'machine learning', 'statistics', 'python', 'pandas', 'r'],
            'Web Developer': ['web development', 'html', 'css', 'javascript', 'react', 'frontend'],
            'Python Developer': ['python', 'django', 'flask', 'api', 'backend'],
            'React JS': ['react', 'javascript', 'frontend', 'web development'],
            'Machine Learning': ['machine learning', 'ai', 'deep learning', 'python'],
        }
        
        # Try to match career_goal
        keywords = career_keywords_map.get(career_goal, 
                                           [word.lower() for word in career_goal.split()])
        
        # Find relevant patterns
        relevant_patterns = []
        for support, pattern in self.patterns:
            pattern_skills = set()
            for itemset in pattern:
                if isinstance(itemset, (list, tuple)):
                    pattern_skills.update(itemset)
                else:
                    pattern_skills.add(itemset)
            
            if any(kw in skill for kw in keywords for skill in pattern_skills):
                relevant_patterns.append((support, pattern, pattern_skills))
        
        # Extract key skills
        skill_importance = Counter()
        for support, pattern, skills in relevant_patterns:
            for skill in skills:
                skill_importance[skill] += support
        
        # Score courses
        scored_courses = []
        for idx, row in self.df.iterrows():
            course_skills = set(row.get('extracted_skills', []))
            pattern_score = sum(skill_importance[skill] for skill in course_skills 
                              if skill in skill_importance)
            
            content = str(row.get('full_content', '')).lower()
            keyword_score = sum(1 for kw in keywords if kw in content)
            
            total_score = pattern_score * 2 + keyword_score
            
            if total_score > 0:
                scored_courses.append({
                    'title': row.get('title', 'Unknown'),
                    'difficulty': row.get('difficulty', 'Intermediate'),
                    'rating': float(row.get('rating', 0)),
                    'num_students': float(row.get('num_students', 0)),
                    'duration_minutes': row.get('duration_minutes', 0),
                    'instructor': row.get('instructor', 'Unknown'),
                    'price': float(row.get('price', 0)),
                    'lectures': float(row.get('lectures', 0)),
                    'sections': float(row.get('sections', 0)),
                    'total_length': str(row.get('total_length', '')),
                    'url': row.get('course_url', ''),
                    'skills': list(course_skills),
                    'total_score': total_score
                })
        
        # Sort by difficulty and score
        difficulty_order = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}
        scored_courses.sort(key=lambda x: (
            difficulty_order.get(x['difficulty'], 1),
            -x['total_score']
        ))
        
        # Select balanced
        selected = []
        diff_count = {'Beginner': 0, 'Intermediate': 0, 'Advanced': 0}
        max_per_diff = max(2, max_courses // 3)
        
        for course in scored_courses:
            diff = course['difficulty']
            if diff_count[diff] < max_per_diff and len(selected) < max_courses:
                selected.append(course)
                diff_count[diff] += 1
        
        for course in scored_courses:
            if course not in selected and len(selected) < max_courses:
                selected.append(course)
        
        return selected[:max_courses]
    
    def get_full_recommendation(
        self,
        target_topic: str,
        max_steps: Optional[int] = None,
        courses_per_step: int = 3
    ) -> Dict[str, Any]:
        """
        Lấy full recommendation
        
        Args:
            target_topic: Career goal hoặc topic
            max_steps: Tối đa số bước
            courses_per_step: Số khóa học mỗi bước
            
        Returns:
            Dict với recommendations
        """
        # Get courses
        courses = self.get_recommendations(target_topic, max_courses=courses_per_step * 3)
        
        if not courses:
            return {
                "success": False,
                "message": f"Không tìm thấy courses cho '{target_topic}'. Thử các career goals khác.",
                "path": [],
                "total_steps": 0,
                "steps": []
            }
        
        # Group by difficulty
        steps = []
        current_diff = None
        step_num = 1
        step_courses = []
        
        for course in courses:
            diff = course['difficulty']
            if current_diff != diff and step_courses:
                steps.append({
                    "step_number": step_num,
                    "topic": current_diff,
                    "courses": step_courses[:courses_per_step],
                    "has_courses": len(step_courses) > 0
                })
                step_num += 1
                step_courses = []
            
            current_diff = diff
            step_courses.append({
                'title': course['title'],
                'rating': course['rating'],
                'students': int(course['num_students']),
                'is_bestseller': bool(course.get('is_bestseller', False)),
                'instructor': course['instructor'],
                'price': course['price'],
                'lectures': int(course['lectures']),
                'sections': int(course['sections']),
                'duration': course['total_length'],
                'url': course['url']
            })
        
        # Add last step
        if step_courses:
            steps.append({
                "step_number": step_num,
                "topic": current_diff,
                "courses": step_courses[:courses_per_step],
                "has_courses": len(step_courses) > 0
            })
        
        path = ['Beginner', 'Intermediate', 'Advanced']
        
        return {
            "success": True,
            "message": "Tìm thấy learning path",
            "target_topic": target_topic,
            "path": path[:len(steps)],
            "total_steps": len(steps),
            "steps": steps
        }


# Singleton instance
_recommender_instance = None

def get_recommender() -> SequentialMiningRecommender:
    """Get singleton instance của recommender"""
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = SequentialMiningRecommender()
    return _recommender_instance
