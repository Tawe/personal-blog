---
title: "Before You Refactor Anything, Be Sure You’re Solving the Right Problem"
subtitle: "A story that feels familiar because it is"
date: "2025-11-13"
excerpt: "A practical guide to deciding when to refactor, what to rebuild, and how to redesign software without slowing your product or your team."
tags: ["Software Development", "Software Architecture", "Engineering Management", "Productivity", "Software Engineering"]
reading_time: 8
featured_image: /BeforeYouRefactorAnything.png?height=400&width=800
medium_link: https://medium.com/@johnmunn/before-you-refactor-anything-be-sure-youre-solving-the-right-problem-045831004554
devto_link:
substack:
code_languages: []
draft: false
---

Three days before the end of the quarter, a customer success manager pings the engineering channel.

A major customer reports that a promo code no longer applies to their highest‑volume plan. Finance has closed the books. Marketing says nothing changed. Sales needs a fix before a renewal call on Friday.

An engineer opens the pricing module and finds discount logic implemented three different ways, scattered across the checkout flow. Every attempted fix breaks something else. A “quick patch” becomes late nights, emergency releases, and the realization that this part of the system runs more on institutional memory than design.

At the incident review, someone finally says it:

_“We should rewrite this.”_

It feels clean. Obvious.

Six months later, the team is maintaining two pricing systems, product work is bottlenecked behind migration tasks, and no one can say when the old path can be turned off.

This isn’t unusual. Teams often leap to a rewrite before understanding the real problem. Refactoring begins, not with code, but with clarity about what actually needs to change.

Every system drifts if it lives long enough. Features accumulate, assumptions age, and decisions made years ago stop fitting the present. Someone looks at the codebase, sighs, and repeats a familiar line:

“We should rewrite this.”

A rewrite is tempting: clean slate, modern stack, fewer constraints. But it’s not just a technical decision. It’s a strategic one that affects your product contract, delivery rhythm, and organizational risk.

Before committing to a rebuild, you need to know, truly know, that you’re solving the right problem. This approach helps determine when a refactor is essential, what actually needs to change, and how to rebuild without breaking the trust that keeps a product alive.

---

## Start With the Why

### The Cost of Getting This Wrong

Before diving into strategy, it’s worth stating plainly: choosing the wrong kind of refactor (or choosing to refactor at all when you shouldn’t) has a cost.

A rewrite done for the wrong reasons can:

- Stall a roadmap for quarters
- Introduce regressions no customer asked for
- Burn out teams who now have two systems to maintain
- Create political friction between product, engineering, and leadership
- Damage trust when timelines slip or expectations change

A rewrite is not technical debt work. It’s strategic debt work. And strategic mistakes land harder.

That’s why the “why” comes first. Refactoring for the sake of aesthetics is a trap. Messy code is not, on its own, a reason to rewrite an entire offering. The real reasons tend to sit deeper beneath the surface.

I look for a few signals:

### The Product Contract Has Changed

Sometimes the business has evolved beyond what the current architecture can support. New pricing logic, new workflows, new compliance rules these aren’t “patch it up” changes. They require a rethinking of the system itself.

### Velocity Is Collapsing

When simple changes take unreasonable effort, when incidents cluster around the same areas, when analysis takes longer than implementation these are signs of architectural friction, not team performance.

### Customers Can Feel the Cracks

Internal pain doesn’t justify a rewrite. Customer-visible pain does. If stability, correctness, or responsiveness is slipping, and fixes are becoming brittle, that’s a deeper problem.

If none of these are true, the impulse to rewrite usually comes from frustration rather than necessity.

---

## Rediscover the Domain Before You Touch the Code

### Refactor, Replatform, Replace, or Retire?

Before mapping the domain, I ask one meta-question:

Is this truly a refactor, or is it something else?

- Refactor: when the domain stands but the implementation is failing.
- Replatform: when infrastructure or runtime constraints are causing more pain than the code.
- Replace: when the existing system cannot meet the new product contract.
- Retire: when usage data shows a feature isn’t worth migrating.

These four options prevent the classic mistake: calling everything a refactor when the business needs something fundamentally different.

Once the "why" is clear, the next step isn’t technical–it’s conceptual.

Domain-driven design isn’t about jargon. It’s about reclaiming the _actual_ shape of the business so you don’t rebuild things that no longer matter.

I sketch a simple map of the system and ask a few questions:

### Core Domain

The heart of the product the part customers would feel immediately if it broke or disappeared. This is where the rewrite must be the strongest and most deliberate.

### Supporting Subdomains

Important, but not differentiating. These can often be simplified rather than reinvented.

### Generic Subdomains

Billing, authentication, logging. Necessary, but rarely strategic. Rebuild these only if the current implementation is actively limiting you.

Most rewrites fail because everything is treated as sacred.

And nothing derails a rewrite faster than rebuilding something the business no longer needs. A clear domain map helps you invest wisely and avoid rebuilding problems that don’t need to exist anymore.

---

## The politics before the plan

A refactor isn’t only technical. It reshapes incentives, ownership, and expectations. Before deciding how to rebuild, I surface the political landscape:

- Product leaders worry about losing a quarter of feature delivery
- Sales fears explaining migration delays to customers
- Support and analytics teams brace for new behaviors
- Finance wants predictability and clear ROI
- Engineers split between excitement for greenfield work and anxiety about parallel systems

A refactor that ignores these forces will stall, no matter how elegant the architecture. Once these pressures are visible and acknowledged. I can choose a realistic path.

## Big Bang or Strangler Fig? Make the choice deliberately

### Team readiness matters as much as technical readiness

A rewrite happens inside an organization, not just a codebase.

Before choosing any migration strategy, I check:

- Does the team genuinely share the same domain understanding?
- Are incentives aligned with modernization instead of short‑term patching?
- Is critical legacy knowledge documented, not trapped in one person’s memory?
- Will product tolerate staged delivery?
- Will downstream teams adapt to changes in workflows and data?

If these answers aren’t solid, the first step of the refactor is getting the team ready to carry the work successfully.

There are only two real approaches to a major refactor:

### The Big Bang

A full cutover. You finish the new system, flip the switch, and retire the old one.

This path works only when:

- The product contract itself has changed
- The new system’s mental model is fundamentally incompatible with the old one
- The organization can absorb a period of uncertainty and risk

Put simply: you choose Big Bang when incrementalism is more dangerous than replacement.

### The Strangler Fig

Grow the new system gradually around the old. Migrate capabilities one by one. Let real usage validate each step.

This path works when the product contract is stable, but the implementation is failing. It preserves trust because customers don’t experience breakage they experience improvement.

Most of the time, this is the right answer.

---

## Find the Most Fragile Piece First

### You Can’t Refactor What You Can’t See

Observability is the prerequisite for safe migration.

Before touching a module, I ensure we have:

- Baseline SLOs (what “good” looks like today)
- Error budget tracking (how much change we can absorb)
- Parity dashboards comparing old vs. new behavior
- Request/response diffing for shadow traffic
- Logging that captures domain events, not just technical noise

These make migrations scientific instead of emotional.

Not the ugliest code. Not the oldest code. The _most fragile_ code the part of the system that breaks momentum.

You’ll know it by:

- Repeated incidents
- High change failure rates
- A long history of “don’t touch that” warnings
- Only one person who truly understands it
- A web of dependencies pointing inward 

Start here. Not because it’s fun, but because stabilizing this piece reduces risk across the entire refactor. Once this anchor point is secure, everything else moves faster.

---

## Decide What to Keep, What to Migrate, and What to Let Die

You should never rebuild a system one-to-one. A refactor is not a museum, it's an edit.

Before committing anything to the new architecture, I run a simple test:

Do we still need this at all?

Legacy systems accumulate:

- Unused endpoints
- Obsolete admin tools
- Dead feature flags
- Reports no one reads
- Integrations that survived only out of inertia

Usage telemetry, support tickets, and revenue analytics reveal the truth. If a feature exists only because “it’s always been there,” it doesn’t belong in the new system.

Pruning is one of the highest ROI parts of a refactor. It reduces scope, simplifies architecture, and brings focus back to what the product is actually for.

---

## Build the Bridge Before You Burn the Road

With the domain understood, fragile parts identified, and dead weight removed, the technical plan finally becomes clear.

Good refactors aren’t heroic. They’re reversible.

I design:

- Proxy layers that let new components stand in front of old ones
- Shadow traffic paths to validate new behaviors
- Staged migrations that cut complexity into safe increments
- Rollback plans that we’ve actually practiced

This step is about making deliberate moves moves. A stable migration earns trust, inside and outside the team.

---

## What Happens After the Migration (the Part No One Mentions)

The day you flip traffic to the new system isn’t the end, it’s the midpoint.

The long tail of a refactor includes:

- Deleting legacy code _quickly_ to avoid fallback temptation
- Removing toggles so the system doesn’t accumulate new dead weight
- Updating documentation and onboarding paths
- Re-teaching the team the new mental model
- Revisiting the domain map 3–6 months later as reality evolves

Successful refactors end with clarity, not just cleanliness.

---

## What a Successful Refactor Really Achieves

A good rewrite doesn’t just deliver cleaner code. It delivers:

- A domain that reflects the current business, not a past one
- Boundaries that make work flow instead of collide
- Faster learning loops
- A system that new engineers can understand without archaeology
- A level of reliability that customers can feel

Most importantly, it restores credibility.

Credibility that the system behaves as advertised. Credibility that the team can evolve without fear. Credibility that future changes won’t become future crises.

---

## The Heart of It

A refactor done well isn’t an indulgence. It’s stewardship.

You aren’t just rewriting code, you’re renegotiating your product’s relationship with its users and your team’s relationship with the system they care for every day.

If you start with clarity, why now, what actually matters, where the domain begins and ends–the technical plan almost writes itself.

The hard part is understanding what you’re rebuilding for. And once you know that, the rest becomes manageable.