---
title: "Mental Models a Senior Engineering Leader Uses (and How to Know When You're Using the Wrong One)"
date: 2026-03-03
excerpt: "A practical set of mental models for senior engineering leadership, with guidance on when each model helps and when it starts causing harm."
tags:
  - Leadership
  - Engineering Management
  - Decision-Making
  - Systems Thinking
  - Organizational Design
reading_time: 5
featured_image: /mentalmodels.png?height=400&width=800
medium_link: https://medium.com/@johnmunn/mental-models-a-senior-engineering-leader-uses-5cebd38717ec
devto_link:
substack:
draft: false
---

I've read a lot of mental model articles over the years. Most of them fall into the same trap.

They treat mental models like Pokemon. Gotta know them all. I've made that mistake myself.

At senior levels, that's not the problem.

The problem is misapplication. Using a clean, elegant model in a messy situation. Reaching for structure when you need exploration. Applying control when what you actually need is clarity.

What follows isn't a greatest-hits list. It's a working set. These are the models I actively reach for, why I reach for them, and the moments when I've learned to put them away.

## Sense-making models

### When I reach for them

When everyone sounds confident but no one agrees. When requirements keep changing names. When the room is full of solutions and empty of shared understanding.

This usually shows up early in initiatives, during incidents with unclear blast radius, or any time we're operating in a domain we don't actually understand yet.

### Why they matter

When cause and effect aren't clear, planning harder usually makes things worse.

I've learned this the slow way. Detailed plans feel responsible, but in fuzzy situations they mostly create false confidence. You get beautiful roadmaps and very little learning.

What actually helps is running small, safe probes. Try something reversible. Watch what breaks. Learn where the edges really are.

Once cause and effect starts to show itself, structure becomes useful again. Before that, it mostly gets in the way.

There's a name for this distinction, but the label matters less than the behavior.

### How they get misused

Uncertainty gets treated as a personal failure. Leaders overcommit because admitting "we don't know yet" feels like weakness. The result is brittle plans that collapse under first contact with reality.

## Reversibility and time-based cost models

### When I reach for them

Any decision that other decisions will build on. Anything that smells like "we'll just start and see how it goes."

Hiring. Data models. Identity boundaries. Vendor choices. Org structure.

### Why they matter

Most decisions don't start irreversible. They become irreversible over time.

What I actually care about is not whether a decision is reversible in theory, but how long it stays cheap to change in practice. That window closes faster than people expect.

This model forces the timing conversation earlier, before momentum makes the decision for you.

### How they get misused

"We can change it later" turns into a substitute for doing the hard thinking now. Later arrives, and the system has already locked it in.

## Risk and signal models

### When I reach for them

When the dashboards look green but my calendar is filling up with "quick syncs." When teams add process defensively. When people hesitate in reviews instead of disagreeing.

### Why they matter

Metrics tell you what already happened. They almost never tell you what's about to.

At senior scope, the early warnings are social and operational. Friction moves first. Numbers follow.

This model shifts my attention from performance to pressure. Pressure is where failures incubate.

### How they get misused

Leaders overcorrect and ignore metrics entirely. The goal isn't vibes-based leadership. It's using signals to decide where to look before metrics catch up.

## Boundary and ownership models

### When I reach for them

When capable teams are moving slowly. When incidents sprawl across Slack channels. When work gets stuck in handoffs.

### Why they matter

As systems scale, failure migrates outward. It shows up at boundaries between teams, services, incentives, and responsibilities.

Clear ownership doesn't prevent failure, but it contains it. Ambiguous ownership guarantees drawn-out incidents and finger-pointing that no one enjoys.

### How they get misused

Treating boundary problems as purely technical. That's how you end up with adapter layers instead of accountability.

## Process and trust models

### When I reach for them

Whenever someone proposes a new process "just to be safe." Or when teams complain about friction but can't quite name the cause.

### Why they matter

Every process encodes a trust decision. It answers who is trusted to decide and who isn't.

At senior levels, process should reduce cognitive load for teams, not shield leadership from uncertainty. This model helps make that trade explicit.

### How they get misused

Process gets added without rebuilding trust. The result is slow teams that optimize for approval instead of outcomes.

## Org and structure models

### When I reach for them

When a change effort shows up as new language but the same approval paths. When teams get renamed but decision authority stays exactly where it was. When pilots prove value and then quietly die.

Those are all early warning signs.

### Why they matter

Organizations are very good at appearing to change while preserving how power actually works. I've watched this play out more times than I care to count.

I've learned to stop asking what tools or processes are being introduced and start asking what actually moved.

Who can decide now that couldn't before? Who takes the blame when something goes wrong? What incentives changed in practice, not on paper?

If those answers are the same as before, the system will snap back. Not because people are malicious, but because systems optimize for survival.

If you've seen Larman's Laws before, this is that pattern in the wild.

### How they get misused

This pattern gets treated as an excuse to be cynical. It isn't. It's a reminder that real change requires structural pressure. Language, training, and tooling don't create change on their own.

## Alignment and clarity models

### When I reach for them

When approval queues grow. When leaders feel pulled into details they shouldn't need to touch. When teams ask for permission instead of making decisions.

### Why they matter

Control works at small scale. It collapses at senior scale.

What scales is clarity. Clear ownership. Clear priorities. Clear tradeoffs. Clear explanation of what actually matters.

My job shifts from approving decisions to shaping the context in which good decisions get made.

### How they get misused

Leaders confuse presence with impact. More involvement creates bottlenecks and quiet workarounds.

## Closing

Senior leadership isn't about collecting models. It's about switching between them deliberately.

Most failures I've seen weren't caused by bad decisions. They came from applying a tidy model to a messy reality.

If there's a Monday-morning takeaway here, it's this: when something feels off, don't reach for a better answer first. Reach for a different lens.

Bad models don't just produce bad decisions. They produce surprise. And surprise is the tax you pay for using the wrong lens too long.

## A few warning signs I've learned to watch for

| If you notice...                    | You're probably using...            | Try switching to...           |
| ----------------------------------- | ----------------------------------- | ----------------------------- |
| Analysis paralysis                  | A control-first model               | A probe-and-learn model       |
| "We'll fix it later"                | A theoretical reversibility model   | A time-based cost model       |
| Permission-seeking everywhere       | A process-heavy model               | A clarity and alignment model |
| Green dashboards, rising friction   | A metrics-only view                 | A signal and risk lens        |
