---
title: "Campaign Keeper: A Full Campaign Tracker for Tabletop RPG Groups"
description: "Campaign Keeper started as a lightweight session journal and evolved into a full campaign operating system for tabletop RPG groups, with structured recaps, entity libraries, timelines, player portals, scheduling, and custom in-world calendars."
status: "active"
tags:
  - TTRPG Tools
  - Next.js
  - Firebase
  - Product Design
  - Systems Thinking
github: "https://github.com/Tawe/Campaign-Keeper"
demo: "https://campaign-tracker.com"
icon: "Rocket"
featured_image: /campaginkeeper.png
date: 2026-03-06
draft: false
---

**Campaign Keeper** began as a session-memory app for tabletop RPG campaigns. It was built to solve a common table problem: important details get scattered across chat logs, notebooks, and memory, and continuity degrades over time.

Since then, it has grown into something much broader: a campaign operating system for long-running games. Instead of treating each session as an isolated note, Campaign Keeper now treats campaign state as a connected system of sessions, NPCs, locations, factions, events, player access, timelines, and DM-only context.

---

## What it does

- Manage multiple campaigns with their own sessions, NPCs, locations, factions, events, players, and unresolved threads
- Log sessions quickly with structured inputs so continuity can be captured right after play instead of turning into homework later
- Generate recap outputs with a strict visibility split:
  - **Player recap**: player-safe highlights and public threads
  - **DM recap**: full context, including private notes and private threads
- Maintain global libraries for NPCs, locations, factions, and world events, with campaign-specific projections of those entities
- Track timelines and support custom in-world calendars for lore-heavy campaigns
- Upload portraits and art for campaign entities
- Provide a player portal with invite links and campaign-safe access
- Schedule sessions with RSVP links, attendance tracking, and email reminders
- Offer a vault-style view across campaigns for reusable worldbuilding data
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
- **Resend** for transactional email flows like invites and reminders
- **Tailwind + shadcn/ui** for UI primitives

The app uses a practical split between client and server concerns:

- auth/session handling through server routes and HttpOnly cookies
- Firestore as the campaign system-of-record
- S3 for binary assets with private object access patterns
- recap and markdown generation logic encapsulated in library utilities
- separate product surfaces for DM workflows, player access, and public share links

---

## Data model choices

The project uses flat Firestore collections scoped by `userId` and `campaignId`, but the more interesting shift is conceptual: campaign data lives on two layers.

Some information is globally true about an entity, while other information is campaign-specific:

- an NPC portrait may be global
- player knowledge about that NPC is campaign-specific
- a faction definition may be global
- its relationships and private notes are campaign-specific

That pushed the project toward a two-layer model:

- a global entity library
- campaign-specific junction records and projections

A notable design decision is selective denormalization for recap and dashboard speed:

- `npc_mentions` and location visit records retain context needed for fast rendering
- recap generation can avoid expensive fan-out queries in common flows
- entity relationships can be traversed without rebuilding the whole world model from raw notes

This keeps the app responsive as campaigns accumulate history.

Another important architectural decision is that public and private access boundaries are enforced structurally, not cosmetically. DM notes, player views, and public links operate as different trust surfaces with different queries and assumptions, which matters much more than hiding a few buttons in the UI.

---

## Why this project matters

Campaign Keeper is less about note-taking UI and more about continuity quality.

When continuity is weak, prep effort increases and narrative coherence declines. What makes this project stronger now is that it still respects the original constraint, continuity without homework, even as it has expanded into scheduling, player coordination, timelines, and worldbuilding.

It also doubles as a useful engineering exercise in balancing:

- product ergonomics vs. data correctness
- public sharing vs. private context
- lightweight workflow vs. long-lived state management
- reusable global entities vs. campaign-specific state
- niche product focus vs. scope growth as a real user need becomes clearer
