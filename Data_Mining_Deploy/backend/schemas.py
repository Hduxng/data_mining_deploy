from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# ============== RAW INPUT SCHEMA (8 features) ==============

class UdemyPredictionBase(BaseModel):
    """
    RAW INPUT từ người dùng - 8 features cơ bản
    Backend sẽ tự động thực hiện feature engineering
    """
    rating: float = Field(
        ge=0.0,
        le=5.0,
        description="Đánh giá khóa học (0.0 - 5.0)",
        example=4.5
    )
    discount: float = Field(
        ge=0.0,
        le=1.0,
        description="Mức giảm giá (0.0 = 0%, 1.0 = 100%)",
        example=0.75
    )
    num_reviews: int = Field(
        ge=0,
        description="Số lượng đánh giá",
        example=1500
    )
    num_students: int = Field(
        ge=0,
        description="Số lượng học viên",
        example=50000
    )
    price: float = Field(
        gt=0,
        description="Giá khóa học (VND)",
        example=299000
    )
    total_length_minutes: int = Field(
        gt=0,
        description="Tổng thời lượng khóa học (phút)",
        example=720
    )
    sections: int = Field(
        gt=0,
        description="Số lượng sections",
        example=15
    )
    lectures: int = Field(
        gt=0,
        description="Số lượng lectures",
        example=120
    )

# ============== RESPONSE SCHEMA ==============

class UdemyPredictionResponse(UdemyPredictionBase):
    """
    Response trả về sau khi dự đoán
    Bao gồm cả raw input + kết quả dự đoán
    """
    id: int
    prediction: str  # "Bestseller" hoặc "Not Bestseller"
    probability: float  # Xác suất dự đoán (0.0 - 1.0)
    created_at: datetime

    class Config:
        from_attributes = True  # Thay thế orm_mode trong Pydantic v2
