---
title: "Dev Process Tracker (`devpt`): Local Service Orchestration for Multi-Stack Development"
description: "A macOS-first Go CLI/TUI for discovering, tracking, and controlling local development services across Node, Python, and Go workflows. `devpt` unifies process visibility, lifecycle controls, health checks, logs, and crash diagnostics in one place."
status: "active"
tags:
  - Go
  - CLI
  - TUI
  - Developer Tooling
  - Process Management
github: "https://github.com/devports/devpt"
icon: "Terminal"
featured_image: /dev-process-tracker.png
date: 2026-02-16
draft: false
---

**Dev Process Tracker** (`devpt`) is a local operations tool for developers running mixed stacks. It gives you one surface to see what is running, what is registered, what is healthy, and what crashed, without juggling ad-hoc shell scripts and terminal tabs.

The project is built in **Go** with a command-line interface and an interactive **Bubble Tea** TUI.

---

## **What it does**

`devpt` is designed around day-to-day local development control loops:

- **Discovery + inventory**: scans local listening services and shows name, port, PID, project root, source, and status
- **Managed service registry**: register services with `add` and control them with `start`, `stop`, `restart`, and `remove`
- **Unified monitoring UI**: opens a TUI by default with list views, filtering, sorting, log view, and command mode
- **Health + status checks**: surfaces health information for running services and richer status output for managed ones
- **Logs and crash diagnostics**: captures service logs, marks managed services as `crashed`, and infers likely crash reasons
- **AI-agent-aware process source tagging**: detects likely agent-started services (Claude, Cursor, Copilot, etc.) and labels source context

---

## **How it’s implemented**

The architecture is modular and intentionally small:

- `pkg/scanner`: process and port discovery (`lsof`/`ps` integration), project-root resolution, source tagging heuristics
- `pkg/registry`: JSON-backed managed service registry under `~/.config/devpt/registry.json`
- `pkg/process`: process lifecycle management, signal handling, PID tracking, and log capture
- `pkg/health`: health check evaluation for managed/running services
- `pkg/cli`: command handlers plus Bubble Tea TUI interactions and keymaps

The result is a single local binary (`go build -o devpt ./cmd/devpt`) with no external service dependency.

---

## **Why this project matters**

Local development environments are often the first place delivery friction appears: orphaned processes, unclear ownership, broken restarts, and invisible crashes. `devpt` makes that operational state explicit, which shortens debug loops and improves reliability during active development.

It also reflects a broader engineering principle I care about: operational clarity should exist before production. If teams can’t reason about process state locally, they won’t reason about it confidently at scale.
