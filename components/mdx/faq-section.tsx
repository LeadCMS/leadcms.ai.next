"use client"

import React, { useId } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { FadeIn } from "@/components/ui/animated-elements"
import { cn } from "@/lib/utils"

// ── FAQItem ──────────────────────────────────────────────────────────────────
// Each FAQItem renders its own AccordionItem directly.
// This avoids child-inspection issues in the RSC / MDX rendering pipeline.

export interface FAQItemProps {
  /** The question displayed in the accordion trigger */
  question: string
  /** Unique value for this item (auto-generated when omitted) */
  value?: string
  /** The answer - placed as children content (supports Markdown) */
  children: React.ReactNode
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, value, children }) => {
  const autoId = useId()
  const itemValue = value || autoId

  return (
    <AccordionItem
      value={itemValue}
      className={cn(
        "border rounded-lg mb-3 px-5 transition-colors data-[state=open]:border-primary/40 data-[state=open]:bg-primary/5",
        "border-border"
      )}
    >
      <AccordionTrigger className="text-left text-base font-medium hover:no-underline gap-4 [&>svg]:text-primary">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground leading-relaxed [&_p]:mt-0 [&_p]:mb-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
FAQItem.displayName = "FAQItem"

// ── FAQSection ───────────────────────────────────────────────────────────────
// Renders a styled section with header + Accordion wrapper.
// Children should be <FAQItem> components - they render themselves.

export interface FAQSectionProps {
  /** Section heading */
  title?: string
  /** Optional subtitle */
  description?: string
  /** FAQItem children */
  children: React.ReactNode
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  description,
  children,
}) => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="faq">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          {/* Header - Title left, Icon right */}
          <FadeIn direction="up">
            <div className="flex items-center justify-between mb-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
                {description && (
                  <p className="mt-3 text-muted-foreground text-lg max-w-2xl">{description}</p>
                )}
              </div>
              <div className="flex-shrink-0 ml-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Accordion - FAQItem children render themselves inside */}
          <FadeIn direction="up" delay={0.15}>
            <Accordion type="single" collapsible className="w-full">
              {children}
            </Accordion>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ── ContentSection ───────────────────────────────────────────────────────────
// Wraps free-form prose content in a width-constrained container
// that matches the visual rhythm of HeroSection, FeaturesSection, etc.

export interface ContentSectionProps {
  children: React.ReactNode
  /** Max width class, defaults to full width matching other sections */
  maxWidth?: string
  /** Optional id for anchor linking */
  id?: string
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  maxWidth = "max-w-[1750px]",
  id,
}) => {
  return (
    <section className="w-full py-8 md:py-12" id={id}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto prose prose-gray dark:prose-invert lg:prose-lg", maxWidth)}>
          {children}
        </div>
      </div>
    </section>
  )
}
