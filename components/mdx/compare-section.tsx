"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { getTextContent } from "@/lib/mdx-utils"

export interface CompareSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export interface CompareTabProps {
  value: string
  label: string
  headers: string[]
  children: React.ReactNode
}

export interface CompareRowProps {
  label: string
  children: React.ReactNode
}

export interface CompareCellProps {
  icon?: "check" | "limited" | "no" | string
  children?: React.ReactNode
}

const getIconContent = (iconName: string) => {
  switch (iconName) {
    case "check":
      return <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
    case "limited":
      return <span className="text-red-500">Limited</span>
    case "no":
      return <span className="text-red-500">No</span>
    default:
      return <DynamicIcon name={iconName} className="mx-auto h-5 w-5" />
  }
}

export const CompareCell: React.FC<CompareCellProps> = ({ icon, children }) => {
  if (icon) {
    return <div className="text-center">{getIconContent(icon)}</div>
  }

  const content = getTextContent(children)
  return <div className="text-center">{content}</div>
}

CompareCell.displayName = 'CompareCell'

export const CompareRow: React.FC<CompareRowProps> = ({ label, children }) => {
  const cells = React.Children.toArray(children).filter(
    (child) => {
      if (!React.isValidElement(child)) return false
      if (child.type === CompareCell) return true

      const childType = child.type as any
      return childType?.$$typeof === Symbol.for('react.lazy') ||
             childType?.displayName === 'CompareCell' ||
             childType?.name === 'CompareCell'
    }
  )

  return (
    <div className="grid grid-cols-4 gap-4 items-center border-t pt-4 hover:bg-muted/50 transition-colors duration-200 rounded">
      <div>{label}</div>
      {cells}
    </div>
  )
}

CompareRow.displayName = 'CompareRow'

export const CompareTab: React.FC<CompareTabProps> = ({ value, label, headers, children }) => {
  const rows = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (
      child.type === CompareRow ||
      (typeof child.type === 'object' && (child.type as any)?.$$typeof === Symbol.for('react.lazy')) ||
      (child.type as any)?.name === 'CompareRow'
    )
  )

  return (
    <TabsContent value={value} className="p-6 border rounded-lg bg-background">
      <StaggerContainer>
        <div className="grid gap-4">
          <StaggerItem>
            <div className="grid grid-cols-4 gap-4 font-medium">
              <div></div>
              {headers.map((h, i) => (
                <div className="text-center" key={i}>
                  {h}
                </div>
              ))}
            </div>
          </StaggerItem>
          {rows.map((row, i) => (
            <StaggerItem key={i}>{row}</StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </TabsContent>
  )
}

// Add display name for easier debugging
CompareTab.displayName = 'CompareTab'

export const CompareSection: React.FC<CompareSectionProps> = ({
  title,
  description,
  children,
}) => {
  // Filter for CompareTab components, handling lazy-loaded components from RSC
  const tabs = React.Children.toArray(children).filter(
    (child) => {
      if (!React.isValidElement(child)) return false

      // Direct type comparison (works in client-only mode)
      if (child.type === CompareTab) return true

      // Check for lazy-loaded components (RSC context)
      const childType = child.type as any
      if (childType?.$$typeof === Symbol.for('react.lazy')) return true

      // Check display name
      if (childType?.displayName === 'CompareTab') return true

      // Check component name
      if (childType?.name === 'CompareTab') return true

      return false
    }
  ) as React.ReactElement<CompareTabProps>[]

  console.log('CompareSection rendering, tabs found:', tabs.length)

  if (tabs.length === 0) {
    console.warn('CompareSection: No tabs found')
    return null
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="compare">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
          </div>
        </FadeIn>
        <ScaleIn delay={0.3}>
          <div className="max-w-[1750px] mx-auto">
            <Tabs defaultValue={tabs[0].props.value} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger value={tab.props.value} key={tab.props.value}>
                    {tab.props.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs}
            </Tabs>
          </div>
        </ScaleIn>
      </div>
    </section>
  )
}
