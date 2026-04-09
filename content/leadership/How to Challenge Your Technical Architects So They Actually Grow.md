---
title: "How to Challenge Your Technical Architects So They Actually Grow"
subtitle: "Why great architecture leaders stop teaching patterns and start expanding the tradeoffs"
date: 2026-04-07
excerpt: "Strong architects rarely need more technical depth. They grow fastest when leaders widen the frame to include tradeoffs, ownership, business pressure, and reversibility."
tags:
  - Leadership
  - Technical Leadership
  - Architecture
  - Engineering Management
  - Organizational Design
featured_image: /howtochallengeyourtechnical.png?height=400&width=800
reading_time: 8
medium_link: https://medium.com/@johnmunn/how-to-challenge-your-technical-architects-so-they-actually-grow-7b14dc075b78
devto_link:
substack:
draft: false
---

I worked with an architect once who was at their best in classic layered systems.

The whole thing had a reassuring shape to it.

You had your controllers where they belonged, services sitting cleanly beneath them, and the data layer tucked exactly where anyone on the team would look first. Requests moved cleanly from one layer to the next, and when something went sideways, you could usually follow the thread back to the source without much drama.

Then the company started to outgrow that shape.

The issue was no longer whether the design was technically sound. It was that too much of our delivery speed depended on everyone moving through the same synchronous chain. Teams were waiting on each other. Releases were tied together. One delayed response in the wrong place could slow work far beyond the system itself.

The move toward event-driven architecture was the right one.

Technically, the architect understood the pattern quickly.

Topics, consumers, retries, dead-letter queues, eventual consistency. None of that was the real challenge.

The hard part was helping them get comfortable in a world where cause and effect no longer lived in the same moment.

A customer action would fire in one place, the state would settle somewhere else, and a downstream workflow might not wake up until much later. A team they did not manage owning the consequence.

That was the growth moment. It was not about learning events. It was about learning what asynchronous systems do to ownership, failure, team boundaries, and business patience.

That is when it really clicked for me: for engineering leaders and org owners responsible for architecture capability, the fastest way to accidentally stall a strong architect is to keep challenging them only on technical depth.

Most senior architects are already good at system design. They can map service boundaries, reason through scale, and spot infrastructure risks before the rest of the room even realizes there is a problem.

That usually is not where their next level lives.

The real growth edge is what happens **around** the architecture.

The growth edge is in the tradeoffs they make, the business language they can speak, the ownership model they create, and how honestly they can reason about the cost of being wrong.

That is where strong architects become organizational force multipliers.

And this is where I think engineering leaders have a responsibility that often gets missed.

Most of the time, your architects are going to know more than you in the technical domain they live in, and that usually is not the problem you are there to solve.

The value you bring as the engineering leader is not superior technical depth. It is broader context.

You can see the business pressure they may not fully feel yet. You can connect org design to technical consequences. You can expose the hidden cost of ownership friction, delayed decisions, funding realities, and cross-team dependency risk.

Your role is not to out-architect them.

It is to help widen the system they are optimizing for.

Architects do not usually outgrow their blind spots on their own.

The same strengths that made them exceptional in one phase of their career can quietly become the thing that caps them in the next.

If all we do is reward them for being technically right, they will keep optimizing for technical rightness.

It is our job to help them expand the frame.

To expose them to business tension. To force conversations about ownership. To let them feel the consequences of org design, failure modes, and reversibility. To move them from designing systems to shaping how the company learns.

That growth rarely happens by accident.

It happens because someone in leadership deliberately creates the pressure, safety, and context for it.

I have found that the best way to help architects grow is to stop asking them how they would build something and start asking them what the system does to the people, the business, and the company's ability to adapt.

## Push them past the clean design

A lot of architects naturally drift toward the cleanest design.

It all looks good on paper, clean boundaries, smart abstractions, interfaces that seem ready for whatever might come next.

That is useful, but it is also incomplete.

The real question is rarely whether something is technically elegant. It is whether it is the **right tradeoff for the moment the business is in**.

That is where I like to apply pressure.

Instead of asking whether the design is good, I ask:

- Why is this the right tradeoff right now?
- What becomes harder six months from now because of this choice?
- What happens if this bet is wrong?
- How reversible is this decision?
- What is the smallest version of this that proves the idea?

Those questions force architects out of purity and into judgment.

That is where maturity shows up.

## Make them translate architecture into business risk and leverage

A lot of architects can explain systems beautifully to engineers.

Far fewer can explain them clearly to executives.

That gap matters.

A technical decision that cannot be translated into business language usually struggles to get the support, funding, or organizational patience it needs.

So one of the most useful growth exercises is simple:

> _Explain this architecture decision to the CFO in 90 seconds._

No infrastructure jargon. No Kubernetes detours. No long explanations about event buses.

Just:

- what risk this reduces
- what speed this creates
- what cost this avoids
- what customer pain this removes
- what optionality this preserves

Once architects learn to do that, they stop being system designers and start becoming strategic operators.

The deeper version of this is anchoring architecture to the company vision.

One of the easiest ways for a strong architect to drift into over-engineering is to let the system become the mission.

The architecture starts optimizing for theoretical future scale, perfect extensibility, or edge cases the business may never actually face.

That is where engineering leadership has to reconnect the work to the company vision.

- What are we actually trying to become?
- What does this product need to do in the next 12 to 18 months?
- What customer or market move are we betting on?
- What kind of speed does the business need from the teams building it?

Those questions matter because the right architecture for a company trying to find product-market fit is very different from the right architecture for a company protecting scale, compliance, and operational resilience.

Sometimes the best growth conversation with an architect is not about a pattern at all.

It is about helping them see the vision of the work.

The system only needs to be sophisticated enough to serve the mission in front of us.

Anything beyond that can quietly become technical vanity.

Part of helping architects grow is teaching them to ask a harder question than, _Can we build this?_

The better question is, _Does this level of architecture serve the company we are trying to become, or the one we are imagining in our heads?_

A simple question I like to leave architects with in a 1:1 is:

> _If the company vision is still true a year from now, what part of this design will feel obviously overbuilt?_

The most effective way to help an architect get there is rarely by giving them the answer.

Usually the better move is to ask the question that widens the frame. If the company vision is to become the fastest product in the category, how do we make sure this design does not quietly slow delivery six months from now? And if the vision is trust and reliability, where might this introduce failure modes that chip away at that?

The aim is not to steer them toward your answer.

It is to help them see the full system they are making decisions inside.

## Use disagreement as a growth tool

Those questions do not always create instant alignment.

Sometimes the architect will still believe the technically stronger path is the right one.

That is not a problem to avoid.

Some of the best growth moments happen when both sides stay in the disagreement long enough to understand what each person is optimizing for.

- Are they protecting long-term system integrity?
- Are you protecting company timing, capital efficiency, or market pressure?
- Are they seeing operational risks that have not surfaced yet?
- Are you seeing a business horizon the system does not need to solve for yet?

The productive move is not winning the argument.

It is surfacing the assumptions underneath it.

Once those assumptions are visible, the disagreement usually becomes far more productive.

It stops being leader versus architect.

It becomes two people trying to better understand the system the company is actually inside.

The next part of that growth is helping them see what the architecture does to the people carrying it.

The best architects eventually realize they are not designing software systems.

They are designing **human systems that happen to run on software**.

Every architecture choice creates consequences for:

- team boundaries
- ownership friction
- incident response
- onboarding speed
- release confidence
- dependency politics

That means the conversation has to move beyond services and data flow.

I like to ask:

- Which team should own this?
- Where does this create dependency bottlenecks?
- Who becomes the human pager because of this decision?
- Does this mirror our org in a healthy way?
- Where will our team shape quietly make this harder than it needs to be?

Sometimes the cleanest technical answer creates the messiest ownership model.

That is not good architecture.

A strong architect learns to optimize for **clarity of ownership and confidence of execution**, not just system performance.

A related part of that same conversation is helping them recognize when good architectural instincts drift into unnecessary centralization.

Senior architects often start to centralize intelligence. It is a natural instinct: shared gateways, central pipelines, smart platform layers, reusable abstractions, global policy engines.

These are all useful until they quietly become the place where flexibility goes to die.

One of the most valuable questions you can ask an architect is:

> _Should this logic live in the middle at all?_

Sometimes the right growth move is forcing them to defend why something belongs in shared infrastructure instead of at the edge where the business context actually exists.

This is where you start sharpening architectural judgment instead of architectural cleverness.

The place I have seen this come together most clearly is when you give them a messy problem with no obvious technical answer.

The fastest way to grow an architect is to stop giving them architecture-shaped work and start giving them ambiguity.

Something like:

> _Delivery is slowing down, incident coordination is messy, and roadmap confidence is dropping. Figure out whether this is architecture, tooling, process, or team design._

Now they have to reason across the full operating reality of the org.

Not just APIs, queues, or deployment workflows.

They have to understand:

- communication paths
- escalation friction
- ownership gaps
- platform DX
- release psychology
- political constraints

That is where future principal engineers, directors, and CTOs begin to separate themselves.

## The destination this all points toward

The biggest shift I have seen in great architects is this:

Early in their growth, they want to be right. Later, they want the **organization to stay adaptable even when they are wrong**.

That is a very different mindset. They start caring more about reversibility than certainty, optimize for learning speed, reduce blast radius, and create space for teams to move safely.

That is the level I try to coach toward.

Because the best architects are not the ones who create the most impressive systems.

They are the ones who help the company learn faster, recover faster, and change direction without tearing itself apart.

That is where architecture becomes leadership.
