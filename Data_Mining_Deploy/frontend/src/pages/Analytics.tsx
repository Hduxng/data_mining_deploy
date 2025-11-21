"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Star, DollarSign } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
  Line,
} from "recharts"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const Analytics = () => {
  const headerRef = useScrollAnimation()
  const kpiRef = useScrollAnimation()
  const driversRef = useScrollAnimation()
  const bestsellerRef = useScrollAnimation()
  const discountRef = useScrollAnimation()
  const bubbleRef = useScrollAnimation()
  const contentRef = useScrollAnimation()
  const insightsRef = useScrollAnimation()

  // ===== KPI =====
  const kpiData = [
    { label: "Total Courses", value: "10,179", icon: Users, color: "text-blue-500" },
    { label: "Avg Rating", value: "4.27", icon: Star, color: "text-yellow-500" },
    { label: "Bestsellers", value: "25.4%", icon: TrendingUp, color: "text-green-500" },
    { label: "Avg Price", value: "321,387 VNĐ", icon: DollarSign, color: "text-purple-500" },
  ]

  // ===== Bestseller share =====
  const bestsellerCountData = [
    { label: "Non-Bestseller", value: 7595, color: "#6ea8fe" },
    { label: "Bestseller", value: 2584, color: "#ff7f6e" },
  ]
  const totalCourses = bestsellerCountData.reduce((s, d) => s + d.value, 0)
  const bestsellerPieData = bestsellerCountData.map((d) => ({
    name: d.label,
    value: d.value,
    percentage: ((d.value / totalCourses) * 100).toFixed(1),
  }))
  const pieColors = ["#6ea8fe", "#ff7f6e"]

  // ===== Drivers of Bestseller =====
  const drivers = [
    { feature: "Discount", corr: 0.367, label: "0.367 ***" },
    { feature: "Course Length", corr: 0.1, label: "0.100 ***" },
    { feature: "Number of Reviews", corr: 0.088, label: "0.088 ***" },
    { feature: "Lectures Count", corr: 0.086, label: "0.086 ***" },
    { feature: "Sections Count", corr: 0.084, label: "0.084 ***" },
    { feature: "Student Count", corr: 0.082, label: "0.082 ***" },
    { feature: "Price", corr: 0.01, label: "0.010 ns" },
    { feature: "Rating", corr: -0.112, label: "-0.112 ***" },
  ].sort((a, b) => b.corr - a.corr)

  // ===== Discount bands =====
  const discountBins = [
    { bin: "0–20%", yes: 180, no: 1050, yes_rate: 0.146 },
    { bin: "20–40%", yes: 410, no: 2100, yes_rate: 0.163 },
    { bin: "40–60%", yes: 690, no: 1900, yes_rate: 0.266 },
    { bin: "60–80%", yes: 890, no: 1500, yes_rate: 0.372 },
    { bin: "80–100%", yes: 390, no: 450, yes_rate: 0.464 },
  ]

  // ===== Rating distribution =====
  const ratingBins = [
    { bin: "3.5–3.8", yes: 25, no: 120 },
    { bin: "3.8–4.1", yes: 90, no: 460 },
    { bin: "4.1–4.3", yes: 210, no: 980 },
    { bin: "4.3–4.5", yes: 520, no: 1850 },
    { bin: "4.5–4.7", yes: 830, no: 1900 },
    { bin: "4.7–4.9", yes: 720, no: 1050 },
    { bin: "4.9–5.0", yes: 189, no: 185 },
  ]

  // ===== Price × Discount × Students =====
  const bubblesYes = [
    { price: 360000, discount: 0.8, num_students: 160000 },
    { price: 340000, discount: 0.75, num_students: 120000 },
    { price: 300000, discount: 0.82, num_students: 180000 },
    { price: 330000, discount: 0.68, num_students: 90000 },
    { price: 370000, discount: 0.84, num_students: 140000 },
    { price: 320000, discount: 0.78, num_students: 110000 },
    { price: 350000, discount: 0.72, num_students: 130000 },
  ]
  const bubblesNo = [
    { price: 290000, discount: 0.25, num_students: 40000 },
    { price: 320000, discount: 0.3, num_students: 60000 },
    { price: 350000, discount: 0.2, num_students: 30000 },
    { price: 380000, discount: 0.28, num_students: 80000 },
    { price: 300000, discount: 0.55, num_students: 50000 },
    { price: 330000, discount: 0.35, num_students: 45000 },
    { price: 360000, discount: 0.4, num_students: 70000 },
  ]

  // ===== Content depth vs rating =====
  const lengthBins = [
    { bin: "0–200", count: 900, mean_rating: 4.35 },
    { bin: "200–400", count: 2600, mean_rating: 4.42 },
    { bin: "400–600", count: 3100, mean_rating: 4.47 },
    { bin: "600–900", count: 2100, mean_rating: 4.52 },
    { bin: "900–1200", count: 1050, mean_rating: 4.5 },
    { bin: "1200+", count: 420, mean_rating: 4.46 },
  ]

  // Custom tooltip style
  const customTooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ===== Header ===== */}
      <div ref={headerRef.ref} className={`space-y-2 ${headerRef.isInView ? "animate-fade-in" : "opacity-0"}`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Comprehensive insights from Udemy course data</p>
      </div>

      {/* ===== KPI row ===== */}
      <div
        ref={kpiRef.ref}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${kpiRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}
      >
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div
              key={index}
              className={`${kpiRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
                      <p className="text-3xl font-bold mt-2 text-foreground">{kpi.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-background/80 ${kpi.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* ===== Row 2: Drivers of Bestseller ===== */}
      <div ref={driversRef.ref} className={`${driversRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              What Drives a Bestseller? (Correlation Analysis)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={drivers} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[-0.15, 0.4]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  width={110}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(3)}`, "Correlation"]}
                  contentStyle={customTooltipStyle}
                  cursor={{ fill: "rgba(0,0,0,0.1)" }}
                />
                <Bar
                  dataKey="corr"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="label"
                    position="right"
                    fill="hsl(var(--foreground))"
                    fontSize={12}
                    fontWeight="500"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 3: Bestseller share (Bar + Pie) ===== */}
      <div
        ref={bestsellerRef.ref}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${bestsellerRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}
      >
        {/* Distribution Bar */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Distribution of Bestseller Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={bestsellerCountData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name) => [value.toLocaleString(), "Number of Courses"]}
                />
                <Bar
                  dataKey="value"
                  fill="#ff7f6e"
                  radius={[6, 6, 0, 0]}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value: number) => value.toLocaleString()}
                    fill="hsl(var(--foreground))"
                    fontSize={12}
                    fontWeight="600"
                  />
                  {bestsellerCountData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Percentage Pie */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Percentage Distribution of Bestseller</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={bestsellerPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="value"
                  nameKey="name"
                  labelLine={true}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  animationBegin={0}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {bestsellerPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name, props) => [
                    `${value.toLocaleString()} (${props.payload.percentage}%)`,
                    "Courses",
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
                      {value} ({entry.payload.percentage}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 4: Discount bands + Rating distribution ===== */}
      <div
        ref={discountRef.ref}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${discountRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}
      >
        {/* Discount bands */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Bestseller Rate by Discount Band</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={discountBins} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bin" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name: string, props: any) =>
                    name === "yes"
                      ? [`${value} (${(props.payload.yes_rate * 100).toFixed(1)}%)`, "Bestseller"]
                      : [value, "Non-Bestseller"]
                  }
                />
                <Legend />
                <Bar
                  dataKey="no"
                  name="Non-Bestseller"
                  stackId="a"
                  fill="#6ea8fe"
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="yes"
                  name="Bestseller"
                  stackId="a"
                  fill="#ff7f6e"
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="yes_rate"
                    position="top"
                    formatter={(rate: number) => `${(rate * 100).toFixed(0)}%`}
                    fill="hsl(var(--foreground))"
                    fontSize={11}
                    fontWeight="600"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating distribution (overlay) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Rating Distribution (Bestseller vs Non-Bestseller)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={ratingBins} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bin" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name: string) =>
                    name === "yes" ? [value, "Bestseller"] : [value, "Non-Bestseller"]
                  }
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
                      {value === "yes" ? "Bestseller" : "Non-Bestseller"}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="no"
                  name="no"
                  stackId="1"
                  fill="#6ea8fe"
                  stroke="#6ea8fe"
                  fillOpacity={0.7}
                  strokeWidth={2}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="yes"
                  name="yes"
                  stackId="1"
                  fill="#ff7f6e"
                  stroke="#ff7f6e"
                  fillOpacity={0.7}
                  strokeWidth={2}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 5: Bubble chart ===== */}
      <div ref={bubbleRef.ref} className={`${bubbleRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Price × Discount × Popularity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="price"
                  name="Price (VND)"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="number"
                  dataKey="discount"
                  name="Discount"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name: string) => {
                    if (name === "discount") return [`${(Number(value) * 100).toFixed(1)}%`, "Discount"]
                    if (name === "price") return [`${Number(value).toLocaleString()} VND`, "Price"]
                    if (name === "num_students") return [value.toLocaleString(), "Students"]
                    return [value, name]
                  }}
                />
                <Legend />
                <Scatter
                  name="Bestseller"
                  data={bubblesYes}
                  fill="#ff7f6e"
                  fillOpacity={0.7}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {bubblesYes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#ff7f6e" r={Math.sqrt(entry.num_students) / 300 + 6} />
                  ))}
                </Scatter>
                <Scatter
                  name="Non-Bestseller"
                  data={bubblesNo}
                  fill="#6ea8fe"
                  fillOpacity={0.7}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {bubblesNo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#6ea8fe" r={Math.sqrt(entry.num_students) / 300 + 6} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 6: Content depth vs rating ===== */}
      <div ref={contentRef.ref} className={`${contentRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Content Depth vs. Mean Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={lengthBins} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bin" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[4.3, 4.6]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value: number, name: string) => {
                    if (name === "mean_rating") return [value.toFixed(2), "Mean Rating"]
                    if (name === "count") return [value.toLocaleString(), "Course Count"]
                    return [value, name]
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="Course Count"
                  fill="#6ea8fe"
                  fillOpacity={0.7}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mean_rating"
                  name="Mean Rating"
                  stroke="#ff7f6e"
                  strokeWidth={3}
                  dot={{ fill: "#ff7f6e", r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#ff7f6e" }}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Insights ===== */}
      <div ref={insightsRef.ref} className={`${insightsRef.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
        <Card className="border-primary/30 shadow-lg bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="w-5 h-5 text-primary" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-foreground">
                <span className="font-semibold text-primary">Discount</span> is the strongest driver of Bestseller
                status; courses with discounts ≥60% show significantly higher bestseller rates (37-46%).
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
              <p className="text-foreground">
                <span className="font-semibold text-green-500">Rating distribution</span> shows bestsellers concentrate
                in the 4.5–5.0 range, while non-bestsellers are more evenly distributed across lower ratings.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
              <p className="text-foreground">
                <span className="font-semibold text-purple-500">Content depth</span> between 400–900 minutes correlates
                with peak mean ratings (~4.52), suggesting optimal course length for student satisfaction.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
              <p className="text-foreground">
                <span className="font-semibold text-orange-500">Bubble analysis</span> reveals bestsellers typically
                combine higher discounts with moderate pricing and strong student enrollment numbers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
