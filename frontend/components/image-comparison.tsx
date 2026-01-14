"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface ImageComparisonProps {
  originalImage: string
  processedImage: string
  originalLabel?: string
  processedLabel?: string
}

export default function ImageComparison({
  originalImage,
  processedImage,
  originalLabel = "원본 이미지",
  processedLabel = "분석 결과",
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4 text-sm font-medium text-gray-600">
        <span>{originalLabel}</span>
        <span>{processedLabel}</span>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-96 overflow-hidden rounded-lg cursor-ew-resize comparison-slider"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Original Image */}
        <img
          src={originalImage || "/placeholder.png"}
          alt={originalLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Processed Image */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
          <img src={processedImage || "/placeholder.png"} alt={processedLabel} className="w-full h-full object-cover" />
        </div>

        {/* Slider Handle */}
        <div className="slider-handle" style={{ left: `${sliderPosition}%` }} />
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">마우스를 드래그하여 이미지를 비교해보세요</div>
    </div>
  )
}
