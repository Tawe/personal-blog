---
title: "Vector Embeddings Explained (with hands on demo)"
subtitle: "Why similar embedding setups can behave very differently in real systems"
date: "2026-02-23"
excerpt: "A practical explanation of vector embeddings, distance metrics, and why similar setups can behave differently in real systems, with a hands-on demo."
tags: ["AI", "Machine Learning", "Architecture", "Learning"]
reading_time: 6
devto_link: https://dev.to/tawe/vector-embeddings-explained-with-hands-on-demo-56gp
code_languages: []
draft: false
---

People tend to talk about embeddings as if they are a single thing.

They are not.

An embedding is just a vector, a list of numbers. What ends up mattering in practice is not the fact that the numbers exist, but **how those numbers were produced** and **how you decide whether two vectors are "close."**

I built this while trying to explain to myself why two embedding setups that looked identical on paper kept producing noticeably different results.

Below is a small interactive demo that makes that behavior visible. You can type text, turn it into embeddings, then switch models and distance metrics and watch what happens.

Nothing magical. Just the system doing exactly what it was trained to do.

---

## Try this first

Before reading too much, use the demo.

Add a few short sentences, then:
- Switch distance from **Cosine -> Euclidean**
- Watch which items become nearest neighbors
- Switch models and repeat

If that feels surprising, that is the point.

{% codepen https://codepen.io/Tawe/pen/raMBzGM %}

---

## What an embedding actually is

At a very literal level, an embedding model maps text to a point in a high-dimensional space.

The reason embeddings are useful is that text which tends to mean similar things ends up closer together in that space. Text that does not tends to drift apart. This comes from patterns of usage across large amounts of language, not from any explicit notion of meaning.

There is no dictionary hiding in here. No label saying "these two sentences are the same." Just statistics and geometry.

---

## The part that usually gets glossed over

Once you have vectors, you still have not answered the question that actually drives system behavior.

**How do you decide what "close" means?**

That choice has consequences. In the demo, you can switch between distance metrics. Each one evaluates the *same* underlying vectors differently. The vectors themselves do not change, but the map redraws to reflect how the chosen metric interprets the relationships between them.

This is one of those details that is easy to skip early on and hard to debug later.

---

## Cosine distance

Cosine distance looks at **direction**, not magnitude.

If you picture each sentence as an arrow, cosine distance is checking whether those arrows point in roughly the same direction. It does not care how long they are.

That turns out to work well for language. Meaning tends to show up in direction. Length often reflects things like verbosity or emphasis, which usually are not what you want to rank on.

That is why cosine similarity shows up everywhere in semantic search and RAG pipelines. It is a common default for a reason.

---

## Euclidean distance

Euclidean distance is the straight-line distance most people are familiar with.

It is intuitive, but it is sensitive to magnitude. If vectors are not normalized, length can dominate similarity in ways that are hard to reason about.

In the demo, everything is normalized so Euclidean distance behaves more predictably. Even then, it emphasizes slightly different structure than cosine distance.

This is why you often see cosine used for ranking and Euclidean used for clustering or visualization.

Same vectors. Different emphasis.

---

## Dot product

Dot product combines direction *and* magnitude.

It is fast, simple, and widely used in high-performance retrieval systems.

The interpretation is different. Higher values mean more similar. Longer vectors can dominate if you are not careful.

In the demo, dot product is shown as a similarity score and then converted into a distance internally so it can still be visualized. That mirrors how a lot of real systems handle this behind the scenes.

---

## Why the map keeps shifting

If you play with the demo, you will notice that switching models or distance metrics reshapes the entire map.

This is expected.

Different embedding models learn different geometries. Distance metrics then evaluate those geometries in different ways. The underlying vectors stay the same, but the relationships the metric emphasizes change, and the projection updates to reflect that.

Nearest neighbors shift. Clusters stretch or collapse. Things that looked obvious under one setup stop looking obvious under another.

Nothing failed.

You just changed how similarity is being measured.

---

## A mental model that has been useful for me

Embeddings define a space.

Distance defines how relationships in that space are evaluated.

Projections are just a way to make those relationships visible.

If you change any of those, you should expect the picture to change too.

---

## Why this shows up in real systems

This is not something you only notice in demos.

I have seen teams use the same embedding model, the same vector database, and the same data, and still end up with noticeably different results. The difference usually came down to distance metric, normalization, or both.

That tends to surface later as confusing search results or retrieval behavior that feels off but is hard to pin down.

The demo is a good place to watch that happen in a controlled way.

> **If you are building with embeddings**
> Write down your model, normalization step, distance metric, and ANN index assumptions.
> Most "mysterious" behavior comes from one of those changing quietly.

---

## A quick note on the visualization

What you are looking at is a projection.

The real space is hundreds of dimensions. The 2D layout preserves distances as best it can, but it is still an approximation. It is useful for building intuition and spotting patterns, not for proving anything formally.

It is best treated as a debugging aid for intuition.

---

## One last thing

If you can make the demo behave exactly the way you expect on the first try, you probably already know more about embeddings than you think.

If you cannot, that is the more common outcome.

Add a few sentences you are confident should be close. Switch the distance metric. Switch the model. Watch what moves and what stubbornly does not.

When something surprises you, resist the urge to "fix" it and ask what assumption just got exposed instead.

That moment of surprise is usually where the real understanding starts.
