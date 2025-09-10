"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { getEnvVar } from "@/lib/env"
import { ContactUsText } from "@/components/contact-us-localized"
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animated-elements"
import { MicroInteractionButton, FloatingLabelInput } from "@/components/ui/micro-interactions"
import { motion, AnimatePresence } from "framer-motion"

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

export const ModernContactForm: React.FC<ModernContactFormProps> = ({ text }) => {
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formState.isError) {
      setFormState(prev => ({ ...prev, isError: false, errorMessage: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setFormState(prev => ({ ...prev, isSubmitting: true, isError: false }))

    try {
      const apiUrl = getEnvVar("NEXT_PUBLIC_LEADCMS_CONTACT_API") || "/api/contact"

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        errorMessage: "",
      })

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
    <FadeIn>
      <Card className="w-full max-w-lg mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {formState.isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  {text.success.title}
                </h3>
                <p className="text-muted-foreground mb-6">{text.success.message}</p>
                <MicroInteractionButton
                  animation="pulse"
                  onClick={() => setFormState(prev => ({ ...prev, isSuccess: false }))}
                  variant="outline"
                >
                  {text.buttons.sendAnother}
                </MicroInteractionButton>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <StaggerContainer>
                  <div className="grid gap-4 md:grid-cols-2">
                    <StaggerItem>
                      <FloatingLabelInput
                        id="firstName"
                        type="text"
                        label={text.labels.firstName}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </StaggerItem>

                    <StaggerItem>
                      <FloatingLabelInput
                        id="lastName"
                        type="text"
                        label={text.labels.lastName}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </StaggerItem>
                  </div>

                  <StaggerItem>
                    <FloatingLabelInput
                      id="email"
                      type="email"
                      label={text.labels.email}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <FloatingLabelInput
                      id="company"
                      type="text"
                      label={text.labels.company}
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <div className="relative">
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                        className="w-full px-3 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      >
                        <option value="">{text.subjectOptions.placeholder}</option>
                        <option value="support">{text.subjectOptions.support}</option>
                        <option value="sales">{text.subjectOptions.sales}</option>
                        <option value="partnership">{text.subjectOptions.partnership}</option>
                        <option value="other">{text.subjectOptions.other}</option>
                      </select>
                      <label
                        htmlFor="subject"
                        className="absolute -top-2 left-2 px-1 bg-background text-sm font-medium text-primary"
                      >
                        {text.labels.subject}
                      </label>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="relative">
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                        rows={4}
                        placeholder=" "
                        aria-label={text.labels.message}
                        className="peer w-full px-3 py-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-y min-h-[100px]"
                      />
                      <motion.label
                        htmlFor="message"
                        className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85"
                        style={{ originX: 0, originY: 0 }}
                      >
                        {text.labels.message}
                        <span className="text-destructive ml-1">*</span>
                      </motion.label>
                    </div>
                  </StaggerItem>

                  {formState.isError && (
                    <StaggerItem>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-md"
                      >
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">{text.error.title}</span>
                        </div>
                        {formState.errorMessage && (
                          <p className="mt-2 text-sm text-destructive/80">
                            {formState.errorMessage}
                          </p>
                        )}
                      </motion.div>
                    </StaggerItem>
                  )}

                  <StaggerItem>
                    <MicroInteractionButton
                      type="submit"
                      disabled={formState.isSubmitting}
                      animation="glow"
                      className="w-full"
                    >
                      {formState.isSubmitting ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          {text.buttons.sending}
                        </motion.div>
                      ) : (
                        text.buttons.send
                      )}
                    </MicroInteractionButton>
                  </StaggerItem>
                </StaggerContainer>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </FadeIn>
  )
}

export default ModernContactForm
