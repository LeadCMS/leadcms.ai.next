"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "bars" | "pulse" | "orbit"
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  className,
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const sizeClass = sizes[size]

  if (variant === "default") {
    return (
      <motion.div
        className={cn(
          "border-2 border-primary/30 border-t-primary rounded-full",
          sizeClass,
          className
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-full"
            style={{ height: size === "sm" ? "16px" : size === "md" ? "24px" : size === "lg" ? "32px" : "40px" }}
            animate={{
              scaleY: [1, 2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn(
          "bg-primary rounded-full",
          sizeClass,
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    )
  }

  if (variant === "orbit") {
    return (
      <div className={cn("relative", sizeClass, className)}>
        <motion.div
          className="absolute inset-0 border-2 border-primary/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `0 ${size === "sm" ? "10px" : size === "md" ? "18px" : size === "lg" ? "26px" : "34px"}` }}
        />
      </div>
    )
  }

  return null
}

// Skeleton loading component
interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  animation?: "pulse" | "wave"
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  animation = "pulse",
  lines = 1,
}) => {
  const baseClasses = "bg-muted rounded animate-pulse"

  const variantClasses = {
    text: "h-4 w-full",
    circular: "w-10 h-10 rounded-full",
    rectangular: "h-4 w-full rounded"
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(baseClasses, variantClasses[variant])}
            style={{ width: i === lines - 1 ? "80%" : "100%" }}
            animate={animation === "wave" ? {
              opacity: [0.5, 1, 0.5],
            } : undefined}
            transition={animation === "wave" ? {
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            } : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      animate={animation === "wave" ? {
        opacity: [0.5, 1, 0.5],
      } : undefined}
      transition={animation === "wave" ? {
        duration: 1.5,
        repeat: Infinity,
      } : undefined}
    />
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  spinnerVariant?: LoadingSpinnerProps["variant"]
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  loadingText = "Loading...",
  spinnerVariant = "default",
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner variant={spinnerVariant} size="lg" />
            <p className="text-muted-foreground">{loadingText}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
