"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface BaseFormData {
  name: string
  email: string
  message: string
}

interface ContactFormData extends BaseFormData {
  organization?: string
  currentRole?: string
  inquiryType: string
  preferredContactMethod?: string
  timeZone?: string
  timeline?: string
}

interface MentoringFormData extends BaseFormData {
  currentRole: string
  yearsInTech: string
  timeZone: string
  currentChallenge: string
  preferredTimes: string[]
  hearAbout?: string
}

// Validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateRequired(fields: Record<string, any>): string | null {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${key} is required`
    }
  }
  return null
}

// Contact form submission
export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate required fields
    const requiredError = validateRequired({
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      message: formData.message,
    })

    if (requiredError) {
      return { success: false, error: requiredError }
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      return { success: false, error: "Please enter a valid email address" }
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

// Mentoring form submission
export async function submitMentoringForm(formData: FormData) {
  try {
    // Extract form data
    const data: MentoringFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      currentRole: formData.get("currentRole") as string,
      yearsInTech: formData.get("yearsInTech") as string,
      timeZone: formData.get("timeZone") as string,
      currentChallenge: formData.get("currentChallenge") as string,
      preferredTimes: formData.getAll("preferredTimes") as string[],
      hearAbout: formData.get("hearAbout") as string,
      message: formData.get("currentChallenge") as string, // For compatibility
    }

    // Validate required fields
    const requiredError = validateRequired({
      name: data.name,
      email: data.email,
      currentRole: data.currentRole,
      yearsInTech: data.yearsInTech,
      timeZone: data.timeZone,
      currentChallenge: data.currentChallenge,
    })

    if (requiredError) {
      return { error: "submission-error", message: requiredError }
    }

    // Validate email
    if (!validateEmail(data.email)) {
      return { error: "submission-error", message: "Please enter a valid email address" }
    }

    // Check timezone restriction
    if (data.timeZone === "other") {
      return {
        error: "timezone-error",
        message: "Currently focusing on North American time zones",
      }
    }

    // Construct detailed message
    const detailedMessage = `
${data.currentChallenge}

Years in Tech: ${data.yearsInTech}
Preferred Times: ${data.preferredTimes.join(", ")}
How they heard about me: ${data.hearAbout || "Not specified"}
    `.trim()

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
        ${data.name},
        ${data.email},
        ${data.yearsInTech + " years in tech"},
        ${data.currentRole},
        'Technical Leadership Mentoring',
        ${detailedMessage},
        'Email',
        ${data.timeZone},
        'Mentoring Application'
      )
    `

    return {
      success: true,
      message: "Application submitted successfully! I'll respond within 2 business days.",
    }
  } catch (error) {
    console.error("Error submitting mentoring form:", error)
    return {
      error: "submission-error",
      message: "There was an error submitting your application. Please try again.",
    }
  }
}
