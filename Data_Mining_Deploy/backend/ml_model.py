import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field
from typing import Optional
import os

# ============== INPUT/OUTPUT SCHEMAS ==============

class PredictionInput(BaseModel):
    """
    RAW INPUT từ người dùng - 8 features cơ bản
    Backend sẽ tự động thực hiện feature engineering
    """
    rating: float = Field(ge=0.0, le=5.0, description="Đánh giá khóa học (0.0 - 5.0)")
    discount: float = Field(ge=0.0, le=1.0, description="Mức giảm giá (0.0 = 0%, 1.0 = 100%)")
    num_reviews: int = Field(ge=0, description="Số lượng đánh giá")
    num_students: int = Field(ge=0, description="Số lượng học viên")
    price: float = Field(gt=0, description="Giá khóa học (VND)")
    total_length_minutes: int = Field(gt=0, description="Tổng thời lượng (phút)")
    sections: int = Field(gt=0, description="Số sections")
    lectures: int = Field(gt=0, description="Số lectures")

class PredictionOutput(BaseModel):
    prediction: str
    probability: float

# ============== MODEL CLASS ==============

class UdemyBestsellerModel:
    """
    Model dự đoán Udemy Bestseller
    Nhận 12 features đã engineered từ frontend, scale và predict
    """
    
    def __init__(self):
        # Paths
        model_path = 'model.pkl'
        scaler_path = 'scaler_final.pkl'
        
        # Load model (Random Forest sau GridSearch)
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print(f"✓ Đã load model từ {model_path}")
            print(f"  Model type: {type(self.model).__name__}")
            if hasattr(self.model, 'n_features_in_'):
                print(f"  Number of features: {self.model.n_features_in_}")
        else:
            print(f"⚠ Warning: {model_path} không tồn tại.")
            self.model = None
        
        # Load scaler (RobustScaler đã fit trên train set)
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)
            print(f"✓ Đã load scaler từ {scaler_path}")
        else:
            print(f"⚠ Warning: {scaler_path} không tồn tại.")
            self.scaler = None
        
        # Thứ tự features (12 features) - PHẢI ĐÚNG với lúc train
        self.FEATURE_NAMES = [
            'rating', 'discount', 'log_num_reviews', 
            'log_num_students', 'log_price', 'log_total_length_minutes', 
            'sqrt_sections', 'sqrt_lectures', 'effective_price', 
            'popularity_score', 'price_per_hour', 'discount_category'
        ]
        
        # Mapping cho classification
        self.target_mapping = {
            0: 'Not Bestseller',
            1: 'Bestseller'
        }
    
    def preprocess_input(self, input_data: PredictionInput) -> pd.DataFrame:
        """
        Tiền xử lý raw input thành 12 engineered features
        
        Các bước:
        1. Log transformation: num_reviews, num_students, price, total_length_minutes
        2. Sqrt transformation: sections, lectures
        3. Feature engineering: effective_price, popularity_score, price_per_hour
        4. Discount category encoding
        5. Scaling với RobustScaler
        
        Args:
            input_data: PredictionInput với 8 raw features
            
        Returns:
            DataFrame đã được scale với 12 features
        """
        # Chuyển input thành dict
        data = input_data.dict()
        df = pd.DataFrame([data])
        
        print("\n" + "="*80)
        print("📥 RAW INPUT (trước khi xử lý):")
        print("="*80)
        print(f"  rating: {data['rating']}")
        print(f"  discount: {data['discount']} ({data['discount']*100:.1f}%)")
        print(f"  num_reviews: {data['num_reviews']:,}")
        print(f"  num_students: {data['num_students']:,}")
        print(f"  price: {data['price']:,.0f} VND")
        print(f"  total_length_minutes: {data['total_length_minutes']} min (~{data['total_length_minutes']/60:.1f} hours)")
        print(f"  sections: {data['sections']}")
        print(f"  lectures: {data['lectures']}")
        
        # 1. LOG TRANSFORMATIONS (dùng log1p để tránh log(0))
        df['log_num_reviews'] = np.log1p(df['num_reviews'])
        df['log_num_students'] = np.log1p(df['num_students'])
        df['log_price'] = np.log1p(df['price'])
        df['log_total_length_minutes'] = np.log1p(df['total_length_minutes'])
        
        # 2. SQRT TRANSFORMATIONS
        df['sqrt_sections'] = np.sqrt(np.clip(df['sections'], 0, None))
        df['sqrt_lectures'] = np.sqrt(np.clip(df['lectures'], 0, None))
        
        # 3. FEATURE ENGINEERING
        # Giá hiệu quả sau giảm giá
        df['effective_price'] = df['price'] * (1 - np.clip(df['discount'], 0, 1))
        
        # Điểm độ phổ biến (trung bình students và reviews)
        df['popularity_score'] = (df['num_students'] + df['num_reviews']) / 2
        
        # Giá mỗi giờ
        df['price_per_hour'] = df['price'] / (df['total_length_minutes'] / 60 + 1e-3)
        
        # 4. DISCOUNT CATEGORY ENCODING
        # Chia discount thành 3 bins: Low [0-0.3), Medium [0.3-0.6), High [0.6-1.0]
        bins = [0, 0.3, 0.6, 1.0]
        labels = ['Low', 'Medium', 'High']
        
        # pd.cut trả về category
        discount_cat = pd.cut(
            np.clip(df['discount'], 0, 1), 
            bins=bins, 
            labels=labels, 
            include_lowest=True
        )
        
        # LabelEncoder mặc định sort theo alphabet: High=0, Low=1, Medium=2
        le_order = sorted(labels)  # ['High', 'Low', 'Medium']
        discount_map = {name: idx for idx, name in enumerate(le_order)}
        df['discount_category'] = discount_cat.astype(str).map(discount_map).astype(int)
        
        print("\n" + "="*80)
        print("🔧 ENGINEERED FEATURES (sau feature engineering):")
        print("="*80)
        print(f"  rating: {df['rating'].values[0]}")
        print(f"  discount: {df['discount'].values[0]}")
        print(f"  log_num_reviews: {df['log_num_reviews'].values[0]:.6f}")
        print(f"  log_num_students: {df['log_num_students'].values[0]:.6f}")
        print(f"  log_price: {df['log_price'].values[0]:.6f}")
        print(f"  log_total_length_minutes: {df['log_total_length_minutes'].values[0]:.6f}")
        print(f"  sqrt_sections: {df['sqrt_sections'].values[0]:.6f}")
        print(f"  sqrt_lectures: {df['sqrt_lectures'].values[0]:.6f}")
        print(f"  effective_price: {df['effective_price'].values[0]:,.2f} VND")
        print(f"  popularity_score: {df['popularity_score'].values[0]:,.2f}")
        print(f"  price_per_hour: {df['price_per_hour'].values[0]:,.2f} VND/hour")
        print(f"  discount_category: {df['discount_category'].values[0]} ({discount_cat.values[0]})")
        
        # 5. CHỈ GIỮ 12 FEATURES CUỐI CÙNG (đúng thứ tự)
        df_model = df[self.FEATURE_NAMES].copy()
        
        print("\n" + "="*80)
        print("📊 FEATURES TRƯỚC KHI SCALE:")
        print("="*80)
        print(df_model.to_string(index=False))
        
        # 6. SCALING với RobustScaler
        if self.scaler is not None:
            X_scaled = self.scaler.transform(df_model)
            df_scaled = pd.DataFrame(X_scaled, columns=self.FEATURE_NAMES)
            
            print("\n" + "="*80)
            print("⚖️ FEATURES SAU KHI SCALE (RobustScaler):")
            print("="*80)
            print(df_scaled.to_string(index=False))
            print("="*80 + "\n")
            
            return df_scaled
        else:
            print("⚠ Warning: Scaler không tồn tại, trả về data chưa scale")
            return df_model
    
    def predict(self, input_data: PredictionInput) -> dict:
        """
        Dự đoán bestseller từ raw input
        
        Args:
            input_data: PredictionInput với 8 raw features
            
        Returns:
            {
                "prediction": "Bestseller" hoặc "Not Bestseller",
                "probability": float (0-1)
            }
        """
        # Preprocess (feature engineering + scaling)
        X_processed = self.preprocess_input(input_data)
        
        if self.model is not None:
            # Dự đoán class (0 hoặc 1)
            prediction_class = self.model.predict(X_processed)[0]
            prediction_label = self.target_mapping[prediction_class]
            
            # Lấy probability
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(X_processed)[0]
                probability = float(probabilities[prediction_class])
            else:
                probability = 1.0
            
            print(f"✓ Prediction: {prediction_label} (prob: {probability:.4f})")
            
            return {
                "prediction": prediction_label,
                "probability": probability
            }
        else:
            # Dummy prediction nếu chưa có model
            print("⚠ Warning: Model không tồn tại, trả về dummy prediction")
            return {
                "prediction": "Not Bestseller",
                "probability": 0.5
            }


# ============== KHỞI TẠO MODEL (Singleton) ==============

# Khởi tạo model một lần khi module được import
model = UdemyBestsellerModel()

# Export để dùng trong FastAPI
__all__ = ['model', 'PredictionInput', 'PredictionOutput']
