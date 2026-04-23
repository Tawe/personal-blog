---
title: "Pair Programming with an Asshole: A Retro JavaScript Game About Social Pressure in Engineering"
description: "A browser game about fixing JavaScript tickets while pairing with Chuck, a brilliant but socially corrosive coworker. What starts as a retro coding game turns into a systems design exercise in hidden tests, interruption logic, and the reality that bad engineering decisions are often social before they are technical."
status: "active"
tags:
  - JavaScript
  - Game Development
  - Browser Game
  - Systems Design
  - Developer Experience
github: "https://github.com/Tawe/pair-programming-with-an-asshole"
demo: "https://pair-programming-with-an-asshole.johnmunn.tech/"
icon: "Code"
featured_image: /pairprogrammingwithanasshole.png
date: 2026-03-31
draft: false
---

**Pair Programming with an Asshole** is a retro-styled browser game about a part of software work that most coding games skip: what happens when the code is solvable, but the social environment is the real problem.

You work through JavaScript tickets while pairing with Chuck, a technically sharp coworker whose interruptions, certainty, and dismissiveness create pressure that changes how you code. The result sits somewhere between a coding game, a workplace simulator, and a small emotional horror story for developers who have absolutely worked with this guy before.

---

## **What the project does**

Each run takes the player through five JavaScript scenarios with a structured loop:

- A stylized ticket appears
- Chuck comments before you write code
- You enter a retro pixel IDE
- You submit a JavaScript fix
- Chuck interrupts while you work
- Visible tests teach the happy path
- Hidden tests expose production reality
- A debrief scores both the code and the human dynamics

The key design idea is that the game does not only ask whether the code works. It asks what kind of engineering decisions players make under pressure, especially when confidence, hierarchy, and social friction are shaping those decisions in real time.

---

## **How it’s built**

The prototype is modularized into focused JavaScript files rather than one large script:

- `src/game.js` for the core game loop and progression
- `src/data.js` for scenario and authored content
- `src/evaluator.js` for visible and hidden test evaluation
- `src/dom.js` and `src/editor-ui.js` for UI flow and editor interactions
- `src/utils.js` for shared helpers

Under the hood, the interesting logic is less about syntax checking and more about systems behavior:

- Scenario data drives authored pacing and interruption rules
- Chuck reacts to player actions rather than existing as static dialogue
- Hidden tests model the gap between "passes locally" and "safe in production"
- State transitions matter as much as the code solutions themselves

That makes the project feel less like a toy puzzle collection and more like a small narrative systems design problem.

---

## **Why this project matters**

This project models something real about engineering work: technical judgment is often shaped by ego, pressure, certainty, and team dynamics before it shows up as a bug. Pair programming is not automatically collaborative, and some of the hardest failures in software happen because the human system around the code is broken.

What makes the game interesting is that Chuck is sometimes rude and still technically right. That tension forces players to reason about tradeoffs instead of just rejecting him as a caricature. It turns social pressure into a playable mechanic, which is a much more original design space than a standard code puzzle game.

As a project, it also shows how a simple premise can become stronger through systems thinking: interruption logic, fairness tuning, hidden-test design, and authored debriefs all matter more than flashy mechanics here. The result is a weird, memorable, and surprisingly insightful little browser game.
