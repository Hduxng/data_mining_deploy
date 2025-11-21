# Frontend - React + TypeScript + Vite

Modern React frontend cho Udemy Bestseller Predictor.

## 🚀 Quick Start với Docker

```bash
# Từ thư mục root
docker-compose up -d frontend
```

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Routing
- **Recharts** - Charts
- **Sonner** - Toast notifications

## 📁 Cấu trúc

```
src/
├── pages/              # Các trang chính
│   ├── Predict.tsx     # Form dự đoán
│   ├── Analytics.tsx   # Dashboard phân tích
│   ├── About.tsx       # Giới thiệu
│   └── Landing.tsx     # Landing page
├── components/
│   ├── Navigation.tsx  # Header navigation
│   └── ui/            # shadcn/ui components
├── services/
│   └── api.ts         # API client
├── lib/
│   ├── featureEngineering.ts  # Feature transformation
│   └── utils.ts               # Utilities
└── hooks/             # Custom React hooks
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Run dev server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Feature Engineering

File `lib/featureEngineering.ts` tự động chuyển đổi 8 inputs thành 18 features:

**Input (8 fields):**
- price, rating, num_students, num_reviews
- duration, discount, lectures, sections

**Output (18 features):**
- Original: rating, num_students, price, discount, lectures, total_length_minutes
- Log transforms: log_num_reviews, log_num_students, log_price, log_total_length_minutes
- Sqrt transforms: sqrt_sections, sqrt_lectures
- Derived: price_capped, effective_price, popularity_score, rating_x_students, price_per_hour, discount_category

## 🌐 Environment Variables

Tạo file `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

## 📦 Components

Sử dụng **shadcn/ui** - high-quality React components:
- Button, Input, Card, Slider
- Toast notifications
- Charts (Recharts)
- Form validation (React Hook Form + Zod)

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **CSS Variables** - Theme customization
- **Dark mode ready** - next-themes

## 🚀 Production Build

Build tạo static files trong `dist/`:

```bash
npm run build
# Output: dist/
```

Docker sẽ serve bằng Nginx.
