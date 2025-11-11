'use client'

import React, { useMemo } from 'react'
import { useOSDetection, OS_LABELS, matchesDetectedOS } from '@/hooks/use-os-detection'
import { CodeTabs, CodeTab } from './code-tabs'

interface OSTabsProps {
  children: React.ReactNode
  className?: string
}

/**
 * OS-specific tabs that automatically detect the user's operating system
 * and show the relevant tab by default. User selections are persisted.
 *
 * Supports tabs labeled: "Windows", "macOS", "Linux", "Ubuntu"
 *
 * @example
 * ```mdx
 * <OSTabs>
 *   <OSTab os="linux">
 *     chmod +x script.sh
 *     ./script.sh
 *   </OSTab>
 *   <OSTab os="windows">
 *     .\script.ps1
 *   </OSTab>
 * </OSTabs>
 * ```
 */
export function OSTabs({ children, className }: OSTabsProps) {
  const { os, isDetected } = useOSDetection()

  // Extract OS tabs from children - check for props.os instead of component type
  // because MDX might not preserve component identity
  const tabs = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child): child is React.ReactElement<OSTabProps> => {
          if (!React.isValidElement(child)) return false
          const props = child.props as any
          return props && typeof props.os === 'string'
        }
      ),
    [children]
  )

  // Server-side default: always render in original order with first tab selected
  // This ensures consistent SSR/hydration and avoids layout shifts
  const serverDefaultTab = tabs[0]?.props.os || 'Linux'

  // Compute both reordering and default tab together to keep them synchronized
  const { orderedTabs, defaultTab } = useMemo(() => {
    // On server or before detection, use original order with first tab as default
    if (typeof window === 'undefined' || !isDetected) {
      return {
        orderedTabs: tabs,
        defaultTab: serverDefaultTab
      }
    }

    // Check if user has already made a manual selection (this affects default but not order)
    let userSelectedTab: string | null = null
    try {
      const stored = localStorage.getItem('code-tabs-os')
      if (stored) {
        // Verify stored tab exists in current tabs
        const storedExists = tabs.some((tab) => tab.props.os === stored)
        if (storedExists) {
          userSelectedTab = stored
        }
      }
    } catch (e) {
      // localStorage not available
    }

    // Find the auto-detected OS tab for reordering
    let reorderedTabs = tabs
    let detectedOSTab: string | null = null

    if (os !== 'unknown') {
      const detectedIndex = tabs.findIndex((tab) => matchesDetectedOS(tab.props.os, os))

      if (detectedIndex >= 0) {
        detectedOSTab = tabs[detectedIndex].props.os

        if (detectedIndex > 0) {
          // Move the detected OS tab to the front
          reorderedTabs = [tabs[detectedIndex], ...tabs.slice(0, detectedIndex), ...tabs.slice(detectedIndex + 1)]
        }
      }
    }

    // Default tab priority: user selection > detected OS > first tab of reordered list
    const finalDefaultTab = userSelectedTab || detectedOSTab || reorderedTabs[0]?.props.os || serverDefaultTab

    return {
      orderedTabs: reorderedTabs,
      defaultTab: finalDefaultTab
    }
  }, [tabs, os, isDetected, serverDefaultTab])

  if (tabs.length === 0) {
    return null
  }

  // Convert OSTab children to CodeTab format
  const codeTabs = orderedTabs.map((tab) => (
    <CodeTab key={tab.props.os} label={tab.props.os}>
      {tab.props.children}
    </CodeTab>
  ))

  return (
    <CodeTabs defaultTab={defaultTab} group="os" className={className}>
      {codeTabs}
    </CodeTabs>
  )
}

interface OSTabProps {
  os: string
  children: React.ReactNode
}

/**
 * Individual OS-specific tab content within OSTabs.
 * The os prop should be "Windows", "macOS", "Linux", or "Ubuntu".
 */
export function OSTab({ children }: OSTabProps) {
  return <>{children}</>
}
