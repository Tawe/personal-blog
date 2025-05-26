"use server"

import { neon } from "@neondatabase/serverless"
import nodemailer from "nodemailer"

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

// Email sending function using Gmail SMTP
async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    })

    const mailOptions = {
      from: `"John Munn" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo || process.env.GMAIL_USER,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
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

    // Send email to your Gmail address with the sender's email as reply-to
    await sendEmail(process.env.GMAIL_USER!, emailSubject, emailHtml, formData.email)

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

    return {
      success: true,
      message: "Thank you for your message! I'll respond within 24-48 hours. Check your email for a confirmation.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)

    // If email fails but database succeeded, still show success but mention email issue
    if (error instanceof Error && error.message.includes("send")) {
      return {
        success: true,
        message: "Your message was received! I'll respond within 24-48 hours.",
      }
    }

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

    // Send email notification
    const emailSubject = `New Mentoring Application: ${data.name}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Mentoring Application
        </h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Current Role:</strong> ${data.currentRole}</p>
          <p><strong>Years in Tech:</strong> ${data.yearsInTech}</p>
          <p><strong>Time Zone:</strong> ${data.timeZone}</p>
          <p><strong>Preferred Times:</strong> ${data.preferredTimes.join(", ")}</p>
          <p><strong>How they heard about you:</strong> ${data.hearAbout || "Not specified"}</p>
        </div>
        <h3 style="color: #1e293b;">Current Challenge:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0;">
          ${data.currentChallenge.replace(/\n/g, "<br>")}
        </div>
      </div>
    `

    await sendEmail(process.env.GMAIL_USER!, emailSubject, emailHtml, data.email)

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
