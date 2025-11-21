import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingIcons } from "@/components/FloatingIcons";
import Navigation from "@/components/Navigation";

import Landing from "@/pages/Landing";
import Analytics from "@/pages/Analytics";
import Predict from "@/pages/Predict";
import Recommend from "@/pages/Recommend";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Notifications */}
          <Toaster />
          <Sonner />

          {/* Router */}
          <BrowserRouter>
            {/* Floating icons ở nền */}
            <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
              <FloatingIcons />

              {/* Navbar cố định */}
              <Navigation />

              {/* Nội dung trang */}
              <main className="pt-16 relative z-10">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/predict" element={<Predict />} />
                  <Route path="/recommend" element={<Recommend />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
