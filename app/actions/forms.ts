"use server"

import { headers } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { Resend } from "resend"

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  return neon(url)
}
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const fromEmail = process.env.RESEND_FROM ?? "Contact <onboarding@resend.dev>"

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>")
}

// In-memory rate limit: max 5 submissions per IP per 15 minutes (per serverless instance)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) return false
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return true
}

const RESEND_TEST_FROM = "Contact <onboarding@resend.dev>"

// Send email via Resend (set RESEND_API_KEY; set RESEND_FROM to a verified domain or leave unset to use test sender)
async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; email not sent:", { to, subject })
    return { messageId: "skipped-no-api-key" }
  }
  const payload = {
    from: fromEmail,
    to: [to],
    subject,
    html,
    ...(replyTo && { replyTo: [replyTo] }),
  }
  let result = await resend.emails.send(payload)
  // If domain isn't verified, retry with Resend's test sender so the form still works
  if (result.error?.message?.includes("domain is not verified") && fromEmail !== RESEND_TEST_FROM) {
    console.warn("Resend: domain not verified for", fromEmail, "- retrying with", RESEND_TEST_FROM)
    result = await resend.emails.send({ ...payload, from: RESEND_TEST_FROM })
  }
  if (result.error) {
    console.error("Resend send failed:", result.error)
    throw new Error(result.error.message)
  }
  return { messageId: result.data?.id ?? "sent" }
}

const CONTACT_MAX_NAME = 200
const CONTACT_MAX_EMAIL = 254
const CONTACT_MAX_MESSAGE = 5000
const HONEYPOT_FIELD = "website" // hidden field; bots that fill it are rejected

// Simple contact page form (name, email, message only)
export async function submitContactPageForm(formData: FormData) {
  try {
    const h = await headers()
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown"
    if (!checkRateLimit(ip)) {
      return { success: false, error: "Too many messages. Please try again later." }
    }

    const honeypot = (formData.get(HONEYPOT_FIELD) as string)?.trim()
    if (honeypot) {
      return { success: true, message: "Thanks for your message. I'll get back to you soon." }
    }

    const name = (formData.get("name") as string)?.trim().slice(0, CONTACT_MAX_NAME) ?? ""
    const email = (formData.get("email") as string)?.trim().slice(0, CONTACT_MAX_EMAIL) ?? ""
    const message = (formData.get("message") as string)?.trim().slice(0, CONTACT_MAX_MESSAGE) ?? ""

    if (!name) return { success: false, error: "Please enter your name." }
    if (!email) return { success: false, error: "Please enter your email." }
    if (!validateEmail(email)) return { success: false, error: "Please enter a valid email address." }
    if (!message) return { success: false, error: "Please enter a message." }

    if (process.env.DATABASE_URL) {
      await getSql()`
        INSERT INTO contact_submissions (
          name, email, organization, "current_role", inquiry_type, message,
          preferred_contact_method, time_zone, timeline
        ) VALUES (
          ${name}, ${email}, NULL, NULL, 'Contact', ${message},
          NULL, NULL, NULL
        )
      `
    }

    const emailSubject = `Contact form: ${name.slice(0, 80)}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1e293b;">New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Message:</strong></p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 12px 0;">
          ${escapeHtml(message)}
        </div>
      </div>
    `
    const contactTo = process.env.CONTACT_FORM_TO ?? process.env.GMAIL_USER ?? "john@johnmunn.tech"
    await sendEmail(contactTo, emailSubject, emailHtml, email)

    return { success: true, message: "Thanks for your message. I'll get back to you soon." }
  } catch (error) {
    console.error("submitContactPageForm error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again or email john@johnmunn.tech directly.",
    }
  }
}

// Contact form submission
export async function submitContactForm(formData: ContactFormData) {
  try {
    console.log("Starting contact form submission for:", formData.name)

    // Validate required fields
    const requiredError = validateRequired({
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      message: formData.message,
    })

    if (requiredError) {
      console.log("Validation error:", requiredError)
      return { success: false, error: requiredError }
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      console.log("Invalid email format:", formData.email)
      return { success: false, error: "Please enter a valid email address" }
    }

    console.log("Inserting into database...")

    // Insert into database
    await getSql()`
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

    console.log("Database insert successful")

    // Send email notification to you
    const emailSubject = `New Contact Form Submission: ${formData.inquiryType}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          <p><strong>Organization:</strong> ${formData.organization || "Not provided"}</p>
          <p><strong>Current Role:</strong> ${formData.currentRole || "Not provided"}</p>
          <p><strong>Inquiry Type:</strong> ${formData.inquiryType}</p>
          <p><strong>Preferred Contact Method:</strong> ${formData.preferredContactMethod || "Not provided"}</p>
          <p><strong>Time Zone:</strong> ${formData.timeZone || "Not provided"}</p>
          <p><strong>Timeline:</strong> ${formData.timeline || "Not provided"}</p>
        </div>
        <h3 style="color: #1e293b;">Message:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0;">
          ${formData.message.replace(/\n/g, "<br>")}
        </div>
      </div>
    `

    console.log("Sending notification email...")

    // Send email to your Gmail address with the sender's email as reply-to
    await sendEmail(process.env.GMAIL_USER!, emailSubject, emailHtml, formData.email)

    console.log("Sending confirmation email...")

    // Send confirmation email to the user
    const confirmationSubject = "Thank you for contacting John Munn"
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          Thank you for your message!
        </h2>
        <p>Hi ${formData.name},</p>
        <p>I've received your message regarding "<strong>${formData.inquiryType}</strong>" and will respond within 24-48 hours.</p>
        <p>Here's a copy of what you sent:</p>
        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
          ${formData.message.replace(/\n/g, "<br>")}
        </div>
        <p>Best regards,<br><strong>John Munn</strong><br>
        <a href="https://johnmunn.tech">johnmunn.tech</a></p>
      </div>
    `

    await sendEmail(formData.email, confirmationSubject, confirmationHtml)

    console.log("All emails sent successfully")

    return {
      success: true,
      message: "Thank you for your message! I'll respond within 24-48 hours. Check your email for a confirmation.",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

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
    await getSql()`
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
