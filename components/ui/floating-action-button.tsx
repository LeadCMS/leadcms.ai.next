"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface FloatingActionButtonProps {
  contactHref?: string
  showScrollToTop?: boolean
  className?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  contactHref = "#contact-form",
  showScrollToTop = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    if (!showScrollToTop) return

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showScrollToTop])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Main FAB */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="default"
            className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative overflow-hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </Button>
        </motion.div>
      </motion.div>

      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {/* Contact Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                asChild
                size="default"
                className="w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
              >
                <Link href={contactHref}>
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Scroll to Top Button */}
            {showScrollToTop && showScrollTop && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="default"
                  className="w-12 h-12 rounded-full shadow-lg bg-green-600 hover:bg-green-700"
                  onClick={scrollToTop}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingActionButton
