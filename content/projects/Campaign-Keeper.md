---
title: "Campaign Keeper: A Session Journal for Tabletop RPG Groups"
description: "Campaign Keeper is a lightweight campaign journal for tabletop RPG groups, built to preserve continuity across sessions with structured recaps, open threads, and shared player-safe notes."
status: "experimental"
tags:
  - TTRPG Tools
  - Next.js
  - Firebase
  - Product Design
  - Systems Thinking
github: "https://github.com/Tawe/Campaign-Keeper"
demo: "https://campaign-keeper.netlify.app"
icon: "Rocket"
featured_image: /campaginkeeper.png
date: 2026-03-06
draft: false
---

**Campaign Keeper** is a session-memory app for tabletop RPG campaigns. It was built to solve a common table problem: important details get scattered across chat logs, notebooks, and memory, and continuity degrades over time.

Instead of treating each session as an isolated note, Campaign Keeper treats campaign state as a system: sessions, NPCs, locations, open threads, player recaps, and DM-only context all stay connected.

---

## What it does

- Manage multiple campaigns with their own sessions, NPCs, locations, players, and unresolved threads
- Log sessions quickly with structured inputs (highlights, notes, tags, locations, mentions, loot, outcomes)
- Generate recap outputs with a strict visibility split:
  - **Player recap**: player-safe highlights and public threads
  - **DM recap**: full context, including private notes and private threads
- Publish public recap links per session with rotatable/disableable share tokens
- Collect anonymous player feedback from shared recap pages
- Search across sessions, NPCs, and threads within campaign scope

---

## Architecture and stack

Campaign Keeper is built with:

- **Next.js 16 + React 19**
- **Firebase Auth** (magic-link sign-in)
- **Firestore** via `firebase-admin` for server-side data operations
- **Private S3 storage** for NPC/player portraits, served through authenticated app routes
- **Tailwind + shadcn/ui** for UI primitives

The app uses a practical split between client and server concerns:

- auth/session handling through server routes and HttpOnly cookies
- Firestore as the campaign system-of-record
- S3 for binary assets with private object access patterns
- recap and markdown generation logic encapsulated in library utilities

---

## Data model choices

The project uses flat Firestore collections scoped by `userId` and `campaignId` (campaigns, sessions, threads, NPCs, mentions, locations, visits, and poll responses).

A notable design decision is selective denormalization for recap and dashboard speed:

- `npc_mentions` and location visit records retain context needed for fast rendering
- recap generation can avoid expensive fan-out queries in common flows

This keeps the app responsive as campaigns accumulate history.

---

## Why this project matters

Campaign Keeper is less about note-taking UI and more about continuity quality.

When continuity is weak, prep effort increases and narrative coherence declines. This project explores a lightweight operational model for campaign memory: fast capture, clear visibility boundaries, and durable retrieval between sessions.

It also doubles as a useful engineering exercise in balancing:

- product ergonomics vs. data correctness
- public sharing vs. private context
- lightweight workflow vs. long-lived state management
