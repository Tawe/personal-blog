"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface ContactFormData {
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

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Basic spam protection - check for honeypot field
    // This would be handled in the form component

    // Validate required fields
    if (!formData.name || !formData.email || !formData.inquiryType || !formData.message) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      }
    }

    // Insert into database
    await sql`
      INSERT INTO contact_submissions (
        name,
        email,
        organization,
        "current_role",
        inquiry_type,
        message,
        preferred_contact_method,
        time_zone,
        timeline
      ) VALUES (
        ${formData.name},
        ${formData.email},
        ${formData.organization || null},
        ${formData.currentRole || null},
        ${formData.inquiryType},
        ${formData.message},
        ${formData.preferredContactMethod || null},
        ${formData.timeZone || null},
        ${formData.timeline || null}
      )
    `

    return {
      success: true,
      message: "Thank you for your message! I'll respond within 24-48 hours.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again or contact me directly at john@johnmunn.tech",
    }
  }
}
