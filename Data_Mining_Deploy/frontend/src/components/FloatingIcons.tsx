"use client"

import { useEffect, useState } from "react"

interface FloatingIcon {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  emoji: string
}

const EMOJIS = ["✨", "🌟", "💫", "⭐", "🎯", "🚀", "💡", "🎨", "🌈", "☁️", "🌤", "🌙"]
export function FloatingIcons() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    const newIcons: FloatingIcon[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 20,
      duration: Math.random() * 10 + 15, // giây
      delay: Math.random() * 3,          // giây
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }))
    setIcons(newIcons)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute animate-float"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: `${icon.size}px`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
            opacity: 0.4,
          }}
        >
          {icon.emoji}
        </div>
      ))}
    </div>
  )
}
