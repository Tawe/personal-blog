---
title: "You're Probably Doing TypeScript Wrong (But I'm Here to Help)"
date: "2026-02-27"
excerpt: "TypeScript doesn’t make your code safe. It makes your design visible. Common mistakes, better patterns, and how to use TS without fighting it."
tags: ["WebDev", "JavaScript", "TypeScript", "Programming", "Software Engineering"]
reading_time: 10
featured_image: /ProbablyDoingTypeScriptWrong.png?height=400&width=800
devto_link: https://dev.to/tawe/youre-probably-doing-typescript-wrong-but-im-here-to-help-5da0
code_languages: ["typescript"]
draft: false
---

TypeScript surfaces complexity rather than reducing it.

That one idea explains most of the frustration people have with it. If your system has fuzzy boundaries, ambiguous states, or data you don't actually trust, TypeScript will surface those problems immediately. Fight the type system instead of fixing the underlying issues, and you get the worst of both worlds: a false sense of safety and a codebase nobody wants to touch.

I've shipped plenty of TypeScript I wouldn't defend in court. This isn't a purity lecture. It's the practical stuff: the places teams go wrong, and the patterns that actually help.

---

## 1) TypeScript isn't a safety net. It's a boundary tool.

The most common TypeScript failure mode is assuming it protects you from bad data, and it doesn't.

TypeScript is compile-time. Your production failures are runtime. That gap matters most at the edges of your system: request bodies, API responses, environment variables, database rows, message payloads.

If you tell TypeScript "this is a User," it will believe you. Even if the data is nonsense.

**The classic foot-gun: `as` at the boundary**

```typescript
type User = { id: string; email: string }

function parseUser(body: string): User {
  // This compiles. It is not validation.
  return JSON.parse(body) as User
}
```

This is not TypeScript doing its job. This is you opting out.

**A better default: validate at the edge, type inside**

Pick your runtime validator (Zod, Valibot, io-ts, your own). The library matters less than the discipline.

```typescript
import { z } from "zod"

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

type User = z.infer<typeof UserSchema>

function parseUser(body: unknown): User {
  return UserSchema.parse(body)
}
```

Inside your system: TypeScript is your guardrail. At the edges: runtime validation is your guardrail.

---

## 2) "If it compiles" is not a meaningful milestone

You can write perfectly typed code that is still wrong.

```typescript
function divide(a: number, b: number): number {
  return a / b
}
```

This compiles. It also happily returns `Infinity` when `b` is `0`. TypeScript has no opinion because this isn't a type problem.

A lot of teams slowly slide into treating green CI as proof of correctness. CI is green, types are happy, therefore the feature is safe. When production disagrees, it's tempting to blame TypeScript. But the real culprit is assumptions that were never encoded anywhere.

TypeScript enforces constraints, not correctness.

---

## 3) Stop modeling data. Start modeling states.

This is where TypeScript stops being "lint for objects" and starts being a design tool.

Most TypeScript pain is self-inflicted by allowing impossible states.

**The messy pattern: optional soup**

```typescript
type UserViewModel = {
  loading?: boolean
  data?: { id: string; email: string }
  error?: string
}
```

This type allows `loading` and `data` to both be true. It allows `data` and `error` to coexist. It allows nothing at all, which isn't a real state. Then the UI becomes a maze of conditional checks.

**The better pattern: discriminated unions**

```typescript
type Loading = { state: "loading" }

type Loaded = {
  state: "loaded"
  data: { id: string; email: string }
}

type Failed = {
  state: "error"
  message: string
}

type UserState = Loading | Loaded | Failed
```

Now you get narrowing for free:

```typescript
function render(state: UserState) {
  switch (state.state) {
    case "loading":
      return "Loading..."
    case "loaded":
      return `User: ${state.data.email}`
    case "error":
      return `Error: ${state.message}`
  }
}
```

The goal is making invalid states unrepresentable, and the payoff isn't just fewer bugs, it's less mental load.

---

## 4) Strictness and cleverness are different failure modes

`"strict": true` is generally a good move. But these are two separate ways teams go wrong, and conflating them causes problems.

**Strictness** is about the compiler. Turning it up is usually right. Turning it into a personality trait is not. You don't win by maximizing compiler discomfort, you win by making your system understandable.

**Cleverness** is about your teammates. A type can be technically correct and still be a failure if nobody else can safely change it.

Here's the failure mode for over-engineered types:

```typescript
// Don't do this
type ApiResult<T> = T extends { error: infer E }
  ? { ok: false; error: E }
  : T extends Promise<infer U>
    ? ApiResult<U>
    : { ok: true; value: T }
```

To understand what that does, you have to mentally execute the type system. Most teammates won't. They'll cargo-cult it or avoid touching it entirely.

```typescript
// Do this instead
type Success<T> = { ok: true; value: T }
type Failure<E = string> = { ok: false; error: E }

type ApiResult<T, E = string> = Success<T> | Failure<E>
```

It's less clever, but it's readable, refactorable, and something you can actually explain in a code review.

TypeScript is a communication tool between developers. The compiler is just the enforcer. If you're the only person who understands the types, you didn't build safety, you built a dependency.

**The mature stance on both**

- Use `unknown` at boundaries
- Validate once, narrow early
- Keep types readable
- Use escape hatches locally and intentionally

```typescript
function safeParseJson(input: string): unknown {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

const raw = safeParseJson(body)
if (raw === null) throw new Error("Invalid JSON")

const user = UserSchema.parse(raw)
```

`unknown` forces honesty. The unsafe part stays small. If you need `any`, isolate it like a radioactive substance.

---

## 5) TypeScript doesn't replace tests. It changes the test portfolio.

TypeScript removes an entire class of tests you used to need: argument type mismatches, missing properties, null and undefined checks (with strict nulls), invalid call sites.

What it doesn't remove are the tests that actually matter once systems grow.

**State transition tests**

When you model states explicitly, your tests shift from "does this property exist?" to "can the system move into an invalid state?"

```typescript
expect(reducer(loadingState, successAction)).toEqual({
  state: "loaded",
  data: mockUser
})
```

**Integration boundary tests**

Even with perfect TypeScript internally, boundaries still fail. Upstream APIs change. Messages arrive malformed. Feature flags flip at the wrong time. These tests verify that your runtime validation is doing its job.

```typescript
expect(() => UserSchema.parse(malformedPayload)).toThrow()
```

**Behavioral tests**

Business rules, sequencing, timing, and side effects live outside the type system. TypeScript makes these easier to write by removing noise, but it doesn't replace them.

```typescript
expect(sendWelcomeEmail).toHaveBeenCalledAfter(userCreated)
```

The win isn't fewer tests overall. It's fewer dumb tests and more meaningful ones.

---

## 6) The real cost of doing TypeScript wrong

The pain isn't the red squiggles.

It's what happens to the team over time. People stop refactoring because it's scary. Integration code becomes a minefield. Juniors learn to "just cast it." Seniors build type fortresses only they can maintain.

At small scale, bad TypeScript is annoying. At large scale, it becomes institutional.

---

## Closing

TypeScript makes your system visible, not safe. Using it well isn't about typing more, it's about drawing clear boundaries, modeling states instead of vibes, keeping the unsafe parts small, and making code easy to change without fear.

The mental model shift worth making:

From "TypeScript protects me" to "TypeScript forces me to be explicit."

That shift won't eliminate bugs, but it does eliminate surprises, and that's the kind of protection that actually scales.

---

## Quick checklist

Use this as a gut-check, not a purity test.

- [ ] Runtime validation exists at every system boundary (API, DB, env, messages)
- [ ] No `as` casts at boundaries, use `unknown` and validate
- [ ] State is modeled as discriminated unions, not optional soup
- [ ] `any` is isolated, commented, and treated as technical debt
- [ ] Types are readable by your least senior teammate
- [ ] Tests cover state transitions and integration boundaries, not just type shapes
- [ ] Your strictness serves the team, not your ego

If several of these feel uncomfortable, that's not a failure. It usually means the system has grown beyond its original assumptions, or the types are finally forcing a conversation the team has been avoiding.

That's not TypeScript being annoying. That's TypeScript doing exactly what it's good at: surfacing design decisions that were previously implicit, fragile, or tribal knowledge.

If you fix nothing else after reading this, fix your boundaries and your states. Everything else gets easier.

---

Original publication: [DEV Community](https://dev.to/tawe/youre-probably-doing-typescript-wrong-but-im-here-to-help-5da0)
