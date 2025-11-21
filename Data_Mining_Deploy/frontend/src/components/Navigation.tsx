import { Link, useLocation } from "react-router-dom";
import { Brain, BarChart3, Target, Sparkles, Info } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: "/",          label: "Home",      icon: Brain },
    { path: "/analytics", label: "Insights",  icon: BarChart3 },
    { path: "/predict",   label: "Predict",   icon: Target },
    { path: "/recommend", label: "Recommend", icon: Sparkles },
    { path: "/about",     label: "About",     icon: Info },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Brain className="w-8 h-8 text-primary animate-glow" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UdemyAI
            </span>
          </Link>

          {/* Routes (desktop) + Theme toggle */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* 🔆 Nút bật/tắt theme — đặt NGAY SAU About, cùng hàng routes */}
            <div className="ml-2 pl-3 border-l border-border/40">
              <ThemeToggle />
            </div>
          </div>

          {/* Theme toggle cho mobile (khi menu ẩn) */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
