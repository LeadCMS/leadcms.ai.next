"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ScrollProgressProps {
  className?: string
  color?: string
  height?: number
  showPercentage?: boolean
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = "",
  color = "hsl(var(--primary))",
  height = 3,
  showPercentage = false,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Progress Bar */}
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-background/10 backdrop-blur-sm ${className}`}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="h-full rounded-r-full bg-gradient-to-r from-primary to-primary/80 shadow-lg"
          initial={{ width: "0%" }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />
      </div>

      {/* Percentage Indicator */}
      {showPercentage && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium border shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: scrollProgress > 5 ? 1 : 0,
            scale: scrollProgress > 5 ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(scrollProgress)}%
        </motion.div>
      )}
    </>
  )
}

interface CircularScrollProgressProps {
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
}

export const CircularScrollProgress: React.FC<CircularScrollProgressProps> = ({
  size = 60,
  strokeWidth = 4,
  className = "",
  color = "hsl(var(--primary))",
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <motion.div
      className={`fixed bottom-6 left-6 z-50 ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: scrollProgress > 5 ? 1 : 0,
        scale: scrollProgress > 5 ? 1 : 0
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted-foreground/20"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out drop-shadow-md"
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">
            {Math.round(scrollProgress)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default ScrollProgress
