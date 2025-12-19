"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="sm"
        className="group h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-gray-500/20 backdrop-blur-md border border-white/10 hover:bg-gray-400/30"
        aria-label="回到頂部"
      >
        <ChevronUp className="h-4 w-4 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
        <span className="sr-only">回到頂部</span>
      </Button>

      {/* 懸停提示 */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">回到頂部</div>
      </div>
    </div>
  )
}
