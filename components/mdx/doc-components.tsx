"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { DynamicIcon, type IconName } from "@/lib/dynamic-icon"

// Callout component for tips, warnings, notes, etc.
interface CalloutProps {
  type?: "note" | "tip" | "warning" | "danger" | "info" | "success"
  title?: string
  children: React.ReactNode
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const icons: Record<string, IconName> = {
    note: 'Info',
    tip: 'Lightbulb',
    warning: 'AlertTriangle',
    danger: 'AlertCircle',
    info: 'Info',
    success: 'CheckCircle',
  }

  const styles = {
    note: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    tip: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
    danger: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
  }

  const iconName = icons[type]

  return (
    <div className={cn("border-l-4 p-4 my-6 rounded-r-lg", styles[type])}>
      <div className="flex items-start gap-3">
        <DynamicIcon name={iconName} className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <div className="font-semibold mb-2">{title}</div>}
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Code block with copy functionality
interface CodeBlockProps {
  children: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ children, language, title, showLineNumbers = false }: CodeBlockProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900">
      {title && (
        <div className="border-b bg-zinc-800 px-4 py-2 text-sm text-zinc-200">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className={cn(
          "overflow-x-auto p-4 text-sm",
          showLineNumbers && "pl-12"
        )}>
          <code className={language ? `language-${language}` : ""}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}

// File tree component
interface FileTreeProps {
  children: React.ReactNode
}

interface FileTreeItemProps {
  name: string
  type?: "file" | "folder"
  children?: React.ReactNode
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <div className="my-6 rounded-lg border bg-muted/50 p-4">
      <div className="text-sm font-mono">{children}</div>
    </div>
  )
}

export function FileTreeItem({ name, type = "file", children }: FileTreeItemProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-1">
        <span className="text-muted-foreground">
          {type === "folder" ? "📁" : "📄"}
        </span>
        <span>{name}</span>
      </div>
      {children && <div className="ml-6 border-l pl-4">{children}</div>}
    </div>
  )
}

// Step component for tutorials
interface StepsProps {
  children: React.ReactNode
}

interface StepProps {
  title: string
  children: React.ReactNode
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="my-6 space-y-6">
      {children}
    </div>
  )
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
        <DynamicIcon name="CheckCircle" className="h-4 w-4" />
      </div>
      <div>
        <h4 className="font-semibold mb-2">{title}</h4>
        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// Image gallery component
interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: number
}

export function ImageGallery({ images, columns = 2 }: ImageGalleryProps) {
  return (
    <div className={cn(
      "my-6 grid gap-4",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    )}>
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full rounded-lg border"
          />
          {image.caption && (
            <p className="text-sm text-muted-foreground text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// Tabs component for showing different options
interface TabsProps {
  items: Array<{
    label: string
    value: string
    content: React.ReactNode
  }>
  defaultValue?: string
}

export function Tabs({ items, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || items[0]?.value)

  return (
    <div className="my-6">
      <div className="border-b">
        <div className="flex space-x-1">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === item.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {items.find(item => item.value === activeTab)?.content}
      </div>
    </div>
  )
}

// Card component for feature highlights
interface FeatureCardProps {
  title: string
  description?: string
  icon?: IconName
  href?: string
  children?: React.ReactNode
}

export function FeatureCard({ title, description, icon, href, children }: FeatureCardProps) {
  const content = (
    <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-2">
        {icon && (
          <div className="mr-3">
            <DynamicIcon name={icon} className="h-6 w-6" />
          </div>
        )}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="text-sm text-muted-foreground">
        {description && <p className="mb-2">{description}</p>}
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}

// Grid for feature cards
interface FeatureGridProps {
  children: React.ReactNode
  columns?: number
}

export function FeatureGrid({ children, columns = 2 }: FeatureGridProps) {
  return (
    <div className={cn(
      "my-6 grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    )}>
      {children}
    </div>
  )
}
