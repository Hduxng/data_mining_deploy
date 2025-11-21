// API Service để kết nối với FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PredictionInput {
  // 8 RAW features - backend sẽ tự động feature engineering
  rating: number;              // 0.0 - 5.0
  discount: number;            // 0.0 - 1.0 (0% = 0.0, 100% = 1.0)
  num_reviews: number;         // >= 0
  num_students: number;        // >= 0
  price: number;               // > 0 (VND)
  total_length_minutes: number; // > 0 (minutes)
  sections: number;            // > 0
  lectures: number;            // > 0
}

export interface PredictionResponse {
  id: number;
  prediction: string; // "Bestseller" or "Not Bestseller"
  probability: number; // 0.0 - 1.0
  created_at: string;
  // RAW input features (8 features)
  rating: number;
  discount: number;
  num_reviews: number;
  num_students: number;
  price: number;
  total_length_minutes: number;
  sections: number;
  lectures: number;
}

export interface Stats {
  total_predictions: number;
  message: string;
}

// ============== Sequential Mining / Recommendation Interfaces ==============

export interface Course {
  title: string;
  rating: number;
  students: number;
  is_bestseller: boolean;
  instructor: string;
  price: number;
  lectures: number;
  sections: number;
  duration: string;
  url: string;
  topics?: string[];
}

export interface RecommendationStep {
  step_number: number;
  topic: string;
  courses: Course[];
  has_courses: boolean;
}

export interface RecommendationRequest {
  target_topic: string;
  max_steps?: number;
  courses_per_step?: number;
}

export interface RecommendationResponse {
  success: boolean;
  message: string;
  target_topic?: string;
  path: string[];
  total_steps: number;
  steps: RecommendationStep[];
}

export interface TopicsResponse {
  topics: string[];
  count: number;
}

export interface SearchResponse {
  courses: Course[];
  count: number;
  keyword: string;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Health check
  async healthCheck(): Promise<{ message: string; version: string; status: string }> {
    const response = await fetch(`${this.baseURL}/`);
    if (!response.ok) {
      throw new Error('API is not responding');
    }
    return response.json();
  }

  // Dự đoán bestseller
  async predict(data: PredictionInput): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseURL}/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Prediction failed');
    }

    return response.json();
  }

  // Lấy danh sách predictions
  async getPredictions(skip: number = 0, limit: number = 100): Promise<PredictionResponse[]> {
    const response = await fetch(`${this.baseURL}/predictions/?skip=${skip}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }

    return response.json();
  }

  // Lấy một prediction cụ thể
  async getPrediction(id: number): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseURL}/predictions/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prediction');
    }

    return response.json();
  }

  // Xóa một prediction
  async deletePrediction(id: number): Promise<{ message: string; id: number }> {
    const response = await fetch(`${this.baseURL}/predictions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete prediction');
    }

    return response.json();
  }

  // Xóa tất cả predictions
  async deleteAllPredictions(): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/predictions/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete all predictions');
    }

    return response.json();
  }

  // Lấy thống kê
  async getStats(): Promise<Stats> {
    const response = await fetch(`${this.baseURL}/stats/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }

  // ============== Sequential Mining / Recommendation Methods ==============

  /**
   * Lấy recommendation dựa trên sequential mining
   * @param request - Request chứa target topic và options
   * @returns RecommendationResponse với learning path và courses
   */
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await fetch(`${this.baseURL}/recommend/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get recommendations');
    }

    return response.json();
  }

  /**
   * Lấy danh sách tất cả topics có sẵn trong knowledge graph
   * @returns TopicsResponse với danh sách topics
   */
  async getAvailableTopics(): Promise<TopicsResponse> {
    const response = await fetch(`${this.baseURL}/topics/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }

    return response.json();
  }

  /**
   * Tìm kiếm khóa học theo keyword
   * @param keyword - Từ khóa tìm kiếm
   * @param limit - Số lượng kết quả tối đa (default: 10)
   * @returns SearchResponse với danh sách khóa học
   */
  async searchCourses(keyword: string, limit: number = 10): Promise<SearchResponse> {
    const response = await fetch(
      `${this.baseURL}/search/?keyword=${encodeURIComponent(keyword)}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search courses');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export class cho testing
export default APIService;

