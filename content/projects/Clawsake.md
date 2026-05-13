---
title: "Clawsake: An AI Gift Memory and Recommendation System"
description: "Clawsake is an AI-powered gift memory system that captures gift ideas, preferences, and important dates, then uses local retrieval, SQLite persistence, semantic search, and OpenClaw reasoning to answer the question: what should I buy right now?"
subtitle: "A local-first AI assistant for remembering gift signals, ranking what matters, and recommending what to buy at the right time."
status: "active"
tags:
  - AI Development
  - Next.js
  - SQLite
  - Semantic Search
  - Agentic Systems
  - OpenClaw
  - AI Agents
  - Gift Recommendations
icon: "Database"
featured_image: /clawsake-banner.png
date: 2026-05-13
draft: false
---

**Clawsake** is a personal gift agent built around a simple but surprisingly thorny problem: gift ideas arrive casually, at the wrong time, and in fragments. Someone mentions a product once. A link gets pasted into a chat. A birthday is months away. By the time you actually need to buy something, the signal is gone.

The app turns those scattered signals into durable memory. It captures gift ideas, preferences, and important dates, then helps answer the practical question underneath all of it:

**What should I buy right now?**

---

## The short version

**What is Clawsake?** Clawsake is an AI gift memory system that remembers gift ideas, recipient preferences, and important dates so recommendations are grounded in real signals instead of generic gift lists.

**Who is it for?** It is for people who collect gift ideas over time, want to avoid last-minute guessing, and need a reliable way to turn casual mentions into timely buying decisions.

**What makes it different?** Clawsake combines structured local memory, semantic retrieval, signal scoring, and an OpenClaw reasoning boundary. The model helps with synthesis, but local code owns persistence, validation, ranking, and fallback behavior.

---

## What it does

Clawsake works as a small command center for gift memory:

- Capture gift ideas from natural language or pasted product links
- Save preferences like style, category, budget, gender, and taste signals
- Track birthdays, anniversaries, and global dates like Mother's Day
- Review what the system knows about a person
- Rank saved ideas by signal strength using frequency, recency, and source type
- Recommend gifts based on saved memory, semantic retrieval, upcoming dates, budget, and location
- Support follow-up prompts like:
  - "remove that"
  - "make it cheaper"
  - "for her birthday instead"

The core interaction is conversational, but the app is not just a chat wrapper. The chat surface drives structured operations against persistent memory: saving, updating, deleting, reviewing, ranking, and recommending.

---

## How it is built

Clawsake is a **Next.js 15 + React 19** app with a Node runtime and a local SQLite database. The architecture is split into three layers:

- **SQLite memory**: the source of truth for people, gift ideas, preferences, important dates, and cached embeddings
- **Local retrieval and routine actions**: deterministic saves, edits, deletes, date parsing, follow-up resolution, scoring, and local semantic retrieval
- **OpenClaw reasoning**: higher-value recommendation synthesis, live web/browser product discovery when configured, and JSON-only agent responses

That split is deliberate. Routine memory operations stay local, predictable, and cheap. The agentic layer is reserved for work that benefits from reasoning or tool use, especially recommendation synthesis and live product discovery.

The app also includes a local fallback runtime, so it remains useful even when a remote OpenClaw endpoint or live search provider is unavailable.

---

## The memory model

The data model is built around persistent gift signals:

- `people` keeps stable recipient identities
- `gift_ideas` stores links and text-based ideas with title, category, tags, price, notes, source type, and mention count
- `preferences` stores explicit or inferred per-person preferences
- `important_dates` stores personal and global trigger dates
- `memory_embeddings` caches local vector embeddings so semantic retrieval does not recompute the same memory repeatedly

Gift ideas are scored using a practical signal formula:

- repeated mentions increase confidence
- recent mentions matter more
- links are weighted more strongly than casual text
- ideas with real URLs get an additional boost

That makes recommendations feel less like generic gift generation and more like recall with judgment layered on top.

---

## Retrieval and recommendation flow

The recommendation path starts with the saved memory, not with the model.

When you ask for a gift, Clawsake resolves the person and intent, pulls the relevant gift ideas, preferences, and dates from SQLite, then uses local embeddings through `@xenova/transformers` with `Xenova/all-MiniLM-L6-v2` to re-rank memory by semantic relevance.

From there, the app can take several paths:

- If the prompt is a routine write, review, update, or delete, it handles the action locally.
- If live search is configured, it builds product search queries from the recipient's memory and inspects candidate product pages.
- If OpenClaw is connected, it sends a strict JSON prompt envelope with the user's request, memory context, retrieval candidates, and live-search results.
- If the remote agent fails, returns malformed output, or suggests links that were not present in the retrieval context, Clawsake falls back to app-scored local results.

The important part is integrity: recommendation cards require real external `http(s)` links when they claim to be live products. The app no longer presents internal catalog items as if they were discovered from the web.

---

## Why this project matters

Clawsake is interesting because it treats an AI assistant as part of a larger product system rather than the whole system.

The agent is not trusted with everything. Local code owns persistence, identity resolution, validation, scoring, semantic retrieval, and write execution. The model is invited in where it helps: interpreting intent, synthesizing recommendations, and using live web context when the runtime is healthy.

That makes the project a useful example of agentic architecture with boundaries:

- memory is structured
- writes are deterministic
- retrieval happens before reasoning
- remote output is validated
- fallback paths are honest

As a product, it solves a very human problem: remembering what people told you mattered before the moment you need to act on it. As an engineering project, it shows how much better AI tools become when they are surrounded by boring, reliable systems that know what they are responsible for.
