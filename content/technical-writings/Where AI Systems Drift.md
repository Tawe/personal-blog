---
title: "Where AI Systems Drift"
subtitle: "and What to Fix First"
date: "2026-03-16"
excerpt: "A companion guide to the interactive systems drift page, focused on which controls belong at which layer, when to use them, and what problem each one actually solves."
tags: ["Artificial Intelligence", "AI Engineering", "LLM", "Software Architecture", "Prompt Engineering", "Retrieval Augmented Generation"]
reading_time: 9
featured_image: /WhereAISystemsDrift.webp?height=400&width=800
medium_link: ""
devto_link: ""
substack:
code_languages: []
draft: false
---

Most AI systems do not fail in one dramatic moment.

They slip.

A user asks one thing. The application interprets it slightly differently. The prompt leaves room for ambiguity. Retrieval returns something related but not quite right. The model produces a confident answer. Output checks are weak. The problem surfaces only after users notice.

Then someone says:

> “We should fix the prompt.”

Sometimes that helps. Often it does not.

The prompt is only one layer of the system. Failures can enter through routing, retrieval, model behaviour, or evaluation. Patching the prompt will not fix problems that start elsewhere.

Drift is rarely a model problem. It is usually a systems problem.

The moment you start thinking about failures this way, another question shows up:

**Where should the controls actually live?**

If you want to explore how those failures compound across the stack, the interactive version is here:

[Open the interactive systems drift guide →](https://johnmunn.tech/interactive/where-ai-systems-drift)

---

#### Identify the failure first

Picture a support assistant. An engineer asks:

> What changed in the payment gateway after last week’s migration?

The system returns a confident answer about the previous gateway configuration. It sounds right. It is wrong. The evidence was stale, the query was ambiguous, and nothing caught either problem before the answer reached the user.

This scenario shows up constantly in production systems. And it almost never has a single cause.

What looks like hallucination might be retrieval failure. What looks like retrieval failure might be poor task classification. Sometimes the model has not changed at all. The context did.

The same wrong answer can enter from several directions. Fixing the wrong layer leaves the others untouched.

Before choosing a fix, place the failure.

- **Wrong problem being solved** → check routing and task framing
- **Right problem, wrong evidence** → check retrieval
- **Right evidence, unstable behaviour** → check prompts and decoding
- **Correct format, wrong truth** → check validation and evaluation

Most teams start with the model because it is the most visible part of the stack. The largest gains usually come from working earlier and later. Routing upstream. Validation downstream.

The rest of this article walks through each layer using that payment query as the running example.

---

#### Data integrity

Start here when the underlying data has changed.

Before routing, before retrieval, before prompts, there is data. And data changes. Schemas evolve. Source tables get renamed. A field that previously stored a transaction status now stores a transaction type.

The pipeline does not know. The retrieval layer does not know. The model certainly does not know.

In the payment example this is the failure that hides everything else. The migration changed how events were logged. The changelog still exists, but the schema it describes no longer matches the schema being queried. Retrieval returns documents that are technically valid and operationally obsolete.

This is different from retrieval quality. Re-ranking and query rewriting cannot fix documents built on a broken foundation.

### Schema and source monitoring

When source systems change such as database schemas, API contracts, or event structures, downstream AI pipelines need to know. Treat schema changes the same way you treat dependency upgrades. Version them. Alert on them. Assign ownership.

### Data freshness checks

Stale data and incorrect data are different problems, but they produce the same symptom. Build freshness checks into the pipeline. If the newest document in the retrieval index is three weeks old and the question is about last week, that gap should surface before generation begins.

### Provenance tracking

Track where retrieved content came from and when it was written. Documentation created before a major infrastructure change should not silently support answers about the system after the change.

**Rule of thumb:** if the data feeding the system is wrong, every layer above it inherits the problem.

---

#### User intent and application controls

Start here when the system attempts the wrong task.

The payment query runs into trouble immediately. “What changed after the migration” is actually several questions. Root cause analysis. Changelog lookup. Impact assessment.

Without decomposition the system picks one interpretation and commits. The engineer wanted all three.

### Task decomposition

When a request spans multiple decisions or steps such as migration analysis, research workflows, or multi step assistants, break it into stages. Each stage receives a clear objective.

Ambiguity stops compounding.

### Intent classification

When one interface handles multiple task types, classify before generating.

Examples:

- support assistants
- knowledge copilots
- workflow tools

Without routing the model treats every question the same way.

Adding classification has a cost. It introduces an extra model call at the front of the pipeline. For high volume systems that latency matters. The typical solution is a smaller fast model for classification and a stronger one for generation.

### Structured inputs

Missing context changes results. The payment query contains no timeframe, no system scope, and no definition of “changed”.

Collect those fields explicitly rather than letting the model infer them from prose.

### Policy enforcement and fallbacks

Some decisions should not live in prompts.

Examples:

- refunds
- approvals
- regulated processes
- escalation flows

Models can assist with decisions. Boundaries belong in application logic.

**Rule of thumb:** if the system should not have attempted the task at all, start here.

---

#### Prompt controls

Use prompt changes when the task is correct but behaviour varies.

Suppose the system correctly identifies the payment query as a changelog lookup. It still needs to know what a good answer looks like. How much technical detail. What format. Whether missing evidence should be flagged or ignored.

Those are prompt questions.

Prompts accumulate over time. Exceptions get added. Old examples remain. Rules begin contradicting each other. Teams often blame the model when the prompt has become unstable.

### System prompts

Use system prompts for stable instructions such as:

- tone
- evidence requirements
- refusal behavior
- escalation paths

Avoid filling the prompt with every edge case. A prompt that tries to handle everything usually handles nothing reliably.

### Few shot examples

Examples help when the expected output is subtle.

Common uses:

- specific summary formats
- domain reasoning patterns
- nuanced classification

Examples show the behaviour instead of describing it.

### Output schemas

When responses feed other systems, structure matters as much as content.

If the changelog answer needs to trigger a downstream ticket, a schema keeps the structure consistent even when the details change.

### Prompt cleanup

Older systems carry years of accumulated prompt changes.

Typical problems include:

- repeated instructions
- outdated examples
- conflicting rules

Removing unnecessary instructions often improves stability more than adding new ones.

**Rule of thumb:** if the task is correct but behaviour shifts unpredictably, inspect the prompt layer.

---

#### Retrieval controls

Use retrieval changes when answers rely on the wrong evidence.

In the payment scenario the query enters retrieval as something like “payment gateway migration changes”. Vector search returns conceptually related documents, but the top results describe the previous architecture rather than the migration.

The ranking looks reasonable. The evidence is stale. Nothing in the pipeline signals a problem. The model generates an answer from the wrong documents because it has no way to know they are wrong.

### Query rewriting

Engineers ask questions conversationally. Documentation rarely uses the same phrasing.

Rewriting the query to match how documents are written can change the retrieved material completely.

Example rewrite:
```
gateway migration changelog week_of:<date>
```
### Hybrid search

Vector search finds conceptual matches. Keyword search finds exact identifiers.

Queries involving product names, error codes, version numbers, or migration identifiers need both.

### Re-ranking

Retrieval sometimes surfaces the right documents in the wrong order.

Re-ranking improves which material actually enters the prompt. This becomes important in large documentation sets where older related material can dominate the ranking.

### Chunking and context management

A passage may reference the migration while omitting the surrounding explanation needed to answer the question accurately.

Chunking that splits explanations mid context produces answers that appear grounded but are missing the detail that makes them correct.

**Rule of thumb:** if answers reference the wrong source material, review retrieval first.

---

#### Model and decoding controls

Use these when the task and context are correct but generation still drifts.

In the payment scenario the query is correctly classified and retrieval returns the correct documents. The engineer asked a precise factual question. What changed in the system during a specific window.

That task does not benefit from variation.

### Temperature and top-p

Lower temperature works best for constrained tasks:

- factual lookups
- extraction
- policy answers
- code generation

Higher temperature is useful for exploration or brainstorming.

These settings control variation and risk.

### Model selection

Different workloads require different models.

Consider:

- latency
- reasoning ability
- cost
- reliability

A smaller model can handle classification cheaply while a stronger one handles synthesis. Splitting workloads often improves performance and cost.

### Tool use

When exact results exist in structured systems, query them directly.

If the migration produced a structured changelog in a database, generation is the wrong instrument. The system should query the source of truth.

**Rule of thumb:** adjust this layer only after reviewing earlier layers.

---

#### Output and evaluation controls

These controls detect problems and measure performance over time.

In the payment example the system produces a plausible answer about the previous gateway. Without output controls that answer ships to the user. The engineer trusts it and spends hours investigating the wrong system.

No bug report is filed against the AI. Confidence simply drops.

### Schema validation

When responses feed other systems validate the structure first.

Structural errors can propagate through tickets, dashboards, and automation pipelines.

### Second pass review

A second model pass can detect problems deterministic checks miss.

Examples:

- weak grounding
- thin evidence
- outdated sources

The cost is latency. Response time increases. For high trust queries that tradeoff is usually worth it. For high volume systems sampling strategies often work better.

### Regression tests and drift detection

Systems evolve constantly.

- prompts change
- retrieval indices update
- models are replaced

Without regression tests those changes are invisible until users lose confidence. Tests make behavior comparable across time.

**Rule of thumb:** if users discover failures before the team does, evaluation is missing.

---

#### The real lesson

Return to the payment query.

An engineer asks what changed in the gateway after last week’s migration. The source schema shifted during the migration and the pipeline was never updated. The system misclassifies the task, retrieves documents based on the old schema, generates an answer from outdated evidence, adds variation where none belongs, and passes the result through unchecked.

The failure spans multiple layers.

Fixing the prompt would not have caught it.

That is why the layered view matters. It separates different kinds of failure so they can be placed before they are fixed.

> “Fix the prompt” is not a strategy.  
> “Tune retrieval” is not a strategy.  
> “Add tests” is not a strategy.

A strategy places the right control in the right layer.

Early systems depend on clever prompts.

Reliable systems depend on architecture.

---

Explore the layered model visually in the interactive guide:

[Visit the interactive guide!](https://johnmunn.tech/interactive/where-ai-systems-drift)
