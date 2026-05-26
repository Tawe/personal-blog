---
title: "Documents as Code"
subtitle: "When Product Specs Stop Guiding Code and Start Generating It"
date: "2026-05-21"
excerpt: "AI coding tools are exposing the messy reality behind Jira tickets, stale docs, Slack decisions, and drifting product specs."
tags: ["Artificial Intelligence", "Software Engineering", "AI Engineering", "Product Management", "Documentation"]
reading_time: 7
featured_image: /documents-as-code.png?height=630&width=1200
medium_link: https://medium.com/@johnmunn/documents-as-code-c216d0cb4b6a
substack_link: https://johnmunntech.substack.com/p/documents-as-code
code_languages: []
draft: false
---

A couple months ago I was chatting with a friend whose company had started dipping their toes into AI-assisted development. They were trying their own version of spec-driven development, but they had run into a problem. Product and commercial teams were still working out of Confluence, Jira, Slack, Figma, and whatever other odds and ends had piled up over the years while the engineering work lived in Git repos.

Before AI, that setup mostly worked because developers knew where to look for the requirements and specs they needed to complete the work. They also knew which Jira tickets were old, which Confluence pages were out of date, and which Slack thread had the final decision on the important project questions.

The problems started because the AI agents they were using needed context. Since the tooling didn't have access to Confluence or Jira, the team created a product spec document directly inside the repo to give the agents that project context. The goal was to let developers pull it locally and keep implementation consistent across individuals.

But this workaround caused unforeseen issues. An engineer pulls a ticket and uses a Cursor agent to code the work in the ticket, using that repo spec as a project guideline. Meanwhile, the PM changes a requirement in Confluence and sends a message in the project Slack channel about it. The developer might see the message and update the ticket, but the codebase spec now has to be edited just to keep the agent's context up to date.

This all came to a head when a developer implementing an unrelated bit of work unknowingly had an agent re-implement a feature that had been removed a day before. The feature made it live before the PM noticed it.

A big meeting was held to figure out how this could have happened, and that is when the problem surfaced. The team had two sources of truth which had become desynced.

For most of software history, product and engineering were separated. And the places that held our work reflected that.

Back in waterfall days, none of this really mattered because the teams barely interacted anyway. Specs got written, handed to engineering, and eventually turned into software.

Agile changed the people side of it. Product sat closer to engineering. Designers got embedded into teams and everybody talked more.

But the artifacts themselves never really merged.

Instead, developers acted as human bridges carrying context between mismatched systems. We used to consult the Confluence documents manually and turn them into tickets. Backlog grooming meetings were used to update those tickets to reflect the changes in product documents. We relied on those rituals and meetings to mitigate the distance between where the documents lived and where the work actually got done. All of that worked fine as long as a person was doing the actual mental work to make sure the specs and the code stayed aligned.

AI tooling completely changes what a document does inside our development workflows. Specs and architecture notes were always meant to guide the work, but they used to rely on humans to interpret them, spot any gaps, and apply common sense. Now, those files are steering automated code generation. A wrong document can quietly break a feature because the agent doesn't stop to ask questions a human would. The moment your docs start driving production code without a human buffer, they inherit the exact same engineering responsibility as the codebase itself. That's the real weight behind "documents as code."

The way we solve the two sources of truth problem isn't to force PMs to write Markdown documents or pretend Git can solve organizational design issues. It's about accepting that if an artifact is going to feed an AI tool directly, it has to be treated like code. It needs to be versioned, it needs to be tracked, and it can't just live in a siloed wiki that someone updates whenever they remember to.

An LLM has no concept of a document's lifecycle. When requirements inevitably pivot mid-sprint, those updates are captured in places like Confluence, Slack, or Jira. A human engineer knows that a pivot happened, so they mentally override the text in front of them because they know it just hasn't been updated yet. But an agent won't realize that a pivot happened and its spec doc isn't up to date. It treats the lagging Markdown file as the sole source of truth, blindly writing code for features the team decided to cut twenty-four hours ago.

This isn't a debate about whether docs should live in Git. This is about when the way we work changes and the documents we use to complete the work need to be in two places at once.

## Authority

When you shift to spec-driven development with AI, you are forced to confront a question most companies have safely ignored for years.

Where does the final authority over your system behavior actually live?

In a traditional workflow, authority is fluid and human. The same feature might exist in a dozen mismatched places at once, like the PRD, the Jira ticket, a Figma mock, and a Slack thread. Humans navigate this mess using social consensus. If a spec doc in the repo contradicts a recent Slack thread, a developer applies common sense, asks a teammate, and just ignores the outdated document.

But when you feed that document into an AI agent, that fluid human authority disappears. The model doesn't understand social consensus, and it doesn't know that a Slack conversation overrides a piece of the spec doc in the repo. It just treats whatever text it can see as the source of truth.

By turning documents into the direct fuel for automated code generation, we lose the human buffer that can reason over the current state of what we are trying to build. Without that buffer, you can no longer afford ambiguity. You have to decide which document is actually allowed to define what we are building.

## Multimodal Context

And all this gets stranger once you move beyond text documents.

A lot of product decisions don't live in documents. They live in Figma files, screenshots, walkthrough videos, architecture diagrams, and all the other visual junk companies accumulate over time. Those systems were built assuming humans would consume the output, but now AI systems are consuming them.

A Figma file might contain approved designs sitting beside abandoned ideas, hidden layers, half-finished experiments, and flows nobody ever cleaned up. In a traditional workflow, a designer just says, "ignore that frame, that's old," and the problem goes away. The model can't do that unless the system around it makes those states explicit.

That's why context management is going to matter more than people realize. Right now, the entire industry is focusing on comparing LLM benchmarks and choosing models. But the model isn't the true bottleneck. The bottleneck is that we are feeding incredibly smart models an uncurated archive of old specs, forgotten tickets, and dead diagrams, and then wondering why the agent built the wrong thing.

The hardest part of AI-driven development isn't the AI. It's managing the context we give the AI.

## Early Signs

You can already see parts of this change showing up across the industry. OpenAPI specs generate clients and tests automatically. Terraform turned static infrastructure definitions into live, executable systems years ago. Design tools are starting to expose highly structured, component-driven context directly to agents.

Artifacts that used to merely describe software are starting to influence systems directly. The boundary between documentation and code is completely dissolving.

## Organizational Compression

This structural shift is inevitably going to change the shape of engineering organizations.

As code generation becomes a commodity, understanding the precise business context around the software becomes the real differentiator. Engineers are being pulled closer to product decisions because the implementation is getting easier to generate. Product teams are being pulled closer to engineering constraints because their docs, diagrams, and workflows are now affecting production code more directly.

For years, there was a clean separation between the people deciding what the product should do and the people actually implementing it. That separation becomes impossible to maintain once your implementation tooling reads directly from your planning systems.

## What Happens Next

Nobody fully knows where this all ends. The repository spec problem teams are running into right now feels like a minor logistical problem, but it won't stay small for long.

The moment you build a workflow where implementation tooling reads directly from organizational artifacts, your technical debt becomes operational debt. A requirement changes but the repository spec doesn't. A deprecated flow stays inside your retrieval pipeline. An old diagram gets treated like live architecture. An AI agent blindly implements a ticket the product team junked two weeks ago.

Humans have spent decades compensating for these internal communication gaps. The tooling cannot. Most companies were never designed for a world where organizational context shapes software execution without a human buffer filtering out the noise.
