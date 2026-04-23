---
title: "AI Systems Don't Just Leak Data. They Leak How Your Company Thinks."
subtitle: "The bigger AI risk isn’t the prompt. It’s the memory, retrieval, logs, and tool context that quietly exposes how your business makes decisions."
date: "2026-04-13"
excerpt: "The bigger AI risk isn’t the prompt. It’s the memory, retrieval, logs, and tool context that quietly exposes how your business makes decisions."
tags:
  - Security
  - Artificial Intelligence
  - Architecture
  - Software Engineering
  - Systems Thinking
  - Engineering Leadership
reading_time: 8
featured_image: /aisystemsdontjustleakdata.png?height=400&width=800
medium_link: https://medium.com/p/967ab55a628e
devto_link: 
substack: https://johnmunntech.substack.com/p/ai-systems-dont-just-leak-data-they
code_languages: []
draft: false
---

Last month a developer shared a Cursor prompt into our Slack asking for help with a bug. At first glance it looked like a normal ask, but as I read through the prompt, I could see real client data buried in the middle, looked like it was pulled straight from a Jira ticket or a PRD.

It wasn't the mistake that got me. It was how nobody seemed to notice the data. I don't think anyone was being careless. Someone was trying to move fast and reached for what they thought was the best tool, and that's what makes it hard to catch. Leaks don't happen like the movies. There is no dramatic breach. They happen when people are not thinking or under pressure to get things out quickly.

---

## The Real Assets at Risk

Most teams still think about sensitive data using old ways. Credentials, source code, PII, contracts and financials. Those all still matter, but they are no longer the full story.

AI systems have introduced a different kind of exposure, and most organizations still have not really recognized it.

The biggest risk is not only the data inside the prompt. It is the judgment backed into it, the escalation path hidden in a few-shot example. The pricing exception embedded in a support transcript. The refund rule someone dropped into a system prompt because it was faster than building the actual lookup.

None of that outright seems like a breach. But over time they add up and start to form a map of how your company thinks and makes decisions.

---

## What Leaks Look Like in 2026

It used to be that most AI use inside teams was simple. Someone asked a question, got an answer, and then moved on with their task.

The AI systems teams are building now pull in documents, carry memory across sessions, invoke tools, and generate logs that capture reasoning most teams never meant to keep.

The prompt is no longer the main domain of sensitive reasoning. It's spread across retrieval, memory, actions, and logs.

Earlier this year, Meta disclosed an internal incident where an AI agent suggested an engineering action that temporarily exposed sensitive company and user data to employees. The visible request looked like normal troubleshooting. The real failure was in the broader context and action path around the agent, not the text of the original ask.

By the time someone checks the prompt, the retrieval layer has already pulled in pricing policy, memory has been carrying the churn-risk playbook for weeks, and a trace file somewhere has the rest.

Telling people not to paste secrets into ChatGPT addresses one behaviour inside a much larger architecture.

---

## Where Teams Leak Strategy Now

Leaks rarely announce themselves.

It usually starts with a normal workflow behaviour. Someone pastes a Jira ticket or an incident post-mortem into a ChatGPT or Claude because it is the fastest path to an answer. Meanwhile the system is pulling in SOPs, launch docs, support guidance, and policy pages the person never asked for and probably doesn't know are there.

Over time the system picks up things nobody meant to keep. The VIP exception that started as a one-off. The approval workaround that stuck because someone made a judgment call and it worked. Eval datasets do the same thing more slowly, building up edge cases and decision rules nobody treated as sensitive. By the time a team realizes what their debug traces contain, those traces have become the most complete record of how the business actually operates, and nobody meant to write any of it.

Even when teams redact prompt text, the metadata gives it away. A tool named `IssueRefundWithoutManagerApproval` reveals internal logic before you ever inspect the payload. The same thing happens through normal collaboration. A prompt gets posted in Slack, a transcript ends up in a shared doc, an output gets pasted into a ticket, and nobody thought twice about any of it. At that point the leak path is no longer only technical. It is embedded in how teams actually work.

---

## The Question Most Teams Are Still Asking Wrong

A lot of teams still ask "Did we leak secret data?"

I do not think that is the right question anymore.

What matters is whether someone outside the company can start to reverse-engineer how decisions get made. Once a competitor can spot the patterns behind those decisions, they can start designing around the system instead of using it the way you intended.

That is the real exposure, and in a lot of cases it is worth more than the data itself.

---

## Prompt Security Became System Security

Prompt security has outgrown prompt engineering and has become a system design problem.

If your assistant can pull from internal docs and trigger actions in your CRM, the security review cannot stop at "is the prompt safe?"

The real design question is: What combination of what the system knows, remembers, and can do might expose internal decision logic even if nobody intended it?

The mistake is treating this like a prompt problem when it is really a cross-functional systems problem.

---

## How to Classify What You're Handling

Not all prompts carry the same risk. Here is a rough classification:

- **Public** is generic work: summarize this, rewrite that, explain a concept. Safe to log, safe to reuse, and generally safe to share.
- **Internal** is where teams start leaking judgment. Brand tone, fallback logic, escalation paths, reasoning scaffolds, the things that reflect how your company actually operates. These should be versioned, reviewed, and access-controlled the same way you would treat policy logic in code.
- **Restricted** is anything that exposes client data, legal interpretation, pricing rationale, or internal strategy. This is the layer that should be redacted, isolated, and never preserved in full traces or long-term memory.

If it would raise eyebrows in a job interview, it should not be in a raw prompt.

---

## What Strong Teams Do Differently

The best teams have stopped focusing only on what people type into an LLM and have started caring more about what the AI systems they use can access. Not every internal document should be retrievable by default. Strategy memos, pricing rationale, investigation notes, legal interpretation, these need explicit access controls, not accidental availability because someone wired up a RAG pipeline in a sprint.

Memory is the other thing most teams get wrong. The instinct is to make everything persistent so the system gets smarter over time. But if everything persists, sensitive judgment does too. Memory should have limits and an expiry. The same logic applies to observability: log enough to debug, but raw transcripts of every prompt, retrieval chunk, and tool argument sitting in a pipeline nobody governs is a problem waiting to happen. Prompt files and agent instructions need owners and a real change process. A prompt that changes how customers get treated is not just content.

Yes, this adds overhead. It does, a little, the same way code review did before it became invisible. The teams that skipped it did not move faster. They moved problems further down the line.

---

## A Better Review Framework

Most teams focus entirely on what the user typed. The more interesting questions are what the system retrieved, what it remembered, what it logged, and what it could do with all of that.

Most teams have a good answer to the first question. The strategic leak usually lives in the others.

---

## What I Would Change This Quarter

If I were updating an AI rollout today, I would spend less time on prompt tips and more time putting a lightweight governance layer around context.

Start by pulling up your Cursor prompt history and actually reading it. Most people find something they would not want shared. That's your baseline. From there, the inventory writes itself: prompts, retrieval, memory, logs.

Once you know what you're working with, figure out where the sensitive stuff is living: policy logic, customer context, anything that reveals how decisions actually get made. From there, move durable business rules out of the prompt and into systems that can actually be audited. Decide what gets redacted and what gets deleted in traces and eval examples. Give the AI context layer a clear owner rather than leaving it distributed across whoever happened to ship each part.

None of this requires slowing AI work down. AI context is part of the production surface now. Treating it that way is the whole point.

---

## The New Mental Model

Prompts used to be one-way. The flow was you asked, it answered, and that was all.

Most people treat prompts like they're disposable. But they carry your organization's logic, tone, and judgment. What leaks through AI isn't usually the obvious stuff. It's the exceptions. The workarounds. The informal logic your business actually runs on.

---

## Final Thought

Do not treat prompts casually, and do not stop there.

The retrieval layer, the memory store, the trace log. They are all telling the same story.

Internal data used to be what we stored. Now it's what we say, especially when we say it to a model.
