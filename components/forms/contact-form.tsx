"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm } from "@/app/actions/forms"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.inquiryType) newErrors.inquiryType = "Please select an inquiry type"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message })
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
        setSubmitStatus({ type: "error", message: result.error })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-slate-100">Send a Message</CardTitle>
        <CardDescription className="text-slate-400">
          Fill out the form below and I'll get back to you within 24-48 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus.type && (
          <Alert
            className={`mb-6 ${
              submitStatus.type === "success"
                ? "border-green-600/50 bg-green-600/10"
                : "border-red-600/50 bg-red-600/10"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription className={submitStatus.type === "success" ? "text-green-400" : "text-red-400"}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">
                Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500"
                placeholder="your.email@company.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organization" className="text-slate-300">
                Organization/Company
              </Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500"
                placeholder="Your company"
              />
            </div>

            <div>
              <Label htmlFor="currentRole" className="text-slate-300">
                Current Role
              </Label>
              <Input
                id="currentRole"
                value={formData.currentRole}
                onChange={(e) => handleInputChange("currentRole", e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="inquiryType" className="text-slate-300">
              Inquiry Type <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="general" className="text-slate-100">
                  General Inquiry
                </SelectItem>
                <SelectItem value="mentoring" className="text-slate-100">
                  Technical Leadership Mentoring
                </SelectItem>
                <SelectItem value="speaking" className="text-slate-100">
                  Speaking Opportunity
                </SelectItem>
                <SelectItem value="collaboration" className="text-slate-100">
                  Collaboration/Consulting
                </SelectItem>
                <SelectItem value="team-building" className="text-slate-100">
                  D&D Team Building
                </SelectItem>
                <SelectItem value="other" className="text-slate-100">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.inquiryType && <p className="text-red-400 text-sm mt-1">{errors.inquiryType}</p>}
          </div>

          <div>
            <Label htmlFor="message" className="text-slate-300">
              Message <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500 min-h-[120px]"
              placeholder="Tell me about your goals, challenges, or what you'd like to discuss..."
            />
            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredContactMethod" className="text-slate-300">
                Preferred Contact Method
              </Label>
              <Select
                value={formData.preferredContactMethod}
                onValueChange={(value) => handleInputChange("preferredContactMethod", value)}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="email" className="text-slate-100">
                    Email
                  </SelectItem>
                  <SelectItem value="linkedin" className="text-slate-100">
                    LinkedIn
                  </SelectItem>
                  <SelectItem value="video-call" className="text-slate-100">
                    Video Call
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeZone" className="text-slate-300">
                Time Zone
              </Label>
              <Select value={formData.timeZone} onValueChange={(value) => handleInputChange("timeZone", value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="EST" className="text-slate-100">
                    Eastern Time (EST)
                  </SelectItem>
                  <SelectItem value="CST" className="text-slate-100">
                    Eastern Time (EST)
                  </SelectItem>
                  <SelectItem value="CST" className="text-slate-100">
                    Central Time (CST)
                  </SelectItem>
                  <SelectItem value="MST" className="text-slate-100">
                    Mountain Time (MST)
                  </SelectItem>
                  <SelectItem value="PST" className="text-slate-100">
                    Pacific Time (PST)
                  </SelectItem>
                  <SelectItem value="other" className="text-slate-100">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="timeline" className="text-slate-300">
              Timeline
            </Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => handleInputChange("timeline", e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500"
              placeholder="When are you looking to connect? (optional)"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
