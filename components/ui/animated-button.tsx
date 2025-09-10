"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  animation?: "scale" | "slide" | "glow" | "ripple"
  children: React.ReactNode
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ className, animation = "scale", isLoading, children, ...props }, ref) => {
  const animations = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring" as const, stiffness: 400, damping: 17 }
    },
    slide: {
      whileHover: { x: 2, y: -2 },
      whileTap: { x: 0, y: 0 },
      transition: { type: "spring" as const, stiffness: 400, damping: 17 }
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        scale: 1.02
      },
      transition: { duration: 0.2 }
    },
    ripple: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring" as const, stiffness: 400, damping: 17 }
    }
  }

  return (
    <motion.div {...animations[animation]}>
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          animation === "glow" && "border-2 border-primary/20",
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {animation === "ripple" && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-md"
            initial={{ scale: 0, opacity: 1 }}
            whileTap={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  )
})

AnimatedButton.displayName = "AnimatedButton"
