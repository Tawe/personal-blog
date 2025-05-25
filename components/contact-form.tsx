"use client"

import type React from "react"

import { useState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

interface FormData {
  name: string
  email: string
  organization: string
  currentRole: string
  inquiryType: string
  message: string
  preferredContactMethod: string
  timeZone: string
  timeline: string
}

interface FormErrors {
  [key: string]: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    currentRole: "",
    inquiryType: "",
    message: "",
    preferredContactMethod: "",
    timeZone: "",
    timeline: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = "Please select an inquiry type"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Real-time email validation
    if (field === "email" && value) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setSubmitStatus("success")
        setSubmitMessage("Thank you! I'll respond within 24-48 hours.")
        setFormData({
          name: "",
          email: "",
          organization: "",
          currentRole: "",
          inquiryType: "",
          message: "",
          preferredContactMethod: "",
          timeZone: "",
          timeline: "",
        })
      } else {
        setSubmitStatus("error")
        setSubmitMessage(result.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inquiryTypes = [
    "General Inquiry",
    "Technical Leadership Mentoring",
    "Speaking Opportunity",
    "Collaboration/Consulting",
    "D&D Team Building",
    "Other",
  ]

  const contactMethods = ["Email", "LinkedIn", "Video Call"]

  const timeZones = ["EST (Eastern)", "CST (Central)", "MST (Mountain)", "PST (Pacific)", "Other"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field for spam protection */}
      <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-slate-200 font-medium">
          Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20 ${
            errors.name ? "border-red-400" : ""
          }`}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-slate-200 font-medium">
          Email <span className="text-red-400">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20 ${
            errors.email ? "border-red-400" : ""
          }`}
          placeholder="your.email@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Organization and Role - Two columns on larger screens */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="organization" className="text-slate-200 font-medium">
            Organization/Company
          </Label>
          <Input
            id="organization"
            type="text"
            value={formData.organization}
            onChange={(e) => handleInputChange("organization", e.target.value)}
            className="mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20"
            placeholder="Your company"
          />
        </div>

        <div>
          <Label htmlFor="currentRole" className="text-slate-200 font-medium">
            Current Role
          </Label>
          <Input
            id="currentRole"
            type="text"
            value={formData.currentRole}
            onChange={(e) => handleInputChange("currentRole", e.target.value)}
            className="mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20"
            placeholder="Your job title"
          />
        </div>
      </div>

      {/* Inquiry Type */}
      <div>
        <Label htmlFor="inquiryType" className="text-slate-200 font-medium">
          Inquiry Type <span className="text-red-400">*</span>
        </Label>
        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
          <SelectTrigger
            className={`mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20 ${
              errors.inquiryType ? "border-red-400" : ""
            }`}
          >
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {inquiryTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-slate-100 focus:bg-slate-700">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.inquiryType && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
            {errors.inquiryType}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" className="text-slate-200 font-medium">
          Message <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          className={`mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20 min-h-[120px] ${
            errors.message ? "border-red-400" : ""
          }`}
          placeholder="Tell me about your goals, challenges, or what you'd like to discuss..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
            {errors.message}
          </p>
        )}
      </div>

      {/* Contact Method and Time Zone */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferredContactMethod" className="text-slate-200 font-medium">
            Preferred Contact Method
          </Label>
          <Select
            value={formData.preferredContactMethod}
            onValueChange={(value) => handleInputChange("preferredContactMethod", value)}
          >
            <SelectTrigger className="mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20">
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {contactMethods.map((method) => (
                <SelectItem key={method} value={method} className="text-slate-100 focus:bg-slate-700">
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeZone" className="text-slate-200 font-medium">
            Time Zone
          </Label>
          <Select value={formData.timeZone} onValueChange={(value) => handleInputChange("timeZone", value)}>
            <SelectTrigger className="mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20">
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {timeZones.map((zone) => (
                <SelectItem key={zone} value={zone} className="text-slate-100 focus:bg-slate-700">
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <Label htmlFor="timeline" className="text-slate-200 font-medium">
          Timeline
        </Label>
        <Input
          id="timeline"
          type="text"
          value={formData.timeline}
          onChange={(e) => handleInputChange("timeline", e.target.value)}
          className="mt-1 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-400 focus:ring-blue-400/20"
          placeholder="When are you looking to connect? (e.g., ASAP, next week, flexible)"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Sending Message...
          </span>
        ) : (
          "Send Message"
        )}
      </Button>

      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} />
            {submitMessage}
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {submitMessage}
          </p>
        </div>
      )}
    </form>
  )
}
