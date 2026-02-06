"use client"

import React from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LightboxImageData {
  id: string
  src: string
  alt?: string
}

interface LightboxContextValue {
  registerImage: (id: string, src: string, alt?: string) => void
  openById: (id: string) => void
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null)

function useLightboxContext() {
  const context = React.useContext(LightboxContext)
  if (!context) {
    throw new Error("Lightbox components must be used within ImageLightboxProvider")
  }
  return context
}

interface ImageLightboxProviderProps {
  children: React.ReactNode
}

export function ImageLightboxProvider({ children }: ImageLightboxProviderProps) {
  const [images, setImages] = React.useState<LightboxImageData[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const registerImage = React.useCallback((id: string, src: string, alt?: string) => {
    setImages((prev) => {
      const existingIndex = prev.findIndex((img) => img.id === id)
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = { id, src, alt }
        return next
      }
      return [...prev, { id, src, alt }]
    })
  }, [])

  const openById = React.useCallback((id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      if (index !== -1) {
        setCurrentIndex(index)
        setIsOpen(true)
      }
      return prev
    })
  }, [])

  const close = React.useCallback(() => setIsOpen(false), [])

  const goPrev = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (images.length === 0) return prev
      return (prev - 1 + images.length) % images.length
    })
  }, [images.length])

  const goNext = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (images.length === 0) return prev
      return (prev + 1) % images.length
    })
  }, [images.length])

  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        goNext()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, close, goPrev, goNext])

  const currentImage = images[currentIndex]

  return (
    <LightboxContext.Provider value={{ registerImage, openById }}>
      {children}

      {isOpen && currentImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative mx-auto flex max-h-[90vh] flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={currentImage.src}
                  alt={currentImage.alt || ""}
                  className="max-h-[70vh] sm:max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />

                <button
                  type="button"
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-2 text-white shadow-lg hover:bg-black/90 sm:-top-8 sm:right-0 sm:translate-x-full"
                  onClick={close}
                  aria-label="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white shadow-lg hover:bg-black/90 sm:left-0 sm:-translate-x-[calc(100%+12px)]"
                      onClick={goPrev}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white shadow-lg hover:bg-black/90 sm:right-0 sm:translate-x-[calc(100%+12px)]"
                      onClick={goNext}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {currentImage.alt && (
                <div className="text-center text-sm text-white/90">{currentImage.alt}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  )
}

export function LightboxImage({ className, ...props }: React.ComponentPropsWithoutRef<"img">) {
  const { registerImage, openById } = useLightboxContext()
  const id = React.useId()

  React.useEffect(() => {
    if (!props.src) return
    registerImage(id, props.src.toString(), props.alt)
  }, [id, props.src, props.alt, registerImage])

  if (!props.src) {
    return null
  }

  return (
    <img
      {...props}
      alt={props.alt || ""}
      onClick={() => openById(id)}
      className={cn(
        "cursor-zoom-in rounded-lg border shadow-md my-8 mx-auto max-w-full w-auto h-auto object-contain",
        className
      )}
    />
  )
}
