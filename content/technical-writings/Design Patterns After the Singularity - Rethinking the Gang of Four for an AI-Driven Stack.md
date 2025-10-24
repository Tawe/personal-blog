---
title: "Design Patterns After the Singularity - Rethinking the Gang of Four for an AI-Driven Stack"
date: "2025-06-27"
excerpt: "Classic design patterns meet AI-native development. What happens when your code is written by prompts, agents, and context windows instead of humans?"
tags: ["Design Patterns", "Software Engineering", "AI", "AI Patterns", "Development"]
reading_time: 8
featured_image: /DesignPatternsAftertheSingularity.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/design-patterns-after-the-singularity-rethinking-the-gang-of-four-for-an-ai-driven-stack-0106d9437c1f
devto_link: https://dev.to/tawe/design-patterns-after-the-singularity-rethinking-the-gang-of-four-for-an-ai-driven-stack-462e
substack:
code_languages: []
draft: false
---

## The Old Patterns Still Work. Just Not the Way You Remember

## Introduction: The Age of Pattern Drift

The Gang of Four design patterns weren’t just about reusable code. They were about reusable thinking.

They gave developers a shared vocabulary for solving common problems, a way to bring structure and intention to the mess of procedural sprawl and ad hoc architecture. But the arrival of AI-native tooling has started to erode that foundation. Copilot suggests implementations before we’ve even framed the problem. Cursor rewrites functions before we’ve even reviewed requirements. LLMs now mediate not just how we write code, but how we decide what code should exist in the first place.

Patterns still matter. But we’re no longer designing for humans reading code. We’re designing for a world where the code might be read, or written, by a model.

So what happens when our main collaborator is probabilistic, stateless, and hungry for tokens? What happens when design becomes downstream of prompt engineering?

This is what it looks like to revisit the Gang of Four in an age of AI-native software development.

> **_Note:_** _Different LLM contexts, fine-tuned models, RAG-augmented agents, and multimodal systems, may apply these patterns differently. Strategy and statefulness can shift dramatically depending on memory architecture, tool invocation capability, or human-in-the-loop feedback._

## Strategy, or Prompt Engineering?

**Original Purpose:** Encapsulate interchangeable algorithms behind a common interface.

**In the AI era:**

- Strategy becomes emergent.
- You don’t wire up algorithm variants. You prompt the LLM and let it decide.
- Logic isn’t encapsulated in code, it’s embedded in prompt templates and few-shot examples.

> _New failure mode:_ **_Implicit Strategy_**

- The model chooses the path forward without surfacing its reasoning.
- The same prompt may yield different algorithms depending on phrasing, recency, or latent bias.

Instead of implementing strategies as concrete classes, we now shape them as modular prompts:

- **Chain-of-thought prompts** to reason step-by-step.
- **Fallback prompts** to rephrase or retry under failure conditions.
- **Routing logic** that shifts between tools or models.

**The pattern still exists,** but we’re composing it in text, not interfaces.

**RAG Context Example:** In a RAG-augmented agent, the Strategy pattern can manifest as a router that chooses the appropriate knowledge base or retrieval technique depending on the prompt’s phrasing. For example:

```javascript

function routeStrategy(prompt) {  
  if (prompt.includes("legal")) return queryLegalDocs(prompt);  
  if (prompt.includes("code")) return queryCodebase(prompt);  
  return queryGeneralCorpus(prompt);  
}
```

The “strategy” isn’t selected by a user. It’s inferred from prompt semantics.

## Observer Becomes Opaque

**Original Purpose:** Enable dependent systems to subscribe to and respond to state changes.

**In the AI era:**

- LLMs consume feedback implicitly.
- Fine-tuned models internalize “observation” as learned behavior, not discrete subscriptions.
- Feedback becomes statistical, not event-driven.

Where the classic Observer pattern gave us hooks, AI patterns give us black boxes. Want to know why an agent changed its behavior? Good luck. There’s no explicit event stream, no `onNotify()` call, just inferred preferences baked into weights or embedded memories.

> _Model drift becomes a ghost observer. It remembers. But it won’t explain._

This makes accountability difficult. When the behavior of your system depends on silent accumulation of context, debugging becomes forensic analysis.

**Emerging practice:**

- Log prompt chains.
- Visualize reasoning steps.
- Use “observer scaffolding” to audit AI behavior with synthetic tests and delta tracking.

**Example:** Create synthetic user inputs or test prompts with expected responses, then compare AI outputs over time. If a prompt that once yielded a secure onboarding message now produces ambiguous advice, you’ve found drift. These deltas help simulate observability in systems that otherwise lack hooks.

# Factory: Procedural Generation by Prompt

**Original Purpose:** Decouple object creation logic from the code that uses the objects.

**In the AI era:**

- Prompted LLMs behave like procedural content engines.
- A single prompt might generate a nested structure of config, code, docs, and data.

> _We don’t instantiate objects. We manifest outcomes._

Example:

- Classic: `ShapeFactory.create('Circle')`
- AI-native:

```javascript
const generateShape = (type) => `  
You are a code generator. Write a class for a ${type} with area and perimeter methods.  
`;
```

The “factory” logic is now embedded in a prompt pattern. The downside?

- No contract.
- No traceability.
- No consistent schema enforcement unless you impose one.

**Mitigation:** Use tools like JSON schema validation, prompt guards, and function call APIs to reintroduce structure post-generation.

**Watch for:** brittle prompts that silently drift when token context shifts or upstream content changes.

## Singleton: Now With Context Drift

**Original Purpose:** Ensure a single shared instance of a class exists across a system.

**In the AI era:**

- Every prompt session creates a new ephemeral instance.
- Attempts to simulate shared state often involve memory hacks, external caches, or embedded summaries.

> _The context window is your new singleton boundary. But it leaks._

LLMs don’t maintain global state.

- You try to fake it with memory stores.
- You sync across sessions with RAG.
- You use tool-augmented agents to write state to disk, then rehydrate later.

But unlike classic singletons, the AI singleton is:

- Volatile
- Stateless unless reinforced
- Prone to hallucinated memory

**Emerging pattern:** externalize state management. Treat the model like a stateless function. Don’t assume it remembers anything it hasn’t been told _explicitly_.

**RAG Illustration:**

```javascript
const memory = new VectorStore();  
const promptWithMemory = (input) => `  
Given prior context:  
${memory.retrieve(input)}  
  
Answer the following:  
${input}`;
```

This simulates singleton, style continuity via retrieval rather than shared memory.

## Decorator vs. Prompt Layering

**Original Purpose:** Dynamically add responsibilities to an object without modifying its structure.

**In the AI era:**

- Few-shot examples, system prompts, and embedded reasoning act like decorators.
- But unlike clean, chainable objects, prompt modifiers can collide.

> _Prompt layering is a decorator pattern without guarantees._

Concrete conflict example:

- Add `"Be concise"` → output tightens.
- Add `"Show all your work"` → output expands.
- Add both → response becomes erratic. Either overly verbose or misses reasoning altogether.

Prompt layering lacks the deterministic behavior of traditional decorators. Their effects are non-linear and frequently interdependent. You can’t always predict what a new prompt layer will do because the model may re-prioritize instructions based on token placement or recency bias.

**Prompt Layering Example:**

```Javascript
const basePrompt = "Summarize this article.";  
const decoratedPrompt = `  
You are a concise assistant.  
Explain your reasoning.  
${basePrompt}`;
```

Layering in this way may introduce unstable outcomes depending on model interpretation order.

**Key takeaway:**

- Decorator logic now lives in layered prompt context.
- But the lack of separation of concerns means they interact like stacked modifiers in an unstable spell.

**Tools like** LangChain, PromptLayer, and Semantic Kernel try to reintroduce control via prompt orchestration patterns.

## Proxy: The AI Safety Wrapper

**Original Purpose:** Control access to an object, adding behavior like validation, logging, or access control.

**In the AI era:**

- Proxies now appear as wrappers around LLM calls.
- Used to enforce safety policies, sanitize inputs, rate-limit usage, or monitor costs.

> _The proxy pattern helps keep hallucinations in check and costs from spiraling._

Examples include:

- Content filters that block toxic outputs
- Cost monitors that limit tokens or throttle generation
- Role-based access wrappers that prevent unauthorized prompt usage
- Dynamic input guards that rewrite prompts if certain keywords or intents are detected

**Deep Dive:** Proxy wrappers often sit at the boundary between user intent and execution. In a typical architecture:
```ruby
class AIAccessProxy:  
    def __init__(self, llm):  
        self.llm = llm  
    def run(self, prompt):  
        if contains_malicious_input(prompt):  
            raise ValueError("Input rejected by proxy")  
        safe_prompt = sanitize(prompt)  
        return self.llm.generate(safe_prompt)
        ```

**Key value:** Proxies provide operational safety and budget control in an otherwise uncontrolled surface area.

## Command: Prompt as Executable Object

**Original Purpose:** Encapsulate a request as an object that can be parameterized, queued, or logged.

**In the AI era:**

- Prompts themselves become serializable, version-controlled commands.
- Chains of prompts can be stored, replayed, or dynamically constructed at runtime.

> _A well-crafted prompt is a function. But a parameterized, context-aware prompt is a command._

Emerging uses:

- Replayable QA flows
- Versioned prompt chains with fallback logic
- Logging and audit trails of AI decisions
- Auto-scheduling agents that queue tasks and call tools asynchronously

**Example:**
```json
{  
  "type": "SummarizeArticle",  
  "prompt": "Summarize the following in bullet points...",  
  "version": "v3.0",  
  "timestamp": "2025-06-22T10:02Z",  
  "input": "{...article_text...}"  
}
```
This mirrors the Command pattern’s core value: decoupling the sender of a request from the logic that executes it.

Prompt-as-command design opens up workflow engines, approval systems, and audit tooling that treat LLM invocations like first-class operations.

## Anti-Patterns for the AI Age

- **God Prompt**: One massive prompt that tries to do everything. Unstable, slow, and unmaintainable.
- **Agent Sprawl**: Dozens of micro-agents each with overlapping scope, creating recursive logic and unintended interactions.
- **Blind Abstraction**: Hiding LLM calls behind conventional classes or interfaces, while ignoring cost, latency, or hallucination risk.
- **Semantic Drift**: Prompt chains that mutate slightly across invocations, leading to undetectable divergence in behavior.

## Conclusion: Patterns Still Matter. But the Medium Changed.

The original design patterns helped us communicate design intent. They aligned engineers around proven solutions.

Today, those same goals remain, but the medium has changed. Our building blocks are not classes and interfaces. They’re prompts, agents, chains, and token limits.

> _In the world of AI-native development, design clarity matters more than ever, because the system is probabilistic and opaque by default._

We now need patterns for:

- Prompt versioning and traceability
- Multi-agent orchestration
- State sharing across stateless components
- Trust boundaries in hybrid AI-human systems

The old patterns aren’t obsolete. But they need translation.

Because in a world where logic is emergent, and structure is ephemeral,

> Good design isn’t just how we build. It’s how we prompt what gets built.

## When to Choose an AI-Native Pattern

Not every situation calls for an AI-native design. These patterns shine in contexts where:

- **Ambiguity is acceptable or beneficial**: If the output can vary slightly but remain useful (e.g., summarization, classification, creative ideation), LLMs are well-suited.
- **Human interaction is part of the loop**: AI-native patterns thrive where human oversight or refinement follows the model output.
- **Scale or variability demands generalization**: When you need to handle diverse input or rapidly generate variations, procedural generation via prompts is far more efficient than maintaining a bloated class hierarchy.
- **Traceability and determinism can be externalized**: Using tools like logging, function-calling, or RAG to reintroduce auditability compensates for model opacity.

But in high-stakes, deterministic domains. Think financial transactions, security enforcement, or strict compliance logic, traditional coded patterns still offer:

- Greater testability
- Stronger type guarantees
- More predictable, repeatable behavior

> _The decision isn’t “AI-native or not.” It’s where to place the probabilistic boundary, and how to surround it with guardrails._

## What Should You Do With This?

Start where your stack lives now:

- **Catalog your current AI usage.** Which prompts, agents, or chains are live? How are they versioned? Who owns them?
- **Identify emerging anti-patterns.** Look for God Prompts, semantic drift, or hidden agents that lack observability.
- **Design (and name!) your own patterns.** AI-native systems need legibility. Treat prompt orchestration and agent logic as design patterns worth documenting.
- **Build a prompt architecture culture.** Review prompt logic like you would interface design. Encourage modularity, reuse, and clarity.

And above all: remember that clarity isn’t just for the humans anymore. It’s how your tools reason, your models behave, and your systems scale.