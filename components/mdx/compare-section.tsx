"use client"

import type React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

export interface CompareSectionProps {
  title: string
  description: string
  tabs: {
    value: string
    label: string
    rows: {
      label: string
      values: (string | { icon: "check" | "limited" | "no" | string })[]
    }[]
    headers: string[]
  }[]
}

const iconMap = {
  check: <CheckCircle className="mx-auto h-5 w-5 text-green-500" />,
  limited: <span className="text-red-500">Limited</span>,
  no: <span className="text-red-500">No</span>,
}

export const CompareSection: React.FC<CompareSectionProps> = ({
  title,
  description,
  tabs = [], // Added default empty array for tabs prop
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32" id="compare">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>
      {tabs.length > 0 && ( // Added conditional rendering to prevent errors when tabs is empty
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={tabs[0].value} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                value={tab.value}
                className="p-6 border rounded-lg bg-background"
                key={tab.value}
              >
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 gap-4 font-medium">
                    <div></div>
                    {tab.headers.map((h, i) => (
                      <div className="text-center" key={i}>
                        {h}
                      </div>
                    ))}
                  </div>
                  {tab.rows.map((row, i) => (
                    <div className="grid grid-cols-4 gap-4 items-center border-t pt-4" key={i}>
                      <div>{row.label}</div>
                      {row.values.map((v, j) => (
                        <div className="text-center" key={j}>
                          {typeof v === "string"
                            ? v
                            : iconMap[v.icon as keyof typeof iconMap] || v.icon}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  </section>
)
