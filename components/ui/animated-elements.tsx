"use client"

import React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

// Fade in animation component
export const FadeIn = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  ...props
}: {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={inView ? {
        opacity: 1,
        x: 0,
        y: 0
      } : {}}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scale in animation component
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.8
      }}
      animate={inView ? {
        opacity: 1,
        scale: 1
      } : {}}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger animation for lists
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  [key: string]: any
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({
  children,
  direction = "up",
  className,
  ...props
}: {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  className?: string
  [key: string]: any
}) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          ...directions[direction]
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Floating animation for decorative elements
export const FloatingElement = ({
  children,
  intensity = 1,
  duration = 3,
  className,
  ...props
}: {
  children: React.ReactNode
  intensity?: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      animate={{
        y: [-10 * intensity, 10 * intensity, -10 * intensity],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Hover lift effect
export const HoverLift = ({
  children,
  liftHeight = 8,
  className,
  ...props
}: {
  children: React.ReactNode
  liftHeight?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      whileHover={{
        y: -liftHeight,
        transition: { duration: 0.2 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation for attention-grabbing elements
export const Pulse = ({
  children,
  scale = 1.05,
  duration = 2,
  className,
  ...props
}: {
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Typewriter effect
export const TypeWriter = ({
  text,
  delay = 0.05,
  speed,
  startDelay = 0,
  className,
  ...props
}: {
  text: string
  delay?: number
  speed?: number
  startDelay?: number
  className?: string
  [key: string]: any
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // If speed is provided, convert it to delay (speed is characters per second)
  const characterDelay = speed ? 1000 / speed / 1000 : delay

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: characterDelay,
            delayChildren: startDelay / 1000,
          },
        },
      }}
      className={className}
      {...props}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}
