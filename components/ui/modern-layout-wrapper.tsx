"use client"

import React from "react"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { ScrollProgress } from "@/components/ui/scroll-progress"

interface ModernLayoutWrapperProps {
  children: React.ReactNode
  showScrollProgress?: boolean
  showFloatingActions?: boolean
  contactHref?: string
  className?: string
}

export const ModernLayoutWrapper: React.FC<ModernLayoutWrapperProps> = ({
  children,
  showScrollProgress = true,
  showFloatingActions = true,
  contactHref = "#contact-form",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Scroll Progress */}
      {showScrollProgress && <ScrollProgress showPercentage={false} />}

      {/* Main Content */}
      {children}

      {/* Floating Action Button */}
      {showFloatingActions && (
        <FloatingActionButton
          contactHref={contactHref}
          showScrollToTop={true}
        />
      )}
    </div>
  )
}

export default ModernLayoutWrapper
