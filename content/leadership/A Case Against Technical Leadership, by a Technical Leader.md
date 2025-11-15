---
title: "A Case Against Technical Leadership, by a Technical Leader"
subtitle: "How our need to prove value destroys the value we’re trying to create"
date: 2025-08-14
excerpt: "A candid look at how modern technical leadership slows teams down with process, oversight, and vanity projects, despite the best of intentions."
tags:
  - Engineering Leadership
  - Software Development
  - Agile Methodology
  - Team Productivity
  - Team Culture
featured_image: /acaseagainsttechnicalleadership.webp?height=400&width=800
reading_time: 7
medium_link: https://medium.com/@johnmunn/a-case-against-technical-leadership-by-a-technical-leader-5449476b7541
devto_link:
substack:
draft: false
---

I want to say something that might sound a little odd coming from someone in my role. I think the way we practice technical leadership today is hurting the very teams we’re supposed to support.

I’m a Head of Development. I oversee dev teams across several business units. And over time, I’ve realized that in our effort to prove our value to the business, we’re actually taking time, focus, and momentum away from the work that moves the business forward.

Let me explain with a metaphor that’s been on my mind lately.

## The Oxen and the Yoke

Picture this, you’re a farmer with the strongest oxen around. These beasts are fast, reliable, and can get more done in a day than anyone else’s.

But you start worrying. What if people don’t realize how good of a farmer you are? So, you start adding things to their yoke.

A bell so people know they’re working. A tracker to count their steps. Safety gear. A guidance system to ensure perfectly straight lines. Before long, the oxen that once flew across the field are now dragging a load they never needed. They slow down. You get frustrated.

“Why aren’t you faster? I gave you all this stuff to help!”

This is what we do to our developers.

## What We Add

Developers are the oxen. They’re the ones creating value and solving problems, building features, shipping products. Left alone, they’re fast and creative.

But we keep adding weight.

- We introduce **governance frameworks** that force devs to write up decisions that could have taken five minutes in Slack. At one company I worked with, the engineering team spent nearly 20% of their sprint time documenting architectural decisions to satisfy internal review boards, none of which materially impacted their ability to ship high-quality code.
- We build **approval workflows** where engineers have to justify decisions to people who won’t be the ones maintaining the code. I’ve seen teams wait over a week for sign-off from architecture committees, delaying hotfixes that would’ve taken an hour to implement.
- We pile on **ceremonies** and syncs and updates in the name of collaboration, fracturing focus and making deep work harder.
- We enforce **reporting requirements** that translate code into business KPIs that no one actually uses to make real decisions. In one case, devs were asked to report on “cost per story point”, a metric meant to tie engineering effort to business value, but in practice became a distraction. It eventually evolved into developers having to explain every sprint why their CPSP had gone up or down, even when the variance was due to things like bug triage, on-call duties, or exploratory spikes, none of which were tied to actual value delivery.

Each of these might sound reasonable on its own. But stacked together, they become a burden.

## The Relevance Trap

The worst part? It’s not because we’re bad at our jobs. It’s because of how we’re incentivized.

Mark Schwartz hits this in _A Seat at the Table_: technical leaders, trying to stay relevant in agile environments, often create processes and constraints that end up slowing teams down. It’s about trying to show value, but in doing so, we hurt delivery.

This gets even trickier when leadership teams support multiple business units. We standardize for consistency, but that consistency becomes friction. A process that helps one team becomes a blocker for another.

We fall into what I call the **“relevance trap.”** We want to be helpful. We want to be involved. So we add checkpoints, build frameworks, create “value” we can measure, but in ways that serve us more than the teams.

And sometimes, it’s not process, it’s pet projects.

## The Shiny Object Yoke

Some of the heaviest things we add aren’t bureaucratic. They’re technical distractions dressed up as strategic work.

- “Let’s build our own monitoring stack, it’ll be better tailored to our needs.” Meanwhile, our off-the-shelf tool works fine for almost everything.
- “We need a custom CI/CD pipeline.” Meanwhile, customer-facing features are delayed because we’re building tools for a future that may never come.
- “This is a great learning project for the team.” Meanwhile, our flagship product is struggling to meet roadmap goals.

We justify it as investing in tech excellence. But often, it’s tech theater. Smart people solving fake problems.

At one company, a senior engineering team spent over three months building a custom internal metrics dashboard that looked great, but no one used it beyond the first week. Meanwhile, the product’s core onboarding flow had a 60% drop-off rate that went untouched. The flashy tool gave the illusion of progress, but it came at the cost of real impact.

It feels good to build clever systems, but clever doesn’t always equal useful.

## What Teams Actually Need

Teams don’t need more yokes. They need fewer obstacles. They need you to get out of the way.

A good farmer doesn’t prove their worth by weighing down the ox. They make sure the path is clear and let the ox do what it does best.

So here’s the question. What if our value didn’t come from being visible?

What if we made it so teams could move faster without us? What if the real mark of leadership was how little we had to touch a decision, not how many decisions flowed through us?

## A Better Way to Lead

I’m not saying technical leadership should disappear. I’m saying it needs to evolve.

- **Instead of enforcing standards**, build resources and guidance that help teams make good calls for their context.
- **Instead of requiring approvals**, set up systems and platforms that enable safe, fast decisions.
- **Instead of managing delivery**, remove the organizational friction that slows it down.

We’re still needed. But the role shifts, from controller to enabler. That shift starts with intention and follow-through. Instead of issuing top-down standards, build open-source style playbooks that teams can adopt, remix, or reject based on context, then share learnings. Rather than gatekeeping infrastructure or tools, invest in self-service platforms. Well-documented APIs, reusable CI/CD templates, permission less deployment paths with built-in safety checks. Provide real-time guidance through office hours, not approvals. Your job shifts from saying “yes” or “no” to making sure the team doesn’t need to ask.. From gatekeeper to multiplier.

## The Measurement Problem

Here’s the tricky part. It’s hard to measure what isn’t there.

We can track code written, story points closed, and deployments made. But it’s hard to quantify _cognitive load reduced_. Or _frustration avoided_. Or _a decision that didn’t need escalation_.

And because invisible work doesn’t show up in reports, we default to things we _can_ track, like processes created and decisions reviewed.

But we need to change what we measure:

- Team speed, not process adherence. Use cycle time or lead time per feature as a starting point
- Time to value, not oversight tasks. Track time from idea to production and how quickly users see outcomes
- Decision latency, not how many people were involved. Measure time between a proposed solution and a green-light to start
- Autonomy, not control. Conduct team retros or pulse surveys to assess perceived ownership and trust

## My Confession

I’ve made all the mistakes I just described.

I’ve created standards that slowed delivery. I’ve set up workflows that made sense to me but drained the team’s time. I’ve inserted myself into decisions that didn’t need me.

I thought I was helping. I thought it showed leadership. But all it really did was distract great people from doing great work.

And the scary part of pulling back? Wondering if I still matter.

But I’ve realized that technical leaders who fail to adapt _really do_ become irrelevant, not because they stepped back, but because they kept standing in the way.

## The Challenge

So if you lead dev teams, here’s a challenge:

Audit your yokes.

- What are you tracking that exists mostly for your peace of mind?
- What approvals could become guidance?
- What processes could be replaced with guardrails?
- What meetings could be replaced with async decisions?
- Where can you start a small experiment, like removing a recurring meeting or trialing team-level decision rights, and track what happens?

And for each, ask “Does this help the team move faster? Or does it just help me feel in control?”

The future belongs to leaders who remove weight, not add it. Who make space, not noise. Who enable speed, not slow it down.

And if you can’t shake the need to stand out, to be seen as the most valuable person in the room, then do your team a favor and step aside. That craving for significance is killing their ability to move the company forward in a way that actually matters.

The field won’t plow itself. But if we stop getting in the way, our teams might just fly across it.