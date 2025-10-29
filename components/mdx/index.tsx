import React, { ComponentPropsWithoutRef } from "react"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import * as LucideIcons from "lucide-react"
import { ContactUs } from "@/components/contact-us"
import { MDXComponents } from "next-mdx-remote-client/rsc"

// Modern animated components
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedProgress, CircularProgress } from "@/components/ui/animated-progress"
import { LoadingSpinner, Skeleton, LoadingOverlay } from "@/components/ui/loading"
import { Toast, ToastContainer, NotificationBanner } from "@/components/ui/notifications"
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
  HoverLift,
  Pulse,
  TypeWriter
} from "@/components/ui/animated-elements"
import { Parallax, ScrollReveal, BackgroundParallax } from "@/components/ui/parallax"
import { ModernShowcase } from "@/components/mdx/modern-showcase"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { ScrollProgress, CircularScrollProgress } from "@/components/ui/scroll-progress"
import { ModernLayoutWrapper } from "@/components/ui/modern-layout-wrapper"
import {
  MicroInteractionButton,
  InteractiveLink,
  FloatingLabelInput
} from "@/components/ui/micro-interactions"
import { MermaidDiagram } from "@/components/ui/mermaid-diagram"

// UI components and icons for MDX use
const uiComponents = {
  Button,
  Link,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  ContactUs,
  // Modern animated components
  AnimatedButton,
  AnimatedCard,
  AnimatedProgress,
  CircularProgress,
  LoadingSpinner,
  Skeleton,
  LoadingOverlay,
  Toast,
  ToastContainer,
  NotificationBanner,
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
  HoverLift,
  Pulse,
  TypeWriter,
  Parallax,
  ScrollReveal,
  BackgroundParallax,
  ModernShowcase,
  FloatingActionButton,
  ScrollProgress,
  CircularScrollProgress,
  ModernLayoutWrapper,
  MicroInteractionButton,
  InteractiveLink,
  FloatingLabelInput,
  MermaidDiagram,
}

// Use React's built-in HTML element prop types instead of custom interfaces
type HeadingProps = ComponentPropsWithoutRef<"h1">
type ParagraphProps = ComponentPropsWithoutRef<"p">
type AnchorProps = ComponentPropsWithoutRef<"a">
type ListProps = ComponentPropsWithoutRef<"ul">
type ListItemProps = ComponentPropsWithoutRef<"li">
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">
type CodeProps = ComponentPropsWithoutRef<"code">
type PreProps = ComponentPropsWithoutRef<"pre">
type ImageProps = ComponentPropsWithoutRef<"img">
type TableProps = ComponentPropsWithoutRef<"table">
type TableCellProps = ComponentPropsWithoutRef<"td">
type TableHeadProps = ComponentPropsWithoutRef<"th">
type DivProps = ComponentPropsWithoutRef<"div">
type SectionProps = ComponentPropsWithoutRef<"section">
type InputProps = ComponentPropsWithoutRef<"input">
type TextareaProps = ComponentPropsWithoutRef<"textarea">
type LabelProps = ComponentPropsWithoutRef<"label">
type FormProps = ComponentPropsWithoutRef<"form">
type SpanProps = ComponentPropsWithoutRef<"span">

// Define components using proper React types
const baseComponents = {
  h1: ({ children, ...props }: HeadingProps) => (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight mt-10 mb-6 text-primary break-words hyphens-auto"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: HeadingProps) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-8 mb-5 text-primary break-words hyphens-auto"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-4 text-primary break-words hyphens-auto"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: HeadingProps) => (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mt-5 mb-3 text-primary break-words hyphens-auto"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ParagraphProps) => (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6 text-base text-foreground mb-4 break-words hyphens-auto text-justify"
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ children, href, ...props }: AnchorProps) => {
    // Check if the link is external (starts with http:// or https://)
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'))

    return (
      <a
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors break-all"
        href={href}
        {...(isExternal && {
          target: "_blank",
          rel: "nofollow noopener noreferrer"
        })}
        {...props}
      >
        {children}
      </a>
    )
  },
  ul: (props: ListProps) => (
    <ul className="my-8 ml-7 list-disc space-y-3 text-foreground" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="my-8 ml-7 list-decimal space-y-3 text-foreground" {...props} />
  ),
  li: (props: ListItemProps) => (
    <li
      className="mt-3 text-base leading-relaxed break-words hyphens-auto text-justify"
      {...props}
    />
  ),
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote
      className="mt-8 border-l-4 border-primary pl-7 italic text-muted-foreground bg-muted/40 py-4 rounded-md mb-8 break-words hyphens-auto text-justify"
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: (props: PreProps) => (
    <pre
      className="rounded-lg bg-black text-green-400 p-6 overflow-x-auto my-8 text-sm whitespace-pre-wrap break-words max-w-full"
      {...props}
    />
  ),
  code: (props: CodeProps) => (
    <code
      className="relative rounded bg-muted px-[0.4em] py-[0.3em] font-mono text-base text-primary break-all whitespace-pre-wrap max-w-full inline-block"
      {...props}
    />
  ),
  img: (props: ImageProps) => (
    <img
      className="rounded-lg border shadow-md my-8 mx-auto max-w-full w-full h-auto object-contain"
      {...props}
      alt={props.alt || ""}
    />
  ),
  table: (props: TableProps) => (
    <div className="w-full overflow-x-auto my-8 -mx-4 sm:mx-0">
      <div className="min-w-full px-4 sm:px-0">
        <table className="w-full text-left border-collapse text-base" {...props} />
      </div>
    </div>
  ),
  th: (props: TableHeadProps) => (
    <th
      className="border-b px-5 py-3 font-semibold bg-muted text-foreground text-sm break-words"
      {...props}
    />
  ),
  td: (props: TableCellProps) => (
    <td className="border-b px-5 py-3 text-sm break-words" {...props} />
  ),
  hr: () => <hr className="my-12 border-muted" />,
  div: (props: DivProps) => <div {...props} />,
  section: (props: SectionProps) => <section {...props} />,
  input: (props: InputProps) => <input {...props} />,
  textarea: (props: TextareaProps) => <textarea {...props} />,
  label: (props: LabelProps) => <label {...props} />,
  form: (props: FormProps) => <form {...props} />,
  span: (props: SpanProps) => <span {...props} />,
}

// Combined components object for MDXProvider

export default {
  ...LucideIcons,
  ...baseComponents,
  ...uiComponents,
} as unknown as MDXComponents
