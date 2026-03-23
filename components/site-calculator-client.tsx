"use client"

import React, { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Calculator,
  CheckCircle,
  AlertCircle,
  Cloud,
  Server,
  Sparkles,
  Globe,
  Palette,
  Layers,
  Settings,
  Send,
} from "lucide-react"
import { getEnvVar } from "@/lib/env"
import { useLocale } from "@/lib/locale-context"
import { getPreferredLocale } from "@/lib/locale-utils"
import { appendUtmDataToFormData } from "@/lib/utm-tracking"
import { appendTrackedTagsToFormData } from "@/lib/tag-tracking"
import { cn } from "@/lib/utils"
import type { SiteCalculatorPricing, SiteCalculatorLabels } from "@/lib/site-calculator-config"

// ── Types ────────────────────────────────────────────────────────────────────

type Complexity = "low" | "mid" | "high" | "very-high"

interface CalculatorState {
  websiteType: string
  designOption: string
  features: Record<string, boolean>
  customPagesCount: number
  integrationsCount: number
  contentWritingCount: number
  deploymentType: "cloud" | "on-premises"
  onPremisesManaged: boolean
  setupServices: Record<string, number>
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  projectDescription: string
  requestQuote: boolean
}

type Step = "configure" | "result"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount: number, pricing: SiteCalculatorPricing): string {
  const convertedAmount = Math.round(amount * pricing.currencyRate)

  return new Intl.NumberFormat(pricing.currencyLocale, {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(convertedAmount)
}

// Quote line item for breakdown display
interface QuoteItem {
  category: string
  label: string
  description?: string
  quantity?: number
  unitPrice?: number
  amount: number
  isIncluded?: boolean
  isMonthly?: boolean
}

interface ContactSubmission {
  name?: string
  email?: string
  phone?: string
  company?: string
  requestQuote?: boolean
  message: string
}

// Complexity indicator component - shows visual bars
function ComplexityIndicator({ level }: { level: Complexity }) {
  const levels: Complexity[] = ["low", "mid", "high", "very-high"]
  const index = levels.indexOf(level)
  const colors = {
    low: "bg-green-500",
    mid: "bg-yellow-500",
    high: "bg-orange-500",
    "very-high": "bg-red-500",
  }
  const labels = {
    low: "Low",
    mid: "Medium",
    high: "High",
    "very-high": "Very High",
  }

  return (
    <div className="flex items-center gap-1.5">
      {levels.map((l, i) => (
        <div
          key={l}
          className={cn(
            "h-2 w-3 rounded-sm transition-colors",
            i <= index ? colors[level] : "bg-muted"
          )}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{labels[level]}</span>
    </div>
  )
}

// Section header - compact version
function SectionTitle({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

interface SiteCalculatorClientProps {
  pricing: SiteCalculatorPricing
  labels: SiteCalculatorLabels
}

export function SiteCalculatorClient({ pricing, labels }: SiteCalculatorClientProps) {
  const resultRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const formatDisplayPrice = useCallback(
    (amount: number) => formatPrice(amount, pricing),
    [pricing]
  )
  const breakdownSections = labels.result.breakdownSections

  // ── State ────────────────────────────────────────────────────────────────

  const [state, setState] = useState<CalculatorState>(() => ({
    websiteType: pricing.websiteTypes[0]?.id || "",
    designOption: pricing.designOptions[0]?.id || "",
    features: Object.fromEntries(pricing.features.map((f) => [f.id, f.alwaysEnabled || false])),
    customPagesCount: 0,
    integrationsCount: 0,
    contentWritingCount: 0,
    deploymentType: "cloud",
    onPremisesManaged: false,
    setupServices: Object.fromEntries(pricing.platform.setupServices.map((s) => [s.id, 0])),
  }))

  const [step, setStep] = useState<Step>("configure")
  const [isCalculating, setIsCalculating] = useState(false)
  const [totalOneTime, setTotalOneTime] = useState(0)
  const [totalMonthly, setTotalMonthly] = useState(0)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDescription: "",
    requestQuote: false,
  })

  // ── State helpers ────────────────────────────────────────────────────────

  const updateState = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const toggleFeature = (featureId: string) => {
    setState((prev) => ({
      ...prev,
      features: { ...prev.features, [featureId]: !prev.features[featureId] },
    }))
  }

  const updateSetupService = (serviceId: string, count: number) => {
    setState((prev) => ({
      ...prev,
      setupServices: { ...prev.setupServices, [serviceId]: Math.max(0, count) },
    }))
  }

  // ── Calculation ──────────────────────────────────────────────────────────

  const calculateTotals = useCallback(() => {
    let oneTime = 0
    let monthly = 0

    const selectedType = pricing.websiteTypes.find((t) => t.id === state.websiteType)
    if (selectedType) oneTime += selectedType.baseCost

    const selectedDesign = pricing.designOptions.find((d) => d.id === state.designOption)
    if (selectedDesign) oneTime += selectedDesign.cost

    for (const feature of pricing.features) {
      if (state.features[feature.id] || feature.alwaysEnabled) {
        oneTime += feature.cost
      }
    }

    oneTime += state.customPagesCount * pricing.customPages.costPerUnit
    oneTime += state.integrationsCount * pricing.integrations.costPerUnit
    oneTime += state.contentWritingCount * pricing.contentWriting.costPerUnit

    if (state.deploymentType === "cloud") {
      oneTime += pricing.deployment.cloud.setupCost
      monthly += pricing.deployment.cloud.monthlyCost
    } else if (state.onPremisesManaged) {
      oneTime += pricing.deployment.onPremisesManaged.cost
    }

    for (const service of pricing.platform.setupServices) {
      const count = state.setupServices[service.id] || 0
      oneTime += count * service.costPerUnit
    }

    return { oneTime, monthly }
  }, [state, pricing])

  // ── Quote breakdown for UI display ───────────────────────────────────────

  const buildQuoteBreakdown = useCallback((): QuoteItem[] => {
    const items: QuoteItem[] = []

    // Website Type
    const selectedType = pricing.websiteTypes.find((t) => t.id === state.websiteType)
    if (selectedType) {
      items.push({
        category: breakdownSections.development,
        label: selectedType.label,
        description: selectedType.description,
        amount: selectedType.baseCost,
      })
    }

    // Design
    const selectedDesign = pricing.designOptions.find((d) => d.id === state.designOption)
    if (selectedDesign) {
      items.push({
        category: breakdownSections.design,
        label: selectedDesign.label,
        description: selectedDesign.description,
        amount: selectedDesign.cost,
      })
    }

    // Features
    for (const feature of pricing.features) {
      if (state.features[feature.id] || feature.alwaysEnabled) {
        items.push({
          category: breakdownSections.features,
          label: feature.label,
          amount: feature.cost,
          isIncluded: feature.cost === 0,
        })
      }
    }

    // Custom Pages
    if (state.customPagesCount > 0) {
      items.push({
        category: breakdownSections.additionalServices,
        label: pricing.customPages.label,
        description: pricing.customPages.description,
        quantity: state.customPagesCount,
        unitPrice: pricing.customPages.costPerUnit,
        amount: state.customPagesCount * pricing.customPages.costPerUnit,
      })
    }

    // Integrations
    if (state.integrationsCount > 0) {
      items.push({
        category: breakdownSections.additionalServices,
        label: pricing.integrations.label,
        description: pricing.integrations.description,
        quantity: state.integrationsCount,
        unitPrice: pricing.integrations.costPerUnit,
        amount: state.integrationsCount * pricing.integrations.costPerUnit,
      })
    }

    // Content Writing
    if (state.contentWritingCount > 0) {
      items.push({
        category: breakdownSections.additionalServices,
        label: pricing.contentWriting.label,
        description: pricing.contentWriting.description,
        quantity: state.contentWritingCount,
        unitPrice: pricing.contentWriting.costPerUnit,
        amount: state.contentWritingCount * pricing.contentWriting.costPerUnit,
      })
    }

    // Deployment
    if (state.deploymentType === "cloud") {
      items.push({
        category: breakdownSections.deployment,
        label: `${pricing.deployment.cloud.label} · ${labels.result.oneTime}`,
        description: pricing.deployment.cloud.description,
        amount: pricing.deployment.cloud.setupCost,
      })
      items.push({
        category: breakdownSections.deployment,
        label: `${pricing.deployment.cloud.label} · ${labels.result.monthly}`,
        description: pricing.deployment.cloud.description,
        amount: pricing.deployment.cloud.monthlyCost,
        isMonthly: true,
      })
    } else if (state.onPremisesManaged) {
      items.push({
        category: breakdownSections.deployment,
        label: pricing.deployment.onPremisesManaged.label,
        description: pricing.deployment.onPremisesManaged.description,
        amount: pricing.deployment.onPremisesManaged.cost,
      })
    } else {
      items.push({
        category: breakdownSections.deployment,
        label: pricing.deployment.onPremisesDiy.label,
        description: pricing.deployment.onPremisesDiy.description,
        amount: 0,
        isIncluded: true,
      })
    }

    // Platform
    items.push({
      category: breakdownSections.platform,
      label: pricing.platform.base.label,
      amount: 0,
      isIncluded: true,
    })
    items.push({
      category: breakdownSections.platform,
      label: pricing.platform.cms.label,
      amount: 0,
      isIncluded: true,
    })

    // Setup Services
    for (const service of pricing.platform.setupServices) {
      const count = state.setupServices[service.id] || 0
      if (count > 0) {
        items.push({
          category: breakdownSections.platform,
          label: service.label,
          description: service.description,
          quantity: count,
          unitPrice: service.costPerUnit,
          amount: count * service.costPerUnit,
        })
      }
    }

    return items
  }, [state, pricing, breakdownSections, labels.result.monthly, labels.result.oneTime])

  // ── Message summary ──────────────────────────────────────────────────────

  const buildMessageSummary = useCallback(() => {
    const lines: string[] = [labels.title, labels.result.breakdownDescription]
    const quoteBreakdown = buildQuoteBreakdown()
    const categories = [...new Set(quoteBreakdown.map((item) => item.category))]

    for (const category of categories) {
      lines.push("", `${category}:`)

      for (const item of quoteBreakdown.filter((entry) => entry.category === category)) {
        const amountLabel = item.isIncluded
          ? labels.result.includedLabel
          : `${formatDisplayPrice(item.amount)}${item.isMonthly ? labels.result.monthlyShortSuffix : ""}`

        lines.push(`- ${item.label}: ${amountLabel}`)

        if (item.quantity && item.unitPrice) {
          lines.push(`  ${item.quantity} × ${formatDisplayPrice(item.unitPrice)}`)
        }
      }
    }

    const { oneTime, monthly } = calculateTotals()
    lines.push("", `${labels.result.oneTime}: ${formatDisplayPrice(oneTime)}`)

    if (monthly > 0) {
      lines.push(
        `${labels.result.monthly}: ${formatDisplayPrice(monthly)}${labels.result.monthlyShortSuffix}`
      )
    }

    if (contactForm.projectDescription.trim()) {
      lines.push("", `${labels.form.projectDescription}:`)
      lines.push(contactForm.projectDescription.trim())
    }

    lines.push("", `${labels.result.disclaimerTitle} ${labels.result.fullDisclaimer}`)

    return lines.join("\n")
  }, [
    labels,
    buildQuoteBreakdown,
    calculateTotals,
    formatDisplayPrice,
    contactForm.projectDescription,
    contactForm.requestQuote,
  ])

  // ── API submission ───────────────────────────────────────────────────────

  const submitToApi = useCallback(
    async ({ name, email, phone, company, requestQuote, message }: ContactSubmission) => {
      const apiUrl = getEnvVar("NEXT_PUBLIC_LEADCMS_URL")
      if (!apiUrl) {
        throw new Error("API URL not configured. Please check environment variables.")
      }

      const language = getPreferredLocale(locale)
      const pageUrl = typeof window !== "undefined" ? window.location.href : ""
      const timeZoneOffset = String(new Date().getTimezoneOffset())

      const formData = new FormData()
      formData.append("subject", "Site Cost Calculator")
      formData.append("message", message)
      formData.append("language", language)
      formData.append("timeZoneOffset", timeZoneOffset)
      formData.append("pageUrl", pageUrl)
      formData.append("ExtraData[RequestQuote]", requestQuote ? "yes" : "no")

      if (name?.trim()) {
        formData.append("name", name.trim())
      }

      if (company?.trim()) {
        formData.append("company", company.trim())
      }

      if (email?.trim()) {
        formData.append("email", email.trim())
      }

      if (phone?.trim()) {
        formData.append("phone", phone.trim())
      }

      appendUtmDataToFormData(formData)
      appendTrackedTagsToFormData(formData)

      const response = await fetch(`${apiUrl}/api/contact-us`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
    },
    [locale]
  )

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCalculate = async () => {
    setIsCalculating(true)
    setSubmitError("")

    try {
      const message = buildMessageSummary()

      // Register the calculation without manufacturing placeholder contact data.
      try {
        await submitToApi({ message })
      } catch {
        console.warn("Initial submission failed, continuing with calculation")
      }

      const { oneTime, monthly } = calculateTotals()
      setTotalOneTime(oneTime)
      setTotalMonthly(monthly)
      setQuoteItems(buildQuoteBreakdown())
      setStep("result")

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Calculation failed")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleUnlock = async () => {
    if (!contactForm.name.trim()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const message = buildMessageSummary()

      await submitToApi({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        company: contactForm.company,
        requestQuote: contactForm.requestQuote,
        message,
      })
      setIsUnlocked(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Header - Only show when configuring */}
      {step === "configure" && (
        <div className="flex items-center justify-between mb-6 rounded-xl border bg-card/70 backdrop-blur-sm p-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{labels.title}</h2>
            <p className="text-muted-foreground mt-1">{labels.subtitle}</p>
          </div>
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
        </div>
      )}

      {/* Configuration Grid - Only show when configuring */}
      {step === "configure" && (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* ─── Column 1: Website Type & Design ────────────────────────── */}
          <div className="space-y-6">
            {/* Website Type */}
            <div className="rounded-xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <SectionTitle title={labels.sections.websiteType} icon={Globe} />
              <RadioGroup
                value={state.websiteType}
                onValueChange={(v) => updateState("websiteType", v)}
                className="space-y-2"
              >
                {pricing.websiteTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/20",
                      state.websiteType === type.id
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
                    )}
                    onClick={() => updateState("websiteType", type.id)}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value={type.id} id={`type-${type.id}`} className="sr-only" />
                      <div className="flex flex-col">
                        <Label
                          htmlFor={`type-${type.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {type.label}
                        </Label>
                        {type.description && (
                          <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                        )}
                      </div>
                    </div>
                    <ComplexityIndicator
                      level={(type as { complexity?: Complexity }).complexity || "mid"}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Design */}
            <div className="rounded-xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <SectionTitle title={labels.sections.design} icon={Palette} />
              <RadioGroup
                value={state.designOption}
                onValueChange={(v) => updateState("designOption", v)}
                className="space-y-2"
              >
                {pricing.designOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm focus-within:ring-2 focus-within:ring-primary/20",
                      state.designOption === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
                    )}
                    onClick={() => updateState("designOption", option.id)}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem
                        value={option.id}
                        id={`design-${option.id}`}
                        className="sr-only"
                      />
                      <div className="flex flex-col">
                        <Label
                          htmlFor={`design-${option.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {option.label}
                        </Label>
                        {option.description && (
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                        )}
                      </div>
                    </div>
                    <ComplexityIndicator
                      level={(option as { complexity?: Complexity }).complexity || "mid"}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* ─── Column 2: Features & Additional ────────────────────────── */}
          <div className="space-y-6">
            {/* Features */}
            <div className="rounded-xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <SectionTitle title={labels.sections.features} icon={Layers} />
              <div className="space-y-2">
                {pricing.features.map((feature) => (
                  <div
                    key={feature.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 transition-all hover:shadow-sm",
                      feature.alwaysEnabled
                        ? "border-primary/30 bg-primary/10"
                        : state.features[feature.id]
                          ? "border-primary bg-primary/10 cursor-pointer"
                          : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 cursor-pointer"
                    )}
                    onClick={() => !feature.alwaysEnabled && toggleFeature(feature.id)}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={state.features[feature.id] || feature.alwaysEnabled || false}
                        disabled={feature.alwaysEnabled || false}
                        onCheckedChange={() => !feature.alwaysEnabled && toggleFeature(feature.id)}
                        className="h-4 w-4 mt-0.5"
                      />
                      <div className="flex flex-col">
                        <Label
                          htmlFor={`feature-${feature.id}`}
                          className={cn(
                            "cursor-pointer text-sm",
                            feature.alwaysEnabled && "text-muted-foreground"
                          )}
                        >
                          {feature.label}
                        </Label>
                        {feature.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ComplexityIndicator
                      level={(feature as { complexity?: Complexity }).complexity || "mid"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Services */}
            <div className="rounded-xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <SectionTitle title={labels.sections.additionalServices} icon={Settings} />
              <div className="space-y-3">
                {/* Custom pages */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Label htmlFor="custom-pages" className="text-sm">
                      {pricing.customPages.label}
                    </Label>
                    {pricing.customPages.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricing.customPages.description}
                      </p>
                    )}
                  </div>
                  <Input
                    id="custom-pages"
                    type="number"
                    min={0}
                    max={100}
                    value={state.customPagesCount || ""}
                    onChange={(e) =>
                      updateState("customPagesCount", Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-20 h-8 text-center text-sm bg-background/70"
                    placeholder="0"
                  />
                </div>
                {/* Integrations */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Label htmlFor="integrations" className="text-sm">
                      {pricing.integrations.label}
                    </Label>
                    {pricing.integrations.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricing.integrations.description}
                      </p>
                    )}
                  </div>
                  <Input
                    id="integrations"
                    type="number"
                    min={0}
                    max={50}
                    value={state.integrationsCount || ""}
                    onChange={(e) =>
                      updateState("integrationsCount", Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-20 h-8 text-center text-sm bg-background/70"
                    placeholder="0"
                  />
                </div>
                {/* Content Writing */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Label htmlFor="content-writing" className="text-sm">
                      {pricing.contentWriting.label}
                    </Label>
                    {pricing.contentWriting.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricing.contentWriting.description}
                      </p>
                    )}
                  </div>
                  <Input
                    id="content-writing"
                    type="number"
                    min={0}
                    max={500}
                    value={state.contentWritingCount || ""}
                    onChange={(e) =>
                      updateState("contentWritingCount", Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-20 h-8 text-center text-sm bg-background/70"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Column 3: Deployment & Platform ────────────────────────── */}
          <div className="space-y-6 lg:col-span-2 xl:col-span-1">
            {/* Deployment */}
            <div className="rounded-xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <SectionTitle title={labels.sections.deployment} icon={Cloud} />
              <RadioGroup
                value={state.deploymentType}
                onValueChange={(v) => updateState("deploymentType", v as "cloud" | "on-premises")}
                className="space-y-2"
              >
                {/* Cloud */}
                <div
                  className={cn(
                    "rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm",
                    state.deploymentType === "cloud"
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
                  )}
                  onClick={() => updateState("deploymentType", "cloud")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="cloud" id="deploy-cloud" className="sr-only" />
                      <Cloud className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <Label
                          htmlFor="deploy-cloud"
                          className="cursor-pointer text-sm font-medium"
                        >
                          {pricing.deployment.cloud.label}
                        </Label>
                        {pricing.deployment.cloud.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {pricing.deployment.cloud.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ComplexityIndicator
                      level={
                        (pricing.deployment.cloud as { complexity?: Complexity }).complexity ||
                        "low"
                      }
                    />
                  </div>
                </div>

                {/* On-Premises */}
                <div
                  className={cn(
                    "rounded-lg border p-3 transition-all hover:shadow-sm",
                    state.deploymentType === "on-premises"
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
                  )}
                >
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => updateState("deploymentType", "on-premises")}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem value="on-premises" id="deploy-onprem" className="sr-only" />
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <Label
                          htmlFor="deploy-onprem"
                          className="cursor-pointer text-sm font-medium"
                        >
                          On-Premises
                        </Label>
                        {pricing.deployment.onPremisesDiy.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {pricing.deployment.onPremisesDiy.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ComplexityIndicator
                      level={
                        (pricing.deployment.onPremisesDiy as { complexity?: Complexity })
                          .complexity || "very-high"
                      }
                    />
                  </div>

                  {state.deploymentType === "on-premises" && (
                    <div className="mt-3 pt-3 border-t">
                      <div
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => updateState("onPremisesManaged", !state.onPremisesManaged)}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="managed-deploy"
                            checked={state.onPremisesManaged}
                            onCheckedChange={(checked) =>
                              updateState("onPremisesManaged", !!checked)
                            }
                            className="h-4 w-4 mt-0.5"
                          />
                          <div className="flex flex-col">
                            <Label htmlFor="managed-deploy" className="cursor-pointer text-sm">
                              Managed by our team
                            </Label>
                            {pricing.deployment.onPremisesManaged.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {pricing.deployment.onPremisesManaged.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ComplexityIndicator
                          level={state.onPremisesManaged ? "mid" : "very-high"}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* Platform Modules */}
            <div className="rounded-xl border bg-card/70 backdrop-blur-sm p-5 shadow-sm">
              <SectionTitle title={labels.sections.platform} icon={Sparkles} />
              <div className="space-y-3">
                {/* Base - always included */}
                <div className="flex items-start justify-between rounded-lg border border-primary/30 bg-primary/10 p-3">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={true} disabled className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {pricing.platform.base.label}
                      </span>
                      {pricing.platform.base.description && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {pricing.platform.base.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-primary font-medium">Included</span>
                </div>

                {/* CMS - always included */}
                <div className="flex items-start justify-between rounded-lg border border-primary/30 bg-primary/10 p-3">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={true} disabled className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {pricing.platform.cms.label}
                      </span>
                      {pricing.platform.cms.description && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {pricing.platform.cms.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-primary font-medium">Included</span>
                </div>

                {/* Setup Services - quantity based */}
                {pricing.platform.setupServices.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`service-${service.id}`} className="text-sm font-medium">
                          {service.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`service-${service.id}`}
                          type="number"
                          min={0}
                          max={50}
                          value={state.setupServices[service.id] || ""}
                          onChange={(e) =>
                            updateSetupService(service.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 h-8 text-center text-sm bg-background/70"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <ComplexityIndicator
                        level={(service as { complexity?: Complexity }).complexity || "mid"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {submitError && step === "configure" && (
        <div className="mt-4 bg-destructive/10 p-3 rounded-lg flex items-start gap-2 text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      {/* Calculate Button */}
      {step === "configure" && (
        <Button
          size="lg"
          className="w-full mt-6"
          onClick={handleCalculate}
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <span className="mr-2 h-4 w-4 inline-block animate-spin rounded-full border-2 border-current border-t-transparent" />
              {labels.buttons.calculating}
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              {labels.buttons.calculate}
            </>
          )}
        </Button>
      )}

      {/* Result Section - Full Quote Breakdown */}
      {step === "result" && (
        <div ref={resultRef} className="scroll-mt-8">
          {/* Quote Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {labels.result.title}
              </h2>
              <p className="text-muted-foreground mt-1">{labels.result.breakdownDescription}</p>
            </div>
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Quote Breakdown Table with Overlay */}
          <div className="relative">
            {/* The quote breakdown - always visible but blurred when locked */}
            <div
              className={cn(
                "rounded-xl border bg-card/70 backdrop-blur-sm overflow-hidden transition-all duration-700 shadow-sm",
                !isUnlocked && "blur-md select-none hidden md:block"
              )}
            >
              {/* Group items by category */}
              {(() => {
                const categories = [...new Set(quoteItems.map((item) => item.category))]
                return categories.map((category) => (
                  <div key={category}>
                    <div className="bg-muted/40 px-4 py-2 border-b">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {category}
                      </span>
                    </div>
                    {quoteItems
                      .filter((item) => item.category === category)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.label}</span>
                              {item.isMonthly && (
                                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                  {labels.result.monthlyBadge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.description}
                              </p>
                            )}
                            {item.quantity && item.unitPrice && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.quantity} × {formatDisplayPrice(item.unitPrice)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {item.isIncluded ? (
                              <span className="text-sm text-primary font-medium">
                                {labels.result.includedLabel}
                              </span>
                            ) : (
                              <span className="text-sm font-semibold">
                                {formatDisplayPrice(item.amount)}
                                {item.isMonthly && (
                                  <span className="text-xs font-normal text-muted-foreground">
                                    {labels.result.monthlyShortSuffix}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              })()}

              {/* Totals */}
              <div className="bg-primary/10 px-4 py-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">{labels.result.oneTime}</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatDisplayPrice(totalOneTime)}
                  </span>
                </div>
                {totalMonthly > 0 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/20">
                    <span className="text-sm font-medium text-muted-foreground">
                      {labels.result.monthly}
                    </span>
                    <span className="text-lg font-semibold">
                      {formatDisplayPrice(totalMonthly)}
                      <span className="text-sm font-normal text-muted-foreground">
                        {labels.result.monthlyLongSuffix}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Unlock form overlay */}
            {!isUnlocked && (
              <div className="relative md:absolute md:inset-0 flex items-center justify-center md:bg-background/70 md:backdrop-blur-[3px] rounded-xl">
                <div className="w-full max-w-xl mx-4 border rounded-xl p-6 bg-card shadow-xl md:max-h-[90vh] md:overflow-y-auto">
                  {/* Approximate cost highlight */}
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-3">
                      <Calculator className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{labels.result.unlockCardTitle}</h3>
                    <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
                      <span className="text-3xl font-bold text-primary">
                        {formatDisplayPrice(totalOneTime)}
                      </span>
                      {totalMonthly > 0 && (
                        <span className="text-lg text-muted-foreground">
                          + {formatDisplayPrice(totalMonthly)}
                          <span className="text-sm">{labels.result.monthlyShortSuffix}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
                      {labels.result.unlockCardDescription}
                    </p>
                  </div>

                  {/* Contact details */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="unlock-name" className="text-sm">
                        {labels.form.name} *
                      </Label>
                      <Input
                        id="unlock-name"
                        placeholder={labels.form.namePlaceholder}
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unlock-email" className="text-sm">
                        {labels.form.email} *
                      </Label>
                      <Input
                        id="unlock-email"
                        type="email"
                        placeholder={labels.form.emailPlaceholder}
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unlock-phone" className="text-sm">
                        {labels.form.phone}
                      </Label>
                      <Input
                        id="unlock-phone"
                        type="tel"
                        placeholder={labels.form.phonePlaceholder}
                        value={contactForm.phone}
                        onChange={(e) =>
                          setContactForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unlock-company" className="text-sm">
                        {labels.form.company}
                      </Label>
                      <Input
                        id="unlock-company"
                        placeholder={labels.form.companyPlaceholder}
                        value={contactForm.company}
                        onChange={(e) =>
                          setContactForm((prev) => ({ ...prev, company: e.target.value }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  {/* Project description */}
                  <div className="mt-4">
                    <Label htmlFor="unlock-project-desc" className="text-sm">
                      {labels.form.projectDescription}
                    </Label>
                    <Textarea
                      id="unlock-project-desc"
                      placeholder={labels.form.projectDescriptionPlaceholder}
                      value={contactForm.projectDescription}
                      onChange={(e) =>
                        setContactForm((prev) => ({ ...prev, projectDescription: e.target.value }))
                      }
                      className="mt-1.5 min-h-[80px]"
                      rows={3}
                    />
                  </div>

                  {/* Request quote checkbox */}
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <Checkbox
                      id="unlock-request-quote"
                      checked={contactForm.requestQuote}
                      onCheckedChange={(checked) =>
                        setContactForm((prev) => ({ ...prev, requestQuote: !!checked }))
                      }
                      className="h-4 w-4 mt-0.5"
                    />
                    <Label htmlFor="unlock-request-quote" className="cursor-pointer">
                      <span className="text-sm font-medium">{labels.form.requestQuote}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {labels.form.requestQuoteDescription}
                      </p>
                    </Label>
                  </div>

                  {submitError && (
                    <div className="mt-4 bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="text-sm">{submitError}</p>
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="w-full mt-6"
                    onClick={handleUnlock}
                    disabled={isSubmitting || !contactForm.name.trim() || !contactForm.email.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 inline-block animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {labels.buttons.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {labels.buttons.showDetailedBreakdown}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-muted">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>{labels.result.disclaimerTitle}</strong> {labels.result.fullDisclaimer}
            </p>
          </div>

          {/* Success */}
          {isUnlocked && (
            <div className="mt-6 text-center p-6 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                {labels.result.thankYouPrefix}, {contactForm.name}!
              </h3>
              {contactForm.email.trim() && (
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {labels.result.thankYouSuffix} {contactForm.email}.
                </p>
              )}
              {contactForm.requestQuote && (
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  {labels.result.requestQuoteConfirmation}
                </p>
              )}
            </div>
          )}

          {/* Recalculate */}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => {
                setStep("configure")
                setIsUnlocked(false)
                setSubmitError("")
                setQuoteItems([])
              }}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {labels.buttons.recalculate}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
