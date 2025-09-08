"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = "default",
  onClose,
}) => {
  const variants = {
    default: {
      icon: Info,
      className: "border-border bg-background text-foreground",
    },
    success: {
      icon: CheckCircle,
      className: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/10 dark:text-green-400",
    },
    error: {
      icon: AlertCircle,
      className: "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-900/10 dark:text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/10 dark:text-yellow-400",
    },
    info: {
      icon: Info,
      className: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-900/10 dark:text-blue-400",
    },
  }

  const { icon: Icon, className } = variants[variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all hover:shadow-xl",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          {title && (
            <div className="text-sm font-semibold">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
      <button
        onClick={() => onClose(id)}
        aria-label="Close notification"
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

// Toast container component
interface ToastContainerProps {
  toasts: ToastProps[]
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = "top-right",
}) => {
  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "top-center": "top-0 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2",
  }

  return (
    <div className={cn(
      "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]",
      positionClasses[position]
    )}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            className="mb-2 last:mb-0"
          >
            <Toast {...toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Notification banner component
interface NotificationBannerProps {
  isVisible: boolean
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  isVisible,
  title,
  description,
  variant = "default",
  onClose,
  action,
}) => {
  const variants = {
    default: "bg-background border-border",
    success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/10 dark:border-green-800 dark:text-green-400",
    error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/10 dark:border-yellow-800 dark:text-yellow-400",
    info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/10 dark:border-blue-800 dark:text-blue-400",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "border-b overflow-hidden",
            variants[variant]
          )}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  {title && (
                    <div className="text-sm font-medium">{title}</div>
                  )}
                  {description && (
                    <div className="text-sm opacity-90">{description}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {action && (
                  <button
                    onClick={action.onClick}
                    className="text-sm font-medium underline hover:no-underline"
                  >
                    {action.label}
                  </button>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close banner"
                    className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
