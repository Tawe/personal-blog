---
title: "The RAG Atlas: A Visual Guide to Retrieval Patterns"
subtitle: "Ten RAG architectures, visually mapped with interactive diagrams and a live simulator"
date: "2026-02-20"
excerpt: "An interactive visual reference covering ten RAG retrieval patterns — from Vanilla RAG to Graph RAG — with animated data-flow diagrams, a hoverable node inspector, and a simulator for tuning chunk size, top-k, and reranking."
tags: ["RAG", "Retrieval Augmented Generation", "LLM", "Vector Search", "AI Architecture", "Machine Learning"]
reading_time: 12
featured_image: /ragatlas.png?height=400&width=800
medium_link: ""
devto_link: ""
draft: false
---

RAG isn't one thing. It's a family of pipelines, each with different trade-offs around latency, cost, accuracy, and complexity. The RAG Atlas maps ten of the most common retrieval patterns visually, with animated data-flow diagrams you can interact with.

**[Open the Interactive RAG Atlas →](/strategic-narratives/technical-architecture/the-rag-atlas)**

---

## Ten patterns covered

**1. Vanilla RAG** — the minimal baseline. Query → embed → vector search → LLM. Fastest and simplest, but brittle on ambiguous queries.

**2. Hybrid RAG** — BM25 + vector search, fused with Reciprocal Rank Fusion. Best for technical terms, error codes, and proper nouns that semantic search misses.

**3. Rerank-first RAG** — over-retrieve a wide candidate set, then cross-encode for precision. Significant accuracy improvement at the cost of extra latency.

**4. Query Expansion** — an LLM generates multiple query variants to cast a wider retrieval net. Rescues vague or vocabulary-mismatched queries.

**5. HyDE** — Hypothetical Document Embeddings. The LLM drafts a plausible answer first; that answer's embedding retrieves better than the raw question.

**6. Conversational RAG** — condenses chat history into a standalone question before retrieval. Keeps multi-turn context accurate without stuffing the full transcript.

**7. Router RAG** — a classifier dispatches queries to the right source (docs, code index, SQL, web). Avoids polluting context by searching the wrong corpus.

**8. Iterative / Corrective RAG** — retrieve, draft, critique, refine, repeat. A self-correcting loop for complex questions and sparse corpora.

**9. Graph RAG** — traverses a knowledge graph from query entities, then summarises communities. Captures relationships that chunk-based retrieval structurally misses.

**10. Structured RAG** — the LLM generates SQL or tool calls for tabular data. Exact answers from authoritative structured sources with no hallucination on numeric facts (when SQL is correct).

---

Each pattern in the interactive version includes an animated flow diagram, a node-by-node inspector (what it does, why it exists, how it fails, and how to tune it), and a live simulator where you can toggle chunk size, top-k, reranker on/off, and hybrid mode, and see the effects on latency, cost, and accuracy risk in real time.
