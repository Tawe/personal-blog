"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { submitMentoringForm } from "@/app/actions/mentoring-contact"

export function MentoringContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentRole: "",
    yearsInTech: "",
    timeZone: "",
    currentChallenge: "",
    preferredTimes: [] as string[],
    hearAbout: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "timezone-error">("idle")

  const timeZones = [
    { value: "EST", label: "Eastern Time (EST)" },
    { value: "CST", label: "Central Time (CST)" },
    { value: "MST", label: "Mountain Time (MST)" },
    { value: "PST", label: "Pacific Time (PST)" },
    { value: "other", label: "Other (Outside North America)" },
  ]

  const preferredTimeOptions = [
    "Weekday evenings (6-9 PM)",
    "Weekend mornings (9 AM-12 PM)",
    "Weekend afternoons (1-4 PM)",
    "Other (please specify in challenge description)",
  ]

  const handlePreferredTimeChange = (time: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferredTimes: checked ? [...prev.preferredTimes, time] : prev.preferredTimes.filter((t) => t !== time),
    }))
  }

  if (submitStatus === "success") {
    return (
      <Card className="bg-green-900/20 border-green-600">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-100 mb-2">Application Received!</h3>
          <p className="text-green-200 mb-4">
            Thank you for your interest in mentoring. I'll review your application and respond within 2 business days.
          </p>
          <p className="text-sm text-green-300">
            Next steps: I'll send you a calendar link to schedule your free 30-minute consultation.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (submitStatus === "timezone-error") {
    return (
      <Card className="bg-amber-900/20 border-amber-600">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-amber-100 mb-2">Geographic Limitation</h3>
          <p className="text-amber-200 mb-4">
            Thank you for your interest! I currently focus on mentees in North American time zones for optimal
            scheduling.
          </p>
          <div className="text-left text-amber-300 space-y-2">
            <p className="font-semibold">Alternative Resources for International Mentoring:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <a href="https://mentorcruise.com" className="underline hover:text-amber-100">
                  MentorCruise
                </a>{" "}
                - Global mentoring platform
              </li>
              <li>
                <a href="https://adplist.org" className="underline hover:text-amber-100">
                  ADPList
                </a>{" "}
                - Free mentoring community
              </li>
              <li>
                <a href="https://plato.io" className="underline hover:text-amber-100">
                  Plato
                </a>{" "}
                - Engineering leadership mentoring
              </li>
            </ul>
          </div>
          <Button onClick={() => setSubmitStatus("idle")} className="mt-4 bg-amber-600 hover:bg-amber-700">
            Back to Form
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form action={submitMentoringForm} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-slate-300">
            Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-slate-100"
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-slate-300">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-slate-100"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentRole" className="text-slate-300">
            Current Role/Title *
          </Label>
          <Input
            id="currentRole"
            value={formData.currentRole}
            onChange={(e) => setFormData((prev) => ({ ...prev, currentRole: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-slate-100"
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>
        <div>
          <Label htmlFor="yearsInTech" className="text-slate-300">
            Years in Tech *
          </Label>
          <Input
            id="yearsInTech"
            value={formData.yearsInTech}
            onChange={(e) => setFormData((prev) => ({ ...prev, yearsInTech: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-slate-100"
            placeholder="e.g., 5"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timeZone" className="text-slate-300">
          Time Zone *
        </Label>
        <Select
          value={formData.timeZone}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, timeZone: value }))}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
            <SelectValue placeholder="Select your time zone" />
          </SelectTrigger>
          <SelectContent>
            {timeZones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-slate-300">Preferred Meeting Times *</Label>
        <div className="space-y-2 mt-2">
          {preferredTimeOptions.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox
                id={time}
                checked={formData.preferredTimes.includes(time)}
                onCheckedChange={(checked) => handlePreferredTimeChange(time, checked as boolean)}
              />
              <Label htmlFor={time} className="text-slate-300 text-sm">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="currentChallenge" className="text-slate-300">
          Current Challenge/Goals *
        </Label>
        <Textarea
          id="currentChallenge"
          value={formData.currentChallenge}
          onChange={(e) => setFormData((prev) => ({ ...prev, currentChallenge: e.target.value }))}
          className="bg-slate-700 border-slate-600 text-slate-100"
          placeholder="Describe your current leadership challenges or career goals..."
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="hearAbout" className="text-slate-300">
          How did you hear about me?
        </Label>
        <Select
          value={formData.hearAbout}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, hearAbout: value }))}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Website/Blog</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="conference">Conference/Speaking</SelectItem>
            <SelectItem value="search">Search Engine</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {submitStatus === "error" && (
        <Card className="bg-red-900/20 border-red-600">
          <CardContent className="pt-4">
            <p className="text-red-200 text-center">
              There was an error submitting your application. Please try again or email me directly.
            </p>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Submit Application
      </Button>

      <p className="text-sm text-slate-400 text-center">
        By submitting this form, you agree to receive email communication about mentoring opportunities. I'll respond
        within 2 business days.
      </p>
    </form>
  )
}
