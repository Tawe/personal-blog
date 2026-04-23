---
title: "Global Accord: A Climate Negotiation Game for Earth Day"
description: "A browser-based diplomacy game where you try to build a workable international climate accord across five fictional delegations. Every move shifts trust, pressure, openness, and political momentum, making the game about tradeoffs rather than perfect solutions."
status: "active"
tags:
  - Game Design
  - React
  - Simulation
  - AI Development
  - Systems Thinking
github: "https://github.com/Tawe/global-accord"
demo: "https://global-accord.netlify.app"
icon: "Globe"
featured_image: /globalaccord.png
date: 2026-04-20
draft: false
---

**Global Accord** is a browser-based climate negotiation game inspired by the politics of a UN summit. Instead of solving for a single correct answer, the game asks players to navigate competing interests, shifting trust, and the political cost of every move while trying to assemble an international climate accord.

You negotiate across **five fictional delegations** with different priorities, constraints, and worldviews. Over ten turns, you decide how to move the room and try to secure enough commitments for anything from a narrow accord to a historic consensus, while avoiding a stalled summit or full collapse.

---

## What it does

The game is built around a turn-based diplomatic loop:

- You negotiate with five fictional countries:
  - **Ironvale** for industrial fossil-fuel stability
  - **Solara** for clean-energy leadership
  - **Deltara** for development-first growth
  - **Nordreach** for cautious technical implementation
  - **Aqualis** for climate-vulnerable urgency
- Each country tracks internal state such as:
  - trust
  - openness
  - pressure
  - a core political need
- Each turn you choose one of four actions:
  - **Offer Subsidy**
  - **Share Technology**
  - **Apply Pressure**
  - **Propose Agreement**
- Actions can be targeted or chamber-wide, and every move affects how the rest of the room reacts

The game also includes:

- a cinematic opening
- an advisor who briefs you each turn
- one-speaker-at-a-time diplomatic dialogue
- cloud saves
- optional AI-generated summit dialogue
- multiple endings based on the coalition you manage to build

---

## How it’s built

Global Accord uses a deterministic negotiation system for the actual game logic, while layering presentation and dialogue systems on top:

- **React + Vite** for the game client
- **Auth0** for player login
- **Firebase / Firestore** for cloud saves
- **Google Gemini** for optional AI-generated diplomatic dialogue
- custom CSS for the chamber UI, cinematics, and presentation flow

A few design choices stand out:

- Countries are not isolated meters. They react to direct targeting, observer effects, goodwill, backlash, and room-wide momentum.
- The advisor bar helps the game feel like reading the room instead of just pushing stats around.
- Gemini is used for flavor dialogue only, not core rules, so the game remains stable and deterministic.
- The app includes local fallback dialogue paths so the game still works even if AI output is unavailable or malformed.

That split keeps the simulation reliable while still making the summit feel alive.

---

## Why this project matters

Global Accord is interesting because it treats climate politics as a systems problem rather than a morality quiz. The point is not to identify the obviously correct move. The point is to experience how fragile agreement becomes when every participant has different constraints, incentives, and fears.

As a project, it also shows a strong blend of simulation design and product thinking. The game logic is structured enough to feel fair, but the advisor, dialogue, cinematics, and save system make it feel like a complete experience instead of a prototype spreadsheet with buttons. It is a thoughtful way to model negotiation, tradeoffs, and the difficulty of collective action in a form people can actually play.
