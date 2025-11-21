"use client"

import { useEffect, useRef, useState } from "react"

export const useScrollAnimation = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"down" | "up" | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // Unobserve after animation triggers
          observer.unobserve(entry.target)
        } else if (!entry.isIntersecting && isInView) {
          if (window.scrollY < lastScrollY.current) {
            setScrollDirection("up")
            setIsInView(false)
          }
        }
      },
      {
        threshold: 0.1,
        ...options,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    const handleScroll = () => {
      lastScrollY.current = window.scrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isInView, options])

  return { ref, isInView, scrollDirection }
}
