"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  hoverEffect?: "lift" | "tilt" | "glow" | "scale"
  children: React.ReactNode
}

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  AnimatedCardProps
>(({ className, hoverEffect = "lift", children, ...props }, ref) => {
  const effects = {
    lift: {
      whileHover: {
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      },
      transition: { duration: 0.2 }
    },
    tilt: {
      whileHover: {
        rotateY: 5,
        rotateX: 5,
        scale: 1.02
      },
      transition: { duration: 0.2 }
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
        borderColor: "rgba(59, 130, 246, 0.5)"
      },
      transition: { duration: 0.2 }
    },
    scale: {
      whileHover: { scale: 1.03 },
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      ref={ref}
      {...effects[hoverEffect]}
      style={{ perspective: 1000 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-colors duration-200",
          hoverEffect === "glow" && "border-2",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  )
})

AnimatedCard.displayName = "AnimatedCard"

// Animated card content components
export const AnimatedCardHeader = ({ children, className, ...props }: React.ComponentProps<typeof CardHeader>) => (
  <CardHeader className={cn("relative overflow-hidden", className)} {...props}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  </CardHeader>
)

export const AnimatedCardContent = ({ children, className, ...props }: React.ComponentProps<typeof CardContent>) => (
  <CardContent className={className} {...props}>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  </CardContent>
)
