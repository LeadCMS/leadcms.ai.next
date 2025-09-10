"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: "vertical" | "horizontal"
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className,
  direction = "vertical"
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 }

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]),
    springConfig
  )

  const x = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]),
    springConfig
  )

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        style={direction === "vertical" ? { y } : { x }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Scroll-triggered reveal component
interface ScrollRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  className?: string
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.2"]
  })

  const directions = {
    up: { y: [50, 0], x: [0, 0] },
    down: { y: [-50, 0], x: [0, 0] },
    left: { x: [50, 0], y: [0, 0] },
    right: { x: [-50, 0], y: [0, 0] }
  }

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const yTransform = useTransform(scrollYProgress, [0, 1], directions[direction].y)
  const xTransform = useTransform(scrollYProgress, [0, 1], directions[direction].x)

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          opacity,
          y: yTransform,
          x: xTransform
        }}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Background parallax component
interface BackgroundParallaxProps {
  children: React.ReactNode
  backgroundImage?: string
  speed?: number
  className?: string
}

export const BackgroundParallax: React.FC<BackgroundParallaxProps> = ({
  children,
  backgroundImage,
  speed = 0.5,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            y,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Smooth scroll progress indicator
export const ScrollProgress: React.FC<{ className?: string }> = ({ className }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-primary transform-gpu z-50",
        className
      )}
      style={{ scaleX, transformOrigin: "0%" }}
    />
  )
}
