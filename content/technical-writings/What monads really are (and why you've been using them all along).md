---
title: "What monads really are (and why you've been using them all along)"
date: "2025-11-06"
excerpt: "Monads sound intimidating — but you’ve already been using them. This guide walks through how Promise, Maybe, and Result patterns make your JavaScript and TypeScript code safer and cleaner. Starting with everyday examples and building up to your own Maybe monad, you’ll learn when to use them, when not to, and how they connect to modern frameworks like fp-ts and effect-ts."
tags: ["Webdev", "Javascript", "Typescript", "Coding"]
reading_time: 5
featured_image: /Whatmonadsreally.png?height=400&width=800
medium_link:
devto_link: https://dev.to/tawe/what-monads-really-are-and-why-youve-been-using-them-all-along-4kai
code_languages: ["Javascript", "Typescript"]
draft: false
---

If you’ve ever chained `.then()` calls, mapped over an array, or used async/await, congratulations, you’ve already used a monad. You just didn’t call it that.

Most explanations start with abstract math: _endofunctors, morphisms, category theory._ Let’s skip that.

A monad is a pattern for sequencing transformations safely, a way to handle “and then…” without breaking everything when something goes wrong.

With tools like **effect-ts** gaining traction and Rust patterns bleeding into JS, understanding monads is becoming less academic and more practical.

---

## The everyday monad: promises

Let’s start with something you already know.

```js
const getUser = (id) =>
  fetch(`/api/users/${id}`).then(res => res.json());

getUser("123")
  .then(user => fetch(`/api/orders/${user.id}`))
  .then(res => res.json())
  .then(console.log);
```

Each `.then()` takes the output of the previous step, keeps it wrapped in a `Promise`, and passes it forward. That’s a monad in the wild. A container that lets you chain work without tearing it open each time.

---

## Why we bother

Without monads, you’d constantly be doing this:

```js
getUser("123")
  .then(userPromise =>
    userPromise
      ? // What if user is null?
        fetch(`/api/orders/${userPromise.id}`).then(res => res.json())
      : Promise.reject("no user") // What if address is missing?
  );
```

That’s messy and fragile. Monads abstract the wrapping and unwrapping so you can focus on the logic, not the plumbing.

Here’s a clearer before-and-after view:

```js
// Nested promises
fetch(url)
  .then(r => r.json())
  .then(data => data?.user?.address ? data.user.address : null);

// Monadic chain (conceptually)
fetch(url)
  .then(r => r.json())
  .then(Maybe.of)
  .flatMap(u => Maybe.of(u.user))
  .flatMap(u => Maybe.of(u.address));
```

The key insight: `flatMap` lets you chain functions that return wrapped values, while `map` is for functions that return plain ones.

---

## Build one: the "Maybe" monad

Sometimes you get data that might be `null` or `undefined`. Instead of endless `if` checks, we’ll make a simple `Maybe` wrapper.

**In plain JavaScript:**

```js
const Some = (value) => ({ kind: "some", value });
const None = () => ({ kind: "none" });

const map = (m, fn) =>
  m.kind === "some" ? Some(fn(m.value)) : None();

const flatMap = (m, fn) =>
  m.kind === "some" ? fn(m.value) : None();
```

Usage:

```js
const safeDivide = (a, b) => (b === 0 ? None() : Some(a / b));

const result = flatMap(safeDivide(10, 2), x => safeDivide(x, 5));
console.log(result); // { kind: "some", value: 1 }
```

---

## Add TypeScript for safety

Once this pattern clicks, TypeScript can enforce these contracts at compile time instead of runtime.

```typescript
type Maybe<T> = { kind: "some"; value: T } | { kind: "none" };

const Some = <T>(value: T): Maybe<T> => ({ kind: "some", value });
const None = <T>(): Maybe<T> => ({ kind: "none" });

const flatMap = <T, U>(m: Maybe<T>, fn: (v: T) => Maybe<U>): Maybe<U> =>
  m.kind === "some" ? fn(m.value) : None();
```

TypeScript now stops you from mapping the wrong function or unwrapping a `None()` by accident.

---

## Why this matters in real projects

You already use monads every day:

- `Promise<T>` for async results
- `Array<T>` for multiple results
- `Option`/`Maybe<T>` for optional values
- `Result<T, E>` (inspired by Rust) for success or failure

They give you consistency, the same predictable way to chain transformations without blowing up your code.

*Real-world example:** parsing a nested API response safely.

```typescript
const getCity = (res: any): Maybe<string> =>
  res && res.user && res.user.address ? Some(res.user.address.city) : None();

Some(response)
  .flatMap(r => getCity(r))
  .map(city => city.toUpperCase());

// Returns None() and short-circuits safely
Some(null).flatMap(r => getCity(r)).map(city => city.toUpperCase());
```

---

## When simple is better

Sometimes you don’t need monads at all. If a null check does the job, do that. Use monads when data needs to flow through several uncertain steps or when you’re composing transformations across async boundaries.

---

## When to reach for them

- Error handling: Replace scattered `try/catch` with a `Result` monad
- Optional data: Use `Maybe` instead of `if (x)` checks
- Async logic: You’re already doing it with `Promise`
- Complex data flows: Compose transformations safely instead of nesting callbacks

---

## Takeaways

- A monad is just a wrapper + a way to chain (`flatMap`)
- You use them already: promises, arrays, optionals
- TypeScript helps you express them safely, but you can learn the idea in JS first
- Once you start seeing them, you’ll notice where they simplify your code, and where they’re overkill

The next time you write `if (x && x.y && x.y.z)`, ask yourself. Am I just building a monad by hand?

---

### What's next

Explore these for deeper dives:

- [effect-ts documentation](https://effect.website/docs)
- [fp-ts library](https://gcanti.github.io/fp-ts/)
- [Rust’s](https://doc.rust-lang.org/std/result/)
- [Professor Frisby’s “Mostly Adequate Guide to Functional Programming](https://www.goodreads.com/book/show/25847352-professor-frisby-s-mostly-adequate-guide-to-functional-programming)