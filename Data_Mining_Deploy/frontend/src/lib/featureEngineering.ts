// Frontend chỉ validate và format raw input
// Backend sẽ tự động thực hiện feature engineering

export interface BasicCourseInput {
  price: number;           // VND
  rating: number;          // 0-5
  num_students: number;
  num_reviews: number;
  duration: number;        // minutes
  discount: number;        // 0-100 (percentage)
  lectures: number;
  sections: number;
}

export interface RawPredictionInput {
  rating: number;              // 0.0 - 5.0
  discount: number;            // 0.0 - 1.0 (converted from percentage)
  num_reviews: number;         // >= 0
  num_students: number;        // >= 0
  price: number;               // > 0 (VND)
  total_length_minutes: number; // > 0 (minutes)
  sections: number;            // > 0
  lectures: number;            // > 0
}

/**
 * Chuyển đổi input từ UI thành raw input cho backend
 * Backend sẽ tự động thực hiện:
 * - Log transformations (num_reviews, num_students, price, duration)
 * - Sqrt transformations (sections, lectures)
 * - Feature engineering (effective_price, popularity_score, price_per_hour)
 * - Discount category encoding
 * - Scaling với RobustScaler
 */
export function prepareRawInput(input: BasicCourseInput): RawPredictionInput {
  const {
    price,
    rating,
    num_students,
    num_reviews,
    duration,
    discount,
    lectures,
    sections
  } = input;

  // Convert discount từ percentage (0-100) sang decimal (0-1)
  const discountDecimal = Math.max(0, Math.min(1, discount / 100));

  return {
    rating: Math.max(0, Math.min(5, rating)),
    discount: discountDecimal,
    num_reviews: Math.max(0, num_reviews),
    num_students: Math.max(0, num_students),
    price: Math.max(1, price),
    total_length_minutes: Math.max(1, duration),
    sections: Math.max(1, sections),
    lectures: Math.max(1, lectures)
  };
}

/**
 * Validate input data
 */
export function validateCourseInput(input: BasicCourseInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.price <= 0) errors.push('Giá phải lớn hơn 0');
  if (input.rating < 0 || input.rating > 5) errors.push('Rating phải từ 0 đến 5');
  if (input.num_students < 0) errors.push('Số học viên phải >= 0');
  if (input.num_reviews < 0) errors.push('Số đánh giá phải >= 0');
  if (input.duration < 1) errors.push('Thời lượng phải >= 1 phút');
  if (input.discount < 0 || input.discount > 100) errors.push('Giảm giá phải từ 0-100%');
  if (input.lectures < 1) errors.push('Số lectures phải >= 1');
  if (input.sections < 1) errors.push('Số sections phải >= 1');

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Tạo data mẫu để test
 */
export function getSampleData(): BasicCourseInput {
  return {
    price: 369000,
    rating: 4.9,
    num_students: 1159767,
    num_reviews: 200000,
    duration: 2564,
    discount: 81,
    lectures: 120,
    sections: 46
  };
}

/**
 * Format số thành chuỗi dễ đọc (VD: 1000000 -> 1,000,000)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('vi-VN');
}

/**
 * Format phần trăm (VD: 0.81 -> 81%)
 */
export function formatPercent(decimal: number): string {
  return `${Math.round(decimal * 100)}%`;
}

/**
 * Format thời gian từ phút sang giờ và phút
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}
