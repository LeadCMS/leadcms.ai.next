"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { captureUtmParams, stripUtmParamsFromUrl } from "@/lib/utm-tracking"
import { trackContentTags } from "@/lib/tag-tracking"

interface TrackingCaptureProps {
  contentTags?: string[]
}

export function TrackingCapture({ contentTags }: TrackingCaptureProps) {
  const pathname = usePathname()
  const contentTagsRef = useRef(contentTags)
  contentTagsRef.current = contentTags

  useEffect(() => {
    const search = window.location.search
    const fullPath = `${pathname}${search}`

    const captured = captureUtmParams(search)
    trackContentTags(contentTagsRef.current)

    if (captured) {
      const cleanPath = stripUtmParamsFromUrl(fullPath)
      if (cleanPath != null) {
        window.history.replaceState(null, "", cleanPath)
      }
    }
  }, [pathname])

  return null
}
