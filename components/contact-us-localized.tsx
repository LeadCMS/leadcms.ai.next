"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { getEnvVar } from "@/lib/env"
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

export interface ContactUsText {
  title: string
  description: string
  labels: {
    firstName: string
    lastName: string
    email: string
    company: string
    subject: string
    message: string
  }
  placeholders: {
    firstName: string
    lastName: string
    email: string
    company: string
    message: string
  }
  subjectOptions: {
    placeholder: string
    support: string
    sales: string
    partnership: string
    other: string
  }
  buttons: {
    send: string
    sending: string
    sendAnother: string
  }
  success: {
    title: string
    message: string
  }
  error: {
    title: string
  }
}

interface ContactUsLocalizedProps {
  text: ContactUsText
}

export function ContactUsLocalized({ text }: ContactUsLocalizedProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id === "first-name" ? "firstName" : id === "last-name" ? "lastName" : id]: value,
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

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>{text.title}</CardTitle>
        <CardDescription>
          {text.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        {formState.isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-3 text-center p-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">{text.success.title}</h3>
            <p>{text.success.message}</p>
            <Button
              onClick={() => setFormState((prev) => ({ ...prev, isSuccess: false }))}
              className="mt-4"
            >
              {text.buttons.sendAnother}
            </Button>
          </div>
        ) : (
          <form className="grid gap-4 w-full" onSubmit={handleSubmit}>
            {formState.isError && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{text.error.title}</p>
                  <p className="text-sm">{formState.errorMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium leading-none">
                  {text.labels.firstName}
                </label>
                <input
                  id="first-name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={text.placeholders.firstName}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium leading-none">
                  {text.labels.lastName}
                </label>
                <input
                  id="last-name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={text.placeholders.lastName}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                {text.labels.email}
              </label>
              <input
                id="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={text.placeholders.email}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium leading-none">
                {text.labels.company}
              </label>
              <input
                id="company"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={text.placeholders.company}
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium leading-none">
                {text.labels.subject}
              </label>
              <select
                id="subject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">{text.subjectOptions.placeholder}</option>
                <option value="support">{text.subjectOptions.support}</option>
                <option value="sales">{text.subjectOptions.sales}</option>
                <option value="partnership">{text.subjectOptions.partnership}</option>
                <option value="other">{text.subjectOptions.other}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium leading-none">
                {text.labels.message}
              </label>
              <textarea
                id="message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={text.placeholders.message}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? text.buttons.sending : text.buttons.send}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
