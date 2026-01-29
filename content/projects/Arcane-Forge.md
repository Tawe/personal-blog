---
title: "Arcane Forge: A High-Quality D&D Magic Item Generator"
description: "Arcane Forge is a full-featured D&D magic item generator powered by Google Gemini and Supabase. It lets you create unique items with rich lore, detailed mechanics, and AI-generated illustrations, then browse, search, and manage them in a persistent archive."
status: "active"
tags:
  - AI Development
  - Prototyping
  - Open Source
  - TTRPG Tools
github: "https://github.com/Tawe/ArcaneForge"
demo: "https://arcaneforge.netlify.app"
icon: "Code"
featured_image: /ArcaneForge.png
date: 2025-11-20
draft: false
---

**Arcane Forge** started as a quick experiment in Google AI Studio—a “can I build a D&D magic item generator from a single prompt?” kind of project. Since then, it’s grown into a **high-quality tool** for DMs: you choose item properties, let Gemini generate lore and mechanics, and get a matching image plus a persistent record of everything you’ve created.

Instead of being a one-off toy, it now behaves like a proper utility: every generated item is stored in a database, you can browse and search your collection, and the UI is tuned for fast iteration while you’re prepping a session or improvising at the table.

---

## **What Arcane Forge can do now**

The current version of Arcane Forge is built around a richer, more structured generation and browsing experience:

- **Customizable item generation**
  - Choose item type, rarity, theme, visual style, and power band
  - Optionally add curses or plot hooks for campaign integration
  - Use resonance/power levels to control how wild the item can be
- **AI-driven content and visuals**
  - Uses **Google Gemini** to generate item name, lore, mechanics, and usage details
  - Uses **Imagen via Gemini** to create a matching illustration when quota allows
- **Automatic archiving**
  - Every generated item is automatically saved to **Supabase**
  - Includes all structured fields plus image references
- **Archives browser**
  - Browse your full collection in a grid
  - Search by name, type, rarity, theme, or description
  - Filter by rarity to quickly find items at the right power level
  - Open an item for a full-detail view or delete it if you don’t need it anymore
- **Recent items**
  - See the last 6 generated items directly on the forge page
  - Jump back into recent creations with a single click

Under the hood, the app is a **React + Vite** project written in **TypeScript**, styled with **Tailwind CSS**, and wired up to **Supabase** for persistence.

---

## **How it’s built**

The app is intentionally small but production-minded:

- **Frontend**: React 19 + Vite with a focused component set (`GeneratorForm`, `MagicItemDisplay`, `RecentItems`, `SavedItems`, `ShareButton`) and a dedicated `ItemView` page for individual items.
- **AI integration**: A `geminiService` handles calls to Google Gemini for both text and image prompts, keeping prompts structured so output is predictable and easy to map into TypeScript types.
- **Data layer**: Supabase stores all generated items using a schema defined in `supabase-schema.sql`, with a small `storageService` and `supabaseClient` to keep persistence logic clean.
- **Meta and sharing**: A custom `useMetaTags` hook updates meta tags so items share nicely across platforms when you link directly to them.

The project also includes a straightforward setup flow in the README: add your Gemini API key, Supabase URL, and anon key to `.env.local`, run the schema, and you’re ready to generate and archive items.

---

## **Why this version matters**

Arcane Forge is no longer just “a thing AI scaffolded once.” It’s a tool that supports an actual workflow: generating, refining, saving, and reusing magic items over time. The combination of **structured prompts**, **persistent storage**, and a **browsable archive** makes it something you can return to between sessions and steadily build your own artificer’s compendium.

It also serves as a template for similar AI-assisted tools: swap out the schema and prompts, and the same architecture could power NPC generators, monster builders, spell books, or campaign seeds. For now, Arcane Forge is focused on magic items—but the infrastructure is ready for a whole shelf of DM-facing utilities.
