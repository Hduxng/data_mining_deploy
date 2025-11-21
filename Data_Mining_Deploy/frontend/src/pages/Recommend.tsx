import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Users, Clock, TrendingUp, Sparkles, Target, BookOpen, AlertCircle, X } from "lucide-react";
import { apiService, type RecommendationResponse, type Course } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Recommend = () => {
  const [targetTopic, setTargetTopic] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedTopics = [
    'AI Engineer', 'Data Scientist', 'NLP Engineer', 'Computer Vision', 'Web Developer', 
    'Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Solutions Architect', 
    'DevOps Engineer', 'Cloud Engineer', 'Data Engineer', 'Data Analyst'
  ];

  // Load available topics khi component mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await apiService.getAvailableTopics();
        setAvailableTopics(response.topics);
      } catch (err) {
        console.error("Error loading topics:", err);
      }
    };
    loadTopics();
  }, []);

  // Filter suggestions based on input - chỉ lấy những từ BẮT ĐẦU bằng chữ đang nhập
  useEffect(() => {
    if (targetTopic.trim()) {
      const allSuggestions = [...suggestedTopics, ...availableTopics];
      const filtered = allSuggestions.filter(topic =>
        topic.toLowerCase().startsWith(targetTopic.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [targetTopic, availableTopics]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRecommend = async () => {
    if (!targetTopic.trim()) return;
   
    setIsLoading(true);
    setError("");
    setRecommendations(null);
    setShowSuggestions(false);
   
    try {
      const response = await apiService.getRecommendations({
        target_topic: targetTopic,
        max_steps: undefined,
        courses_per_step: 3
      });
     
      if (response.success) {
        setRecommendations(response);
      } else {
        setError(response.message || "Không tìm thấy learning path cho topic này.");
      }
    } catch (err: any) {
      console.error("Error getting recommendations:", err);
      setError(err.message || "Có lỗi xảy ra khi lấy recommendations. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setTargetTopic("");
    setRecommendations(null);
    setError("");
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTargetTopic(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000).toFixed(0)}K VND`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatStudents = (students: number) => {
    if (students >= 1000000) {
      return `${(students / 1000000).toFixed(1)}M`;
    } else if (students >= 1000) {
      return `${(students / 1000).toFixed(0)}K`;
    }
    return students.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4 animate-fade-in text-center">
          <h1 className="text-4xl font-bold">Sequential Mining Recommendations</h1>
          <p className="text-muted-foreground">
            Nhập topic/skill bạn muốn học để nhận learning path được gợi ý dựa trên Sequential Mining
          </p>

          {/* Topic Input */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="gradient-card border-border/50 p-6">
              <div className="space-y-4">
                <div className="relative" ref={inputRef}>
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Ví dụ: AI Engineer, Data Scientist, Web Developer, Cloud Engineer..."
                    value={targetTopic}
                    onChange={(e) => setTargetTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
                    onFocus={() => targetTopic.trim() && setShowSuggestions(true)}
                    className="pl-10 h-12 bg-card/50 border-border/50"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-card border border-border/50 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSuggestionClick(suggestion);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <span>{suggestion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleRecommend}
                    disabled={!targetTopic.trim() || isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 shadow-glow"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isLoading ? "Đang tìm kiếm..." : "Tìm Learning Path"}
                  </Button>
                  
                  {recommendations && (
                    <Button
                      onClick={handleNewSearch}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      New Search
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Suggested Topics */}
            {!recommendations && !isLoading && !error && (
              <div className="flex flex-wrap gap-2 justify-center">
                <p className="text-sm text-muted-foreground w-full mb-2">Các topic phổ biến:</p>
                {suggestedTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetTopic(topic);
                      // Chỉ set topic, không tự động tìm kiếm
                    }}
                    className="text-xs"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Recommendations Result */}
        {recommendations && recommendations.success && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    Learning Path: {recommendations.target_topic}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {recommendations.total_steps} bước học
                </span>
                <span>•</span>
                <span>Path: {recommendations.path.join(" → ")}</span>
              </div>
            </div>

            {/* Learning Steps */}
            <div className="space-y-6">
              {recommendations.steps.map((step) => (
                <div key={step.step_number} className="space-y-3">
                  {/* Step Header */}
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-base px-3 py-1">
                      Bước {step.step_number}
                    </Badge>
                    <h3 className="text-xl font-semibold">{step.topic}</h3>
                  </div>

                  {/* Courses for this step */}
                  {step.has_courses ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {step.courses.map((course: Course, idx: number) => (
                        <Card
                          key={idx}
                          className="gradient-card border-border/50 hover:shadow-glow transition-smooth overflow-hidden group cursor-pointer"
                          onClick={() => window.open(course.url, '_blank')}
                        >
                          <CardContent className="p-5 space-y-3">
                            {/* Bestseller Badge */}
                            {course.is_bestseller && (
                              <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Bestseller
                              </Badge>
                            )}

                            {/* Title */}
                            <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                              {course.title}
                            </h4>

                            {/* Instructor */}
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {course.instructor}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                <span className="font-semibold">{course.rating.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                <span>{formatStudents(course.students)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{course.duration}</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(course.price)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {course.lectures} lectures
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed border-2 border-border/50 p-6">
                      <p className="text-sm text-muted-foreground text-center">
                        Không tìm thấy khóa học cho topic này trong catalog
                      </p>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!recommendations && !isLoading && !error && targetTopic && (
          <Card className="gradient-card border-border/50 p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Chưa có kết quả</h3>
            <p className="text-muted-foreground">
              Hãy thử tìm kiếm với các topic như "AI Engineer", "Data Scientist", hoặc "Web Developer"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recommend;