---
title: "Teaching AI to See your UI"
subtitle: "Using Puppeteer as eyes for your AI"
date: "2026-01-13"
excerpt: "How I use Puppeteer to give an AI visibility into a real UI, letting it observe failures, reason from evidence, and repair its own mistakes."
tags: ["Artificial Intelligence", "Software Engineering", "Software Development", "Web Developement", "Automation"]
featured_image: /teachingaitosee.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/prompt-debt-6e6e05c7958a
reading_time: 6
code_languages: ["javascript"]
draft: false
---

Most LLM-driven development breaks down in a predictable way: the model never sees the result of what it just did.

It writes code, sounds confident about it, and moves on. If something fails, you tell it what went wrong. If the fix doesn't work, you rephrase the bug. Rinse, repeat.

This workflow is my attempt to close that loop.

Instead of treating the LLM like a code generator, I treat it more like an operator inside a constrained system. I let it run the app, click the UI, wait on real network calls, and hit real failure states. Only after it has evidence do I ask it to explain what happened and propose a fix.

Puppeteer is what makes that possible. It gives the model a controlled way to interact with the UI and collect proof when reality doesn't match intent. That turns the LLM from something that _talks_ about bugs into something that can reason about them.

## What Puppeteer Actually Does (in this setup)

At a basic level, Puppeteer is just a Node.js library that drives a browser. It can navigate pages, click elements, read console output, capture screenshots, and inspect the DOM.

What matters here is _how_ it's used.

Instead of running isolated tests, I use Puppeteer to let the AI observe the live application. It sees what's rendered, what requests fire, which ones don't, and what the browser complains about along the way.

That means the model isn't reasoning from source code alone. It's reasoning from execution.

## Why Code-Only AI Debugging Falls Apart

Most AI-assisted workflows still operate in a vacuum. The model reads code, trusts your description of what happened, and fills in the gaps with pattern matching.

That works surprisingly often, right up until it doesn't. When something subtle breaks, you get confident explanations about behavior the model has never actually observed.

By letting the AI watch the app fail, the feedback loop changes. When something breaks, it doesn't have to guess. It can see:

- what the UI did
- what the browser logged
- what the network returned
- what the backend reported

That difference sounds small. In practice, it's the difference between speculation and diagnosis.

## The Repair Loop

The loop itself is simple:

1. Generate: The LLM makes a change based on the spec.
2. Execute: Puppeteer runs the app and drives real interactions.
3. Observe: Screenshots, console logs, DOM state, and network responses are captured.
4. Explain: The LLM explains the gap between expected and observed behavior.
5. Repair: A focused fix is proposed and applied.
6. Lock it in: A Puppeteer check ensures the same failure can't quietly come back.

Step three is the most important, It allows the AI to use browser state and network evidence in its debugging.

### Waiting for proof instead of vibes

```javascript
// Don't assume the save worked.
// Wait for the request that proves it.
const [response] = await Promise.all([
  page.waitForResponse(
    r => r.url().includes('/api/profile') && r.request().method() === 'POST',
    { timeout: 60000 }
  ),
  clickElement('button[type="submit"]')
])

if (!response.ok()) {
  throw new Error(`Profile save failed: ${response.status()}`)
}
```

The endpoint doesn't matter. What matters is that the model isn't allowed to move on until something observable happens.

## Letting the Model Be Wrong

One of the more important behaviors in this setup is refusal.

When the input is incomplete, contradictory, or low quality, the model is expected _not_ to score, rank, or embellish. Puppeteer makes that visible by showing exactly how the system behaves when it can't proceed.

In InterviewPrep, feeding malformed data or empty experience sections results in:

- stalled UI states instead of fabricated suggestions
- console warnings tied to missing required fields
- clear, explainable failure paths

The model doesn't smooth this over. It explains why it can't continue and points at what's missing. That behavior is intentional. Honest failure is more useful than confident nonsense.

## What This Changed in Practice

This isn't theoretical. In day-to-day use:

- The AI stops hallucinating UI behavior.
- Bugs are debugged with evidence instead of guesswork.
- Tests are generated _and validated against the live DOM_.
- I spend far less time re-explaining the same bug in different words.

It's not autonomy. But it drops the supervision tax more than I expected.

## Demo: InterviewPrep

Rather than a toy demo, this workflow is exercised against a real system I use regularly: InterviewPrep, an AI-driven interview practice app.

It has authentication, multi-step flows, file uploads, async parsing, and stateful navigation. In other words, exactly the sort of surface area where AI assumptions usually crack.

### Puppeteer driving the real product

The model doesn't reason about InterviewPrep abstractly. Puppeteer logs in, fills forms, uploads files, waits on real responses, and captures what the UI actually does.

```javascript
await page.type('input[name="email"]', testUser.email)
await page.type('input[name="password"]', testUser.password)
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
  page.click('button[type="submit"]')
])
```

At this point, success is visible in routing and rendered state.

![](/aitoseeimage1.webp)

_Puppeteer after login. The model doesn't assume success; it waits for navigation and rendered state._

### File uploads: where assumptions usually break

Resume upload is a classic failure zone: async parsing, delayed UI updates, partial success states.

```javascript
const [fileChooser] = await Promise.all([
  page.waitForFileChooser(),
  clickElement('div.border-dashed, input[type="file"]')
])

await fileChooser.accept([resumePath])
```

Parsing takes time. The test accounts for that instead of racing it.

```javascript
await page.waitForResponse(
  r => r.url().includes('/api/resume') && r.status() === 200,
  { timeout: 60000 }
)
```

![](/aitoseeimage2.webp)

_Resume state after navigating away and back. Puppeteer verifies persistence instead of trusting the UI once._

### Verifying against the system of record

UI state alone isn't trusted. After the interaction, the backend is checked directly.

```javascript
const token = await page.evaluate(() => localStorage.getItem('token'))
const response = await fetch(`${config.backendUrl}/api/profile`, {
  headers: { Authorization: `Bearer ${token}` }
})

if (!response.ok) throw new Error('Backend profile check failed')
```

If the UI claims success but the backend disagrees, the model has to reconcile that mismatch.

## A Reality Check

This isn't autonomous engineering. Even with Puppeteer and careful prompts, the AI still needs clear specs and human judgement, especially around UX nuance and edge cases.

But grounding the model in observed behavior instead of intent alone makes it far more useful.

## The Prompt That Matters

```
Here's the console output and the screenshot.
Explain why the "Submit" button never becomes enabled.
What state mismatch or missing event explains this?
Propose the smallest fix that aligns with the spec.
```

That framing matters more than the tooling.

## A Minimal Script You Can Steal

```javascript
import puppeteer from "puppeteer";

const URL = process.env.URL || "http://localhost:3000";

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();

page.on("console", (msg) => {
  console.log(`[browser:${msg.type()}]`, msg.text());
});

page.on("requestfailed", (req) => {
  console.log("[requestfailed]", req.url(), req.failure()?.errorText);
});

try {
  await page.goto(URL, { waitUntil: "networkidle2" });

  await page.waitForSelector('[data-testid="login-button"]', { timeout: 10000 });
  await page.click('[data-testid="login-button"]');

  await page.waitForSelector('[data-testid="login-modal"]', { timeout: 10000 });

  await page.screenshot({ path: "artifacts/smoke.png", fullPage: true });

  console.log("smoke test passed");
} catch (err) {
  await page.screenshot({ path: "artifacts/smoke.fail.png", fullPage: true });
  throw err;
} finally {
  await browser.close();
}
```

## Final Thought

Giving AI visibility into what _actually happens_ in the app, instead of what the code implies should happen, feels like the natural next step for assisted development.

Because it's working from evidence instead of flying blind.

That's the point where AI stops feeling like a teammate that constantly needs hand holding and more like a teammate who pulls their own weight.
