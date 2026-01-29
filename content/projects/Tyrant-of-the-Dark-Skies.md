---
title: "Tyrant of the Dark Skies: A Modern Multiplayer Text Adventure (MUD)"
description: "A web-based multiplayer text adventure (MUD) with a Python WebSocket server and a React frontend. Explore a persistent fantasy world, battle creatures, complete quests, and play with others in real time—with Firebase auth, character creation (race, planet, starsign), combat, inventory, and a JSON-based contribution system."
status: "active"
tags:
  - Game Development
  - Python
  - React
  - WebSockets
  - Open Source
github: "https://github.com/Tawe/tyrantofthedarkskies"
icon: "Terminal"
date: 2025-12-01
draft: false
---

**Tyrant of the Dark Skies** is a modern take on the classic MUD (Multi-User Dungeon): a multiplayer text adventure you play in the browser. Instead of telnet and terminal clients, it uses a **Python WebSocket server** for the game logic and a **React + TypeScript** web client for the UI. The result is a persistent fantasy world where you create a character, explore, fight, complete quests, and interact with other players in real time—all without installing anything.

The project is split into two repos: the **backend** (game server, combat, time system, Firebase auth and data) and the **frontend** (React app, WebSocket connection, command history, ANSI colors). That separation keeps the game engine deployable anywhere (e.g. Fly.io) and the client deployable as a static site (Netlify, Vercel, etc.), so you can run your own instance or point at a hosted server.

---

## **What the game does**

The current version is built around a full play loop:

- **Character creation**: Choose race, planet, starsign, and starting maneuvers. Each choice affects attributes, cosmic bonuses, and fate-based abilities.
- **Exploration**: Move through interconnected rooms, look around, and discover areas. The world has a dynamic time system that affects NPCs and shops.
- **Combat**: Turn-based combat with maneuvers and special abilities. The system supports different weapon types, armor, and modifiers.
- **Inventory and items**: Collect, use, and manage items. Shops let you buy, sell, and repair gear with NPCs.
- **Quests**: A quest system tracks objectives and storylines as you progress.
- **Multiplayer**: Real-time presence—see other players in the same room, chat, and share the world.
- **Firebase**: Authentication (email/password) and cloud-backed data so progress and accounts persist across sessions.
- **Contributions**: A JSON-based contribution system lets the community add rooms, NPCs, items, maneuvers, races, planets, and starsigns; contributions can be synced to Firebase when merged.

The backend is **Python** (commands, combat, time, character creation, quests, Firebase integration) with a WebSocket server; the frontend is **React 18 + Vite + TypeScript** with custom hooks for WebSocket, command history, and auth. The client supports ANSI colors, reconnection, and responsive layout so it works on desktop and mobile.

---

## **How it’s built**

**Backend (tyrantofthedarkskies)**  
- **Server**: Single WebSocket server process; game state and command handling live in modular command and system modules (combat, movement, inventory, shop, social, admin).
- **Game systems**: `combat_system`, `time_system`, `character_creation`, `quest_system`, plus runtime state and formatting utilities.
- **Firebase**: Auth (email/password) and a data layer for persistence; service account and Web API key for server-side auth and storage.
- **Content**: JSON-driven rooms, NPCs, items, races, planets, starsigns, maneuvers; contribution sync scripts to push merged content into Firebase.
- **Deployment**: Dockerfile and Fly.io config; server runs on Fly with WebSocket on a single port (e.g. 5557 locally; production uses TLS termination on 443).

**Frontend (tyrantofthedarkskies-frontend)**  
- **Stack**: React 18, TypeScript, Vite; Firebase for auth (login/register in the client).
- **Connection**: WebSocket URL is environment-driven (localhost for dev, production URL for deployed client); auto-reconnect and connection state in the UI.
- **UX**: Command input with history (arrow keys), main output area, status bar; ANSI color parsing so server output renders with correct styling.
- **Testing**: Playwright for E2E and screenshot-based flows.
- **Deployment**: Static build; can be hosted on Netlify, Vercel, or similar, with env vars for Firebase and WebSocket URL.

The split between server and client makes it possible to run the same game server for multiple clients (browser, future mobile or CLI clients) and to scale or replace either side independently.

---

## **Why this version matters**

Tyrant of the Dark Skies isn’t a prototype—it’s a playable MUD with a full loop: create character, explore, fight, do quests, and interact with others. The **Firebase** integration means accounts and progress are real and persistent; the **contribution system** means the world can grow through community JSON and sync scripts instead of code-only changes.

It also shows how to structure a **modern MUD stack**: a single WebSocket server as the source of truth, a thin React client for UX and auth, and clear boundaries between game logic, data, and UI. If you want to run your own MUD or learn how a text-based multiplayer game is built end-to-end, this project is a concrete template—and it’s open source so you can fork, host, and extend it.
