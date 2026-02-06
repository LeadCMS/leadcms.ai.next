"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardContent,
} from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated-elements"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Send, User, Mail, Building, MessageSquare } from "lucide-react"
import { getEnvVar } from "@/lib/env"
import { ContactUsText } from "./contact-us-localized"
import { cn } from "@/lib/utils"
import { useLocale } from "@/lib/locale-context"

interface FormData {
  firstName: string
  lastName: string
  email: string
  company: string
  subject: string
  message: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  errorMessage: string
}

interface ModernContactFormProps {
  text: ContactUsText
}

export function ModernContactForm({ text }: ModernContactFormProps) {
  const locale = useLocale()
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target
    const fieldName = id === "first-name" ? "firstName" : id === "last-name" ? "lastName" : id

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      errorMessage: "",
    })

    try {
      const apiUrl = getEnvVar("NEXT_PUBLIC_LEADCMS_URL")

      if (!apiUrl) {
        throw new Error("API URL not configured. Please check environment variables.")
      }

      const pageUrl = typeof window !== "undefined" ? window.location.href : ""
      const timeZoneOffset = String(new Date().getTimezoneOffset())

      const formDataToSubmit = new FormData()
      formDataToSubmit.append("file", "")
      formDataToSubmit.append("firstName", formData.firstName)
      formDataToSubmit.append("lastName", formData.lastName)
      formDataToSubmit.append("company", formData.company)
      formDataToSubmit.append("subject", formData.subject || "Contact Form Submission")
      formDataToSubmit.append("message", formData.message)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("language", locale)
      formDataToSubmit.append("timeZoneOffset", timeZoneOffset)
      formDataToSubmit.append("pageUrl", pageUrl)

      const response = await fetch(`${apiUrl}/api/contact-us`, {
        method: "POST",
        body: formDataToSubmit,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        errorMessage: "",
      })

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  const InputField = ({
    id,
    label,
    placeholder,
    type = "text",
    icon: Icon,
    required = false,
    value,
    className,
  }: {
    id: string
    label: string
    placeholder: string
    type?: string
    icon: React.ComponentType<any>
    required?: boolean
    value: string
    className?: string
  }) => (
    <motion.div
      className={cn("space-y-2", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={id} className="text-sm font-medium leading-none flex items-center">
        <Icon className="w-4 h-4 mr-2 text-primary" />
        {label}
      </label>
      <motion.div className="relative">
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-primary/50 hover:bg-background/80",
            focusedField === id && "scale-[1.02] shadow-lg"
          )}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          required={required}
        />
        <motion.div
          className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: focusedField === id ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  )

  return (
    <AnimatedCard hoverEffect="lift" className="w-full max-w-2xl mx-auto overflow-hidden">
      <AnimatedCardHeader className="text-center pb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-3xl font-bold gradient-text">{text.title}</CardTitle>
          <CardDescription className="mt-3 text-lg">{text.description}</CardDescription>
        </motion.div>
      </AnimatedCardHeader>

      <AnimatedCardContent className="pt-6">
        <AnimatePresence mode="wait">
          {formState.isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center space-y-6 text-center p-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-semibold">{text.success.title}</h3>
              <p className="text-muted-foreground">{text.success.message}</p>
              <AnimatedButton
                onClick={() => setFormState((prev) => ({ ...prev, isSuccess: false }))}
                animation="glow"
                className="mt-4"
              >
                {text.buttons.sendAnother}
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {formState.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-start gap-3 text-destructive"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{text.error.title}</p>
                      <p className="text-sm mt-1 opacity-90">{formState.errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <StaggerContainer staggerDelay={0.1} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StaggerItem>
                    <InputField
                      id="first-name"
                      label={text.labels.firstName}
                      placeholder={text.placeholders.firstName}
                      icon={User}
                      required
                      value={formData.firstName}
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <InputField
                      id="last-name"
                      label={text.labels.lastName}
                      placeholder={text.placeholders.lastName}
                      icon={User}
                      required
                      value={formData.lastName}
                    />
                  </StaggerItem>
                </div>

                <StaggerItem>
                  <InputField
                    id="email"
                    label={text.labels.email}
                    placeholder={text.placeholders.email}
                    type="email"
                    icon={Mail}
                    required
                    value={formData.email}
                  />
                </StaggerItem>

                <StaggerItem>
                  <InputField
                    id="company"
                    label={text.labels.company}
                    placeholder={text.placeholders.company}
                    icon={Building}
                    value={formData.company}
                  />
                </StaggerItem>

                <StaggerItem>
                  <motion.div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none flex items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                      {text.labels.subject}
                    </label>
                    <motion.select
                      id="subject"
                      aria-label={text.labels.subject}
                      className={cn(
                        "flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200",
                        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50 hover:bg-background/80"
                      )}
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      required
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">{text.subjectOptions.placeholder}</option>
                      <option value="support">{text.subjectOptions.support}</option>
                      <option value="sales">{text.subjectOptions.sales}</option>
                      <option value="partnership">{text.subjectOptions.partnership}</option>
                      <option value="other">{text.subjectOptions.other}</option>
                    </motion.select>
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <motion.div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none flex items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                      {text.labels.message}
                    </label>
                    <motion.textarea
                      id="message"
                      className={cn(
                        "flex min-h-[140px] w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200",
                        "ring-offset-background placeholder:text-muted-foreground resize-none",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50 hover:bg-background/80",
                        focusedField === "message" && "scale-[1.02] shadow-lg"
                      )}
                      placeholder={text.placeholders.message}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <AnimatedButton
                    type="submit"
                    animation="glow"
                    className="w-full h-12 text-lg"
                    disabled={formState.isSubmitting}
                    isLoading={formState.isSubmitting}
                  >
                    {!formState.isSubmitting && <Send className="mr-2 h-5 w-5" />}
                    {formState.isSubmitting ? text.buttons.sending : text.buttons.send}
                  </AnimatedButton>
                </StaggerItem>
              </StaggerContainer>
            </motion.form>
          )}
        </AnimatePresence>
      </AnimatedCardContent>
    </AnimatedCard>
  )
}
