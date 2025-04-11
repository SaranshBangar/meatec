"use client"

import { type ReactNode, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"

interface AnimateWrapperProps {
  children: ReactNode
}

export default function AnimateWrapper({ children }: AnimateWrapperProps) {
  const location = useLocation()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (wrapper) {
      // Reset position
      wrapper.style.opacity = "0"
      wrapper.style.transform = "translateY(20px)"

      // Animate in
      const timeout = setTimeout(() => {
        wrapper.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        wrapper.style.opacity = "1"
        wrapper.style.transform = "translateY(0)"
      }, 50)

      return () => clearTimeout(timeout)
    }
  }, [location.pathname])

  return (
    <div ref={wrapperRef} className="min-h-screen w-full">
      {children}
    </div>
  )
}
