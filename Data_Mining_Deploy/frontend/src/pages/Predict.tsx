import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

import { Target, TrendingUp, AlertCircle, Sparkles, Loader2, Star, Users, Clock, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { apiService } from "@/services/api";
import { prepareRawInput, validateCourseInput, type BasicCourseInput } from "@/lib/featureEngineering";

const Predict = () => {
  const [prediction, setPrediction] = useState<{
    label: string;
    probability: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    price: 1000000,
    rating: 4.0,
    students: 1000,
    reviews: 100,
    duration: 600,
    discount: 0,
    lectures: 50,
    sections: 10,
  });

  const handlePredict = async () => {
    // Validate input
    const input: BasicCourseInput = {
      price: formData.price,
      rating: formData.rating,
      num_students: formData.students,
      num_reviews: formData.reviews,
      duration: formData.duration,
      discount: formData.discount,
      lectures: formData.lectures,
      sections: formData.sections,
    };

    const validation = validateCourseInput(input);
    if (!validation.isValid) {
      toast.error("Dữ liệu không hợp lệ", {
        description: validation.errors.join(", ")
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare raw input (backend sẽ tự feature engineering)
      const rawInput = prepareRawInput(input);
      
      // Gọi API
      const result = await apiService.predict(rawInput);
      
      setPrediction({
        label: result.prediction,
        probability: result.probability
      });

      toast.success("Dự đoán thành công!", {
        description: `Kết quả: ${result.prediction} (${(result.probability * 100).toFixed(1)}%)`
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Lỗi khi dự đoán", {
        description: error instanceof Error ? error.message : "Vui lòng thử lại"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceLevel = (prob: number) => {
    if (prob > 0.7) return { level: "High", color: "text-green-500", bgColor: "bg-green-500/20" };
    if (prob > 0.4) return { level: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-500/20" };
    return { level: "Low", color: "text-red-500", bgColor: "bg-red-500/20" };
  };

  const getPredictionColor = (label: string) => {
    return label === "Bestseller" 
      ? { text: "text-green-600", bg: "bg-green-500/20", border: "border-green-500/30" }
      : { text: "text-red-600", bg: "bg-red-500/20", border: "border-red-500/30" };
  };

  const handlePriceInputChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), 5000000);
    setFormData({ ...formData, price: clampedValue });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2 animate-fade-in text-center">
          <h1 className="text-4xl font-bold">Predict Course Success</h1>
          <p className="text-muted-foreground">Enter course details to predict bestseller probability</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Course Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Slider */}
              <div className="space-y-4">
                <Label className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Price (VND)
                  </span>
                  <span className="text-primary font-semibold">{formData.price.toLocaleString()} đ</span>
                </Label>
                <Slider
                  value={[formData.price]}
                  onValueChange={([value]) => setFormData({ ...formData, price: value })}
                  max={5000000}
                  step={100000}
                  className="py-4"
                />
                
                {/* Price Input */}
                <div className="space-y-2">
                  <Label htmlFor="price-input" className="text-sm text-muted-foreground">
                    Enter exact price:
                  </Label>
                  <div className="relative">
                    <Input
                      id="price-input"
                      type="text"
                      value={formData.price.toLocaleString()}
                      onChange={(e) => handlePriceInputChange(e.target.value)}
                      className="bg-background/50 pl-8"
                      placeholder="Enter price in VND"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Slider */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Current Rating
                  </span>
                  <span className="text-primary font-semibold">{formData.rating.toFixed(1)}</span>
                </Label>
                <Slider
                  value={[formData.rating * 10]}
                  onValueChange={([value]) => setFormData({ ...formData, rating: value / 10 })}
                  min={10}
                  max={50}
                  step={1}
                  className="py-4"
                />
              </div>

              {/* Students */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Number of Students
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Nhập số lượng học viên"
                  value={formData.students === 0 ? "" : formData.students}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({
                      ...formData,
                      students: v === "" ? 0 : parseInt(v)
                    });
                  }}
                  className="bg-background/50"
                />
              </div>

              {/* Reviews */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Number of Reviews
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Nhập số lượng đánh giá"
                  value={formData.reviews === 0 ? "" : formData.reviews}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({
                      ...formData,
                      reviews: v === "" ? 0 : parseInt(v)
                    });
                  }}
                  className="bg-background/50"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Total Duration (minutes)
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Nhập tổng thời lượng (phút)"
                  value={formData.duration === 0 ? "" : formData.duration}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({
                      ...formData,
                      duration: v === "" ? 0 : parseInt(v)
                    });
                  }}
                  className="bg-background/50"
                />
              </div>

              {/* Discount Slider */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Discount (%)
                  </span>
                  <span className="text-primary font-semibold">{formData.discount}%</span>
                </Label>
                <Slider
                  value={[formData.discount]}
                  onValueChange={([value]) => setFormData({ ...formData, discount: value })}
                  max={100}
                  step={5}
                  className="py-4"
                />
              </div>

              {/* Lectures & Sections */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lectures</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Nhập số bài giảng"
                    value={formData.lectures === 0 ? "" : formData.lectures}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({
                        ...formData,
                        lectures: v === "" ? 0 : parseInt(v)
                      });
                    }}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sections</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Nhập số chương"
                    value={formData.sections === 0 ? "" : formData.sections}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({
                        ...formData,
                        sections: v === "" ? 0 : parseInt(v)
                      });
                    }}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <Button 
                onClick={handlePredict} 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 shadow-glow h-12 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang dự đoán...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Predict Success
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Prediction Results - Updated Design */}
          <Card className="gradient-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {prediction !== null ? (
                <div className="space-y-6 animate-scale-in h-full flex flex-col">
                  {/* Main Prediction Card */}
                  <div className={`p-6 rounded-xl border-2 ${getPredictionColor(prediction.label).border} ${getPredictionColor(prediction.label).bg} text-center space-y-4`}>
                    <div className={`text-2xl font-bold ${getPredictionColor(prediction.label).text}`}>
                      {prediction.label}
                    </div>
                    
                    {/* Large Probability Circle */}
                    <div className="flex justify-center">
                      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-4 border-primary/30 shadow-glow flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary">
                            {(prediction.probability * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Probability</div>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Level */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getConfidenceLevel(prediction.probability).bgColor} border`}>
                      <div className={`w-2 h-2 rounded-full ${getConfidenceLevel(prediction.probability).color}`}></div>
                      <span className={`text-sm font-semibold ${getConfidenceLevel(prediction.probability).color}`}>
                        {getConfidenceLevel(prediction.probability).level} Confidence
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prediction Confidence</span>
                      <span className="font-semibold text-primary">{(prediction.probability * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={prediction.probability * 100} className="h-3" />
                  </div>

                  {/* Key Factors */}
                  <div className="space-y-4 flex-grow">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Key Factors
                    </h3>
                    <div className="grid gap-3">
                      {formData.reviews > 50 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="font-medium text-sm">Strong Review Count</div>
                            <div className="text-xs text-muted-foreground">{formData.reviews} reviews</div>
                          </div>
                        </div>
                      )}
                      {formData.rating >= 4.3 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <Star className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="font-medium text-sm">Excellent Rating</div>
                            <div className="text-xs text-muted-foreground">{formData.rating.toFixed(1)} stars</div>
                          </div>
                        </div>
                      )}
                      {formData.price > 300000 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="font-medium text-sm">Premium Pricing</div>
                            <div className="text-xs text-muted-foreground">{formData.price.toLocaleString()} đ</div>
                          </div>
                        </div>
                      )}
                      {prediction.probability < 0.3 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <div>
                            <div className="font-medium text-sm">Improvement Needed</div>
                            <div className="text-xs text-muted-foreground">Consider improving rating or reviews</div>
                          </div>
                        </div>
                      )}
                      {formData.students > 500 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <Users className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="font-medium text-sm">Good Student Base</div>
                            <div className="text-xs text-muted-foreground">{formData.students.toLocaleString()} students</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground h-full flex flex-col items-center justify-center">
                  <Target className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Prediction Yet</h3>
                  <p>Enter course details and click Predict to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Predict;