"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MicroInteractionButtonProps extends ButtonProps {
  animation?: "bounce" | "pulse" | "shake" | "rotate" | "glow"
  hoverScale?: number
  tapScale?: number
  children: React.ReactNode
}

const animations = {
  bounce: {
    initial: { y: 0 },
    hover: { y: [-2, 0, -2, 0] },
    tap: { y: 2 }
  },
  pulse: {
    initial: { scale: 1 },
    hover: { scale: [1, 1.05, 1] },
    tap: { scale: 0.95 }
  },
  shake: {
    initial: { x: 0 },
    hover: { x: [-1, 1, -1, 1, 0] },
    tap: { x: 0 }
  },
  rotate: {
    initial: { rotate: 0 },
    hover: { rotate: [0, 5, -5, 0] },
    tap: { rotate: 0 }
  },
  glow: {
    initial: { boxShadow: "0 0 0 rgba(var(--primary), 0)" },
    hover: { boxShadow: "0 0 20px rgba(var(--primary), 0.3)" },
    tap: { scale: 0.98 }
  }
}

export const MicroInteractionButton: React.FC<MicroInteractionButtonProps> = ({
  animation = "pulse",
  hoverScale = 1.02,
  tapScale = 0.98,
  className,
  children,
  ...props
}) => {
  const selectedAnimation = animations[animation]

  return (
    <motion.div
      initial={selectedAnimation.initial}
      whileHover={selectedAnimation.hover}
      whileTap={selectedAnimation.tap}
      transition={{ duration: 0.2 }}
    >
      <Button
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}

interface InteractiveLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  underlineAnimation?: "slide" | "grow" | "bounce"
  external?: boolean
}

export const InteractiveLink: React.FC<InteractiveLinkProps> = ({
  href,
  children,
  className = "",
  underlineAnimation = "slide",
  external = false,
}) => {
  const underlineVariants = {
    slide: {
      initial: { scaleX: 0, originX: 0 },
      hover: { scaleX: 1 }
    },
    grow: {
      initial: { scaleX: 0 },
      hover: { scaleX: 1 }
    },
    bounce: {
      initial: { scaleY: 0 },
      hover: { scaleY: 1 }
    }
  }

  const selected = underlineVariants[underlineAnimation]

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn("relative inline-block", className)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
        initial={selected.initial}
        whileHover={selected.hover}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.a>
  )
}

interface FloatingLabelInputProps {
  id: string
  type: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  required?: boolean
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  className = "",
  required = false,
}) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const hasValue = value.length > 0

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder=" " // Required for CSS peer selector to work
        aria-label={label}
        className="peer w-full px-3 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      />
      <motion.label
        htmlFor={id}
        className="absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none"
        animate={{
          y: isFocused || hasValue ? -24 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
        }}
        style={{
          originX: 0,
          originY: 0.5
        }}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </motion.label>
    </div>
  )
}

export default MicroInteractionButton
