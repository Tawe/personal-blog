---
title: "Dinosaur Eats: A Browser Extension That Lets Dinosaurs Eat the Internet"
description: "A Manifest V3 Chrome extension that sends tiny pixel dinosaurs onto any webpage and lets them eat visible text line by line. It includes sprite animation, herd behavior, chomp audio, and a hidden `418` mode that mutates the dinosaurs into teapotsaurs."
status: "active"
tags:
  - JavaScript
  - Browser Extension
  - Chrome Extension
  - Creative Coding
  - Pixel Art
github: "https://github.com/Tawe/dinosaur-eats"
icon: "Rocket"
featured_image: /dinosaureats.png
date: 2026-04-07
draft: false
---

**Dinosaur Eats** is a proudly useless Chrome extension that sends a tiny pixel dinosaur onto any webpage and lets it chew through the visible text line by line. It started as a joke project, but the implementation quickly turned into a much more interesting engineering problem than the premise suggests.

Click the toolbar icon and the extension scans the current page for readable text, lines up the dinosaur, and starts removing content one rendered line at a time until the page looks like it survived a very localized extinction event. Sometimes it is one dinosaur. Sometimes it escalates into a full stampede.

---

## What it does

- Activates from the browser toolbar on the current tab
- Scans the page for visible readable text
- Detects actual rendered line breaks rather than deleting whole DOM blocks
- Animates a dinosaur walking in and eating text on the bite frame
- Supports optional herd behavior for more chaotic destruction
- Includes looping chomp audio
- Hides a protocol joke:
  - typing `418` mutates dinosaurs into teapotsaurs
  - typing `814` switches them back

The extension solves absolutely nothing, but it does it with a lot of commitment.

---

## How it’s built

Dinosaur Eats is built as a **Manifest V3 Chrome extension** using:

- JavaScript
- a background service worker
- content scripts
- Chrome `activeTab`, `storage`, and `scripting` APIs
- CSS sprite animation
- custom dinosaur and teapotsaur sprite sheets

The most interesting technical decision was making the dinosaur eat **rendered lines instead of paragraphs or DOM sections**.

Browsers do not really expose “visible lines of text” as a native concept, so the extension has to create that layer itself by wrapping text, measuring browser line breaks, grouping spans into visible rows, randomizing destruction order, and syncing the DOM mutation to the exact animation frame where the bite happens.

That means the joke depends on layout measurement, span grouping, sprite timing, and careful DOM choreography. It is an unreasonable amount of engineering effort for a browser prank, which is exactly what makes the project fun.

---

## Why this project matters

Dinosaur Eats is a good example of playful software that still has real craft in it. The visible joke is simple, but the experience only works because the implementation respects how pages are actually rendered instead of taking the easy route and deleting big chunks of markup.

It also shows a pattern I like in side projects: a silly premise can still uncover a genuinely interesting technical problem. Here, the problem was how to model visible text as something a system can target precisely and destructively, while keeping the animation readable and funny. Add the hidden `418` teapotsaur mode, and the whole thing lands as a tiny piece of respectful internet nonsense with real engineering underneath it.
