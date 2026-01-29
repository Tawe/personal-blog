---
title: "AI Holiday Card Platform: Generating Personalized Cards with Google AI"
description: "An AI-powered digital holiday card platform that lets anyone create a shareable, personalized card by choosing an occasion, a vibe, and writing a short message. The app uses Google Gemini and Imagen to rewrite the text in the selected tone and generate a matching cover image, then publishes a deep-linkable card optimized for social sharing."
status: "active"
tags:
  - AI Development
  - Next.js
  - Prototyping
  - Open Source
github: "https://github.com/your-username/ai-greeting-card"
demo: "https://holidaycard.johnmunn.tech"
icon: "Code"
featured_image: /ai-holiday-card-platform.png
date: 2026-01-28
draft: false
---

I wanted a way to send digital holiday cards that felt more personal than a generic template, but still took advantage of what modern AI tools can do. That became the **AI Holiday Card Platform**—a small app where you pick an occasion, choose a vibe (Warm, Funny, Fancy, Chaotic), write a short message, and let AI do the rest: it rewrites your message to match the tone and generates a custom cover image for the card.

The end result is a shareable, time-limited card that feels tailored to the recipient without requiring design skills, copywriting experience, or a login form. It’s built to be fast to use, easy to share, and safe to run in production.

---

## **How the platform works**

Under the hood, the app is a **Next.js 16** project using the App Router, with a clean split between API routes, UI, and infrastructure:

- **Card creation flow**: The homepage walks you through picking an occasion, selecting a vibe, and writing a raw message. From there, the backend calls **Google Gemini** to rewrite the text into the requested style, and **Google Imagen** to generate a matching cover illustration.
- **Deep-linkable cards**: Once a card is published, it gets a clean URL at `/c/[occasion]/[slug]`, so you can share it directly over text, email, or social media.
- **Social previews**: The app generates the right metadata so cards show up with a proper title, description, and image preview when shared on platforms like X, Facebook, or iMessage.
- **Time-limited storage**: Cards automatically expire after 30 days. A cleanup job removes expired content so storage doesn’t grow forever.
- **No-login experience**: Instead of user accounts, the platform combines rate limiting, content moderation, and expiration rules to keep things safe and manageable while staying frictionless.

On the backend, the app uses **Supabase Postgres** via **Drizzle ORM** for structured data, and an **S3-compatible store** (R2/S3) for card images. All AI calls are routed through a small `lib/ai` layer that keeps Gemini and Imagen usage consistent and easier to swap or refine over time.

---

## **What I focused on while building it**

This project started as a focused experiment in combining text and image generation into a single, coherent product experience:

- **Tight control over AI output**: Rather than letting the model freestyle, prompts are structured so Gemini always outputs predictable fields—message variants, tone-consistent rewrites, and safe-for-sharing text. That makes the frontend simple and keeps surprises to a minimum.
- **Error handling and retries**: Because external AI and storage APIs occasionally fail, the API routes include retry logic, clear error surfacing in the UI, and safe fallbacks so users aren’t left stuck in a loading state.
- **Production-minded architecture**: Even though this is a side project, it includes rate limiting, content moderation hooks, and cleanup jobs from the start. The goal was to treat this like something that could be deployed and left running without constant babysitting.

The internal docs (`docs/` in the repo) also walk through setup for Supabase, S3/R2, Imagen, RLS policies, and deployment, so the project is reproducible and extendable—not just a one-off demo.

---

## **Where it can go next**

Right now, the platform is focused on holiday cards, but the underlying system is flexible: occasions, vibes, and card templates all live in the database and configuration. That makes it straightforward to expand into birthdays, anniversaries, thank-you cards, or even branded campaigns.

Future directions I’m interested in exploring include richer moderation rules, reusable design themes, scheduled sending, and multi-language support. The core idea will stay the same: use AI to handle the heavy lifting—rewriting, styling, and illustration—while keeping the experience simple enough that anyone can create something that feels personal in under a minute.

