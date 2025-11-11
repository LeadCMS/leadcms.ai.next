'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface CodeTabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
  group?: string
}

const CodeTabsContext = createContext<CodeTabsContextValue | null>(null)

interface CodeTabsProps {
  children: React.ReactNode
  defaultTab?: string
  group?: string
  className?: string
}

/**
 * Base CodeTabs component for displaying tabbed code blocks or content.
 * Supports grouping tabs across multiple instances for synchronized selection.
 *
 * @example
 * ```mdx
 * <CodeTabs defaultTab="npm" group="package-manager">
 *   <CodeTab label="npm">
 *     npm install leadcms
 *   </CodeTab>
 *   <CodeTab label="pnpm">
 *     pnpm add leadcms
 *   </CodeTab>
 * </CodeTabs>
 * ```
 */
export function CodeTabs({ children, defaultTab, group, className }: CodeTabsProps) {
  // Extract tabs from children - check for props.label instead of component type
  // because MDX might not preserve component identity
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeTabProps> => {
      if (!React.isValidElement(child)) return false
      const props = child.props as any
      return props && typeof props.label === 'string'
    }
  )

  // Compute current active tab based on priority: localStorage > defaultTab > first tab
  const computedActiveTab = useMemo(() => {
    // On server, always use defaultTab or first tab
    if (typeof window === 'undefined') {
      return defaultTab || tabs[0]?.props.label || ''
    }

    // Try localStorage first (if group is specified)
    if (group) {
      try {
        const stored = localStorage.getItem(`code-tabs-${group}`)
        if (stored && tabs.some((tab) => tab.props.label === stored)) {
          return stored
        }
      } catch (e) {
        // localStorage not available
      }
    }

    // Fall back to defaultTab or first tab
    return defaultTab || tabs[0]?.props.label || ''
  }, [defaultTab, group, tabs])

  const [activeTab, setActiveTabState] = useState<string>(computedActiveTab)

  // Sync activeTab with computedActiveTab when it changes
  useEffect(() => {
    if (computedActiveTab !== activeTab) {
      setActiveTabState(computedActiveTab)
    }
  }, [computedActiveTab, activeTab])

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab)

    // Persist to localStorage if group is specified
    if (group && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`code-tabs-${group}`, tab)
        // Dispatch custom event for cross-instance synchronization
        window.dispatchEvent(
          new CustomEvent('code-tabs-change', {
            detail: { group, tab },
          })
        )
      } catch (e) {
        // localStorage might not be available
      }
    }
  }

  // Listen for changes from other instances
  useEffect(() => {
    if (!group) return

    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ group: string; tab: string }>
      if (customEvent.detail.group === group) {
        const tabExists = tabs.some((tab) => tab.props.label === customEvent.detail.tab)
        if (tabExists) {
          setActiveTabState(customEvent.detail.tab)
        }
      }
    }

    window.addEventListener('code-tabs-change', handleTabChange)
    return () => window.removeEventListener('code-tabs-change', handleTabChange)
  }, [group, tabs])

  if (tabs.length === 0) {
    return null
  }

  return (
    <CodeTabsContext.Provider value={{ activeTab, setActiveTab, group }}>
      <div className={cn('my-6 border bg-card', className)}>
        {/* Tab buttons */}
        <div className="flex border-b bg-muted/30" role="tablist">
          <div className="flex gap-1 p-1">
            {tabs.map((tab) => {
              const label = tab.props.label
              const isActive = activeTab === label

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors border-b-2',
                    'hover:bg-background/80 hover:border-primary/50',
                    isActive
                      ? 'bg-background text-foreground border-primary font-semibold'
                      : 'text-muted-foreground border-transparent'
                  )}
                  aria-selected={isActive ? 'true' : 'false'}
                  role="tab"
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="overflow-hidden" role="tabpanel">
          {tabs.find((tab) => tab.props.label === activeTab)}
        </div>
      </div>
    </CodeTabsContext.Provider>
  )
}

interface CodeTabProps {
  label: string
  children: React.ReactNode
}

/**
 * Individual tab content within CodeTabs.
 * The label prop is used as the tab button text.
 */
export function CodeTab({ children }: CodeTabProps) {
  return (
    <div className="tab-content">
      <div className="[&>div]:my-0 [&>div]:rounded-none [&>div+p]:px-4 [&>div+p]:py-2 [&>div+p]:!mt-0 [&>div+p]:mb-0 [&>div+p]:text-sm [&>div+p]:leading-relaxed [&>div+p]:border-t-0 [&>div+p]:bg-muted/10 [&>div+p_strong]:font-semibold [&>div+p_code]:bg-muted [&>div+p_code]:px-1 [&>div+p_code]:py-0.5 [&>div+p_code]:rounded [&>div+p_code]:text-xs">
        {children}
      </div>
    </div>
  )
}
