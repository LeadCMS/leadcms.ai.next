'use client'

import { useEffect, useState } from 'react'

export type DetectedOS = 'windows' | 'macos' | 'linux' | 'unknown'

/**
 * Maps detected OS to display labels.
 * Handles aliases like Ubuntu -> Linux.
 */
export const OS_LABELS: Record<DetectedOS, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  unknown: '',
}

/**
 * Checks if a tab OS label matches the detected OS.
 * Handles aliases like "Ubuntu" matching "Linux".
 */
export function matchesDetectedOS(tabOS: string, detectedOS: DetectedOS): boolean {
  const tabLower = tabOS.toLowerCase()
  const detectedLabel = OS_LABELS[detectedOS].toLowerCase()

  if (!detectedLabel) return false
  if (tabLower === detectedLabel) return true

  // Handle aliases: Ubuntu, Debian, Fedora, etc. all match Linux
  if (detectedOS === 'linux') {
    return (
      tabLower === 'ubuntu' ||
      tabLower === 'debian' ||
      tabLower === 'fedora' ||
      tabLower === 'linux'
    )
  }

  return false
}

/**
 * Hook to detect the user's operating system.
 * Returns the detected OS type and whether detection is complete.
 */
export function useOSDetection() {
  const [os, setOS] = useState<DetectedOS>('unknown')
  const [isDetected, setIsDetected] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const userAgent = window.navigator.userAgent.toLowerCase()

    let detectedOS: DetectedOS = 'unknown'

    // Check for Windows
    if (userAgent.includes('windows') || userAgent.includes('win32') || userAgent.includes('win64')) {
      detectedOS = 'windows'
    }
    // Check for macOS
    else if (
      userAgent.includes('mac os') ||
      userAgent.includes('macos') ||
      userAgent.includes('macintosh')
    ) {
      detectedOS = 'macos'
    }
    // Check for Linux (including Ubuntu, Debian, etc.)
    else if (
      userAgent.includes('linux') ||
      userAgent.includes('ubuntu') ||
      userAgent.includes('debian') ||
      userAgent.includes('fedora') ||
      userAgent.includes('x11')
    ) {
      detectedOS = 'linux'
    }

    setOS(detectedOS)
    setIsDetected(true)
  }, [])

  return { os, isDetected }
}
