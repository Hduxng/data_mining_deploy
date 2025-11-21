from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
from datetime import datetime

class UdemyPrediction(Base):
    __tablename__ = "udemy_predictions"

    id = Column(Integer, primary_key=True, index=True)
    
    # RAW INPUT FEATURES (8 features gốc từ user)
    rating = Column(Float, nullable=False)
    discount = Column(Float, nullable=False)
    num_reviews = Column(Integer, nullable=False)
    num_students = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total_length_minutes = Column(Integer, nullable=False)
    sections = Column(Integer, nullable=False)
    lectures = Column(Integer, nullable=False)
    
    # PREDICTION OUTPUT
    prediction = Column(String, nullable=False)  # "Bestseller" hoặc "Not Bestseller"
    probability = Column(Float, nullable=False)  # Xác suất dự đoán (0.0 - 1.0)
    
    # METADATA
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
