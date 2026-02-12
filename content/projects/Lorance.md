---
title: "Lorance: A Retrieval-First Project Assistant"
description: "An AI-powered project intelligence assistant that transforms unstructured project documentation—PRDs, meeting notes, Slack threads, design docs—into grounded answers and actionable work tickets. Built on Algolia for retrieval-first reasoning, with export to Linear, Jira, and GitHub."
status: "active"
tags:
  - AI Development
  - TypeScript
  - Next.js
  - Open Source
github: "https://github.com/Tawe/Lorance"
demo: "https://lorance.vercel.app"
icon: "Rocket"
featured_image: /lorance.png
date: 2026-02-10
draft: false
---

Teams generate a lot of documentation—PRDs, meeting notes, architecture specs, Slack threads—but extracting clear answers and execution-ready tasks from that pile is a different problem entirely. **Lorance** is a retrieval-first project assistant that constrains itself to what your documents actually say. Instead of conversational chat that drifts into invention, it indexes your project artifacts, retrieves the relevant context, and produces grounded answers and structured tickets with source attribution.

You upload documents, ask direct questions ("What tech are we using?", "What's blocked?"), generate tickets with defined scope and acceptance criteria, and export them to Linear, Jira, or GitHub Issues—all without leaving the app.

---

## **How it works**

Lorance uses **Algolia** as its retrieval backbone, with a **Next.js 16** frontend and an **Express.js** backend handling the orchestration:

- **Document indexing**: Upload project documents—PRDs, meeting notes, architecture docs, tech stack specs—and Lorance indexes them in Algolia with metadata and workspace tagging. At indexing time, segments receive scoring based on likelihood of containing actionable intent: imperative language, future commitments, soft obligations, and temporal markers all factor in.
- **Query-first retrieval**: When you ask a question or request tickets, the system searches for directly relevant content before falling back to broader searches. This keeps the agent's reasoning scoped to what's actually in your docs rather than what it could plausibly invent.
- **Ticket generation pipeline**: Enter a query or intent (e.g., "break down the authentication requirements"), and Lorance fetches relevant documents, constructs a structured prompt, and calls **Algolia Agent Studio** to generate tickets. Every ticket goes through a validation and repair pipeline before it's returned.
- **Grounding enforcement**: Tickets must cite the source documents they're derived from. If a ticket can't point back to something in your docs, it gets flagged or rejected. This is the core constraint that separates Lorance from general-purpose chat—it produces clarity you can trust because it won't fabricate work items.
- **Multi-platform export**: Push tickets directly to Linear (via GraphQL), Jira (REST), or GitHub Issues. Each adapter maps Lorance's canonical ticket schema to the target platform's fields, including priority levels, effort sizing, and labels.

Retrieval happens in sub-500ms through Algolia, so the bottleneck is generation, not search.

---

## **What I focused on while building it**

The core challenge wasn't generating tickets—it was generating tickets you'd actually use. That meant investing in the pipeline between raw AI output and what ends up in your project tracker:

- **Structured output contracts**: Agent responses conform to strict JSON schemas. Every ticket carries a title, description, type, acceptance criteria (minimum two), edge cases, open questions, setup requirements, dependencies, effort estimate, priority, labels, and a confidence score. The schema is enforced server-side with sanitization for malformed output, not just prompted for.
- **Ticket validation pipeline**: A dedicated validation layer inspects every generated ticket. Missing acceptance criteria promote a ticket to "decision" type. Fuzzy enum values get normalized (e.g., "story" becomes "user_story", "p0" becomes "critical"). Confidence scores drop when fields are inferred rather than grounded. The system logs exactly what it repaired so you can see the delta between raw output and final result.
- **Multi-tenant workspace isolation**: Every document and ticket carries a `workspace_id` derived from the authenticated Firebase user. Isolation is enforced at write time, on every read, and through scoped Algolia search keys per workspace. The agent never accesses data outside the active workspace.
- **In-place editing**: Documents and tickets can be edited directly in the app, so the feedback loop between generation and refinement stays tight without round-tripping through external tools.

---

## **Where it can go next**

Right now, Lorance handles the core loop well: ingest documents, generate grounded tickets, export them to where your team works. The next areas I'm exploring are richer document chunking for better retrieval over large artifacts, batch operations for managing ticket sets, and tighter feedback loops where exported ticket updates flow back into the system. The underlying architecture—workspace-scoped indices, a strict validation pipeline, and platform-agnostic ticket schema—is designed to support those additions without reworking what's already there.
