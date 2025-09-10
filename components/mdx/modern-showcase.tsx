"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedProgress, CircularProgress } from "@/components/ui/animated-progress"
import { LoadingSpinner, Skeleton } from "@/components/ui/loading"
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, FloatingElement, Pulse } from "@/components/ui/animated-elements"
import { Play, Pause, RotateCcw, Sparkles, Zap, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export const ModernShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(30)
  const [likeCount, setLikeCount] = useState(42)
  const [isLiked, setIsLiked] = useState(false)

  const handleProgressUpdate = () => {
    const newProgress = Math.min(progress + 10, 100)
    setProgress(newProgress)
    if (newProgress === 100) {
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl gradient-text mb-4">
            Modern Interactions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience smooth animations, engaging micro-interactions, and modern UI patterns
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Animated Buttons Section */}
          <StaggerItem>
            <AnimatedCard hoverEffect="lift" className="p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                Interactive Buttons
              </h3>
              <div className="space-y-4">
                <AnimatedButton animation="glow" className="w-full">
                  Glow Effect
                </AnimatedButton>
                <AnimatedButton animation="scale" variant="outline" className="w-full">
                  Scale Animation
                </AnimatedButton>
                <AnimatedButton
                  animation="ripple"
                  variant="secondary"
                  className="w-full"
                  onClick={handleLike}
                >
                  <motion.div
                    animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={cn("mr-2 h-4 w-4", isLiked && "fill-current")} />
                  </motion.div>
                  {likeCount} Likes
                </AnimatedButton>
              </div>
            </AnimatedCard>
          </StaggerItem>

          {/* Progress Indicators */}
          <StaggerItem>
            <AnimatedCard hoverEffect="glow" className="p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <RotateCcw className="mr-2 h-5 w-5 text-primary" />
                Progress Indicators
              </h3>
              <div className="space-y-6">
                <div>
                  <AnimatedProgress
                    value={progress}
                    showValue
                    animated
                    color="primary"
                  />
                  <AnimatedButton
                    onClick={handleProgressUpdate}
                    size="sm"
                    className="mt-2 w-full"
                  >
                    Update Progress
                  </AnimatedButton>
                </div>
                <div className="flex justify-center">
                  <CircularProgress value={progress} size={80} showValue />
                </div>
              </div>
            </AnimatedCard>
          </StaggerItem>

          {/* Loading States */}
          <StaggerItem>
            <AnimatedCard hoverEffect="tilt" className="p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Loading States
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <LoadingSpinner variant="default" size="sm" />
                  <LoadingSpinner variant="dots" />
                  <LoadingSpinner variant="bars" />
                </div>
                <div className="space-y-2">
                  <Skeleton variant="text" lines={3} animation="wave" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton variant="circular" />
                  <div className="flex-1">
                    <Skeleton variant="text" lines={2} />
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </StaggerItem>
        </div>

        {/* Interactive Demo Section */}
        <FadeIn direction="up" delay={0.3}>
          <AnimatedCard className="p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Interactive Playground</h3>
                  <p className="text-muted-foreground">
                    Click the play button to see animations in action
                  </p>
                </div>
                <AnimatedButton
                  onClick={() => setIsPlaying(!isPlaying)}
                  animation="scale"
                  size="lg"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </AnimatedButton>
              </div>

              <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <StaggerItem key={i}>
                    <motion.div
                      className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center"
                      animate={isPlaying ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: isPlaying ? Infinity : 0,
                        delay: i * 0.1,
                      }}
                    >
                      <motion.div
                        className="w-8 h-8 bg-primary rounded-full"
                        animate={isPlaying ? {
                          scale: [1, 0.8, 1],
                        } : {}}
                        transition={{
                          duration: 1,
                          repeat: isPlaying ? Infinity : 0,
                          delay: i * 0.1,
                        }}
                      />
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Floating background elements */}
            <FloatingElement
              intensity={0.5}
              duration={4}
              className="absolute top-10 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
            >
              <div />
            </FloatingElement>
            <FloatingElement
              intensity={0.3}
              duration={6}
              className="absolute bottom-10 left-10 w-16 h-16 bg-secondary/10 rounded-full blur-lg"
            >
              <div />
            </FloatingElement>
            <FloatingElement
              intensity={0.4}
              duration={5}
              className="absolute top-1/2 left-1/4 w-12 h-12 bg-accent/20 rounded-full blur-md"
            >
              <div />
            </FloatingElement>
          </AnimatedCard>
        </FadeIn>

        {/* Call to Action */}
        <FadeIn direction="up" delay={0.5} className="text-center mt-16">
          <Pulse scale={1.02} duration={3}>
            <AnimatedButton size="lg" animation="glow" className="px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Experience the Magic
            </AnimatedButton>
          </Pulse>
        </FadeIn>
      </div>
    </section>
  )
}
