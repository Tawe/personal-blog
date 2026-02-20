// rag-patterns-data.ts — JSON-driven spec for all RAG patterns
// No imports. Pure data. Used by RagAtlasClient.tsx.

export type PayloadType = "query" | "embedding" | "chunk" | "score" | "sql"
export type EdgeSpeed = "fast" | "medium" | "slow"
export type NodeType = "input" | "process" | "store" | "model" | "output" | "branch"

export interface RagNode {
  id: string
  label: string
  x: number // center x in SVG coords
  y: number // center y in SVG coords
  w: number // rect width
  h: number // rect height
  type: NodeType
  // Inspector panel fields
  what: string
  why: string
  fails: string
  tune: string
  removeWhen: string
}

export interface RagEdge {
  id: string
  from: string // node id
  to: string   // node id
  label?: string
  payloadType: PayloadType
  speed: EdgeSpeed
  via?: { x: number; y: number } // quadratic bezier control point
  path?: string // full SVG path override for complex routes
}

export interface PatternCard {
  bestFor: string[]
  pros: string[]
  cons: string[]
  failureModes: string
  costNotes: string
  latencyNotes: string
}

export interface RagPattern {
  id: string
  name: string
  shortDesc: string
  viewBox: string
  nodes: RagNode[]
  edges: RagEdge[]
  patternCard: PatternCard
}

// ─── Pattern 1: Vanilla RAG ──────────────────────────────────────────────────

const vanillaRag: RagPattern = {
  id: "vanilla-rag",
  name: "Vanilla RAG",
  shortDesc: "The baseline: embed, search, generate",
  viewBox: "0 0 760 180",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 90, w: 100, h: 40, type: "input",
      what: "The raw user question entering the pipeline.",
      why: "Entry point — defines what the system retrieves and what the LLM answers.",
      fails: "Ambiguous or multi-part queries produce mismatched retrieval.",
      tune: "Add query normalization, spell-check, or intent classification upstream.",
      removeWhen: "Never — this is the input.",
    },
    {
      id: "embed", label: "Embed Query", x: 225, y: 90, w: 110, h: 40, type: "process",
      what: "Encodes the query into a dense vector using a text embedding model.",
      why: "Semantic search requires vectors to compute cosine similarity against the index.",
      fails: "Domain mismatch: index built with model A, query embedded with model B.",
      tune: "Embedding model choice (ada-002, e5-large, BGE-M3).",
      removeWhen: "Replaced by BM25-only search when exact lexical match suffices.",
    },
    {
      id: "vector-search", label: "Vector Search", x: 405, y: 90, w: 130, h: 40, type: "store",
      what: "ANN lookup in a vector database returning the k most similar chunks.",
      why: "Efficiently finds semantically relevant passages across millions of documents.",
      fails: "Returns semantically similar but factually wrong chunks (false positives).",
      tune: "top-k, similarity threshold, HNSW ef parameter, distance metric.",
      removeWhen: "Replaced by hybrid retrieval when lexical precision is required.",
    },
    {
      id: "topk", label: "Top-k Chunks", x: 575, y: 90, w: 110, h: 40, type: "process",
      what: "Trims the result list to the k highest-scoring candidates for LLM context.",
      why: "Context window management — only pass what the model can attend to effectively.",
      fails: "Too low: misses the answer. Too high: adds noise and dilutes attention.",
      tune: "k value (typical 3–8). Consider dynamic k based on score distribution.",
      removeWhen: "Replaced by a cross-encoder reranker that handles selection more precisely.",
    },
    {
      id: "llm", label: "LLM", x: 710, y: 90, w: 80, h: 40, type: "model",
      what: "Generates the final answer from the query and retrieved chunks as context.",
      why: "Synthesis step — converts retrieved facts into fluent, accurate output.",
      fails: "Hallucination when chunks contradict each other or the answer isn't present.",
      tune: "System prompt design, temperature, max_tokens, model choice.",
      removeWhen: "Never — this is the generation step.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "embed", payloadType: "query", speed: "fast" },
    { id: "e2", from: "embed", to: "vector-search", payloadType: "embedding", speed: "fast" },
    { id: "e3", from: "vector-search", to: "topk", payloadType: "chunk", speed: "medium", label: "top-50" },
    { id: "e4", from: "topk", to: "llm", payloadType: "chunk", speed: "medium" },
  ],
  patternCard: {
    bestFor: [
      "Internal knowledge bases with clean, chunked documents",
      "Prototyping and baseline benchmarking",
      "Low-latency budgets where reranking is unaffordable",
    ],
    pros: ["Simplest to build and debug", "Lowest latency of all RAG variants", "Single embedding model to manage"],
    cons: ["Brittle on ambiguous queries", "No score calibration across chunks", "Sensitive to chunk size and overlap"],
    failureModes: "Returns plausible-sounding but wrong chunks when queries are ambiguous or the corpus has near-duplicate contradictory passages.",
    costNotes: "1× retrieval. ~$0.0001 per query at ada-002 pricing.",
    latencyNotes: "50–150ms retrieval + LLM generation. Total: 500–2000ms.",
  },
}

// ─── Pattern 2: Hybrid RAG ───────────────────────────────────────────────────

const hybridRag: RagPattern = {
  id: "hybrid-rag",
  name: "Hybrid RAG",
  shortDesc: "BM25 + vector, fused with RRF",
  viewBox: "0 0 860 280",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 140, w: 100, h: 40, type: "input",
      what: "The raw user question entering both retrieval branches in parallel.",
      why: "Entry point — dispatched simultaneously to keyword and semantic search.",
      fails: "Queries with no keywords and no semantic content confuse both branches.",
      tune: "Route only the original query; expansion happens downstream if needed.",
      removeWhen: "Never — this is the input.",
    },
    {
      id: "bm25", label: "BM25 Search", x: 245, y: 80, w: 110, h: 40, type: "store",
      what: "Sparse keyword retrieval using TF-IDF scoring (BM25 variant).",
      why: "Captures exact matches for identifiers, error codes, proper nouns, and rare terms.",
      fails: "Floods results when common words dominate; struggles with paraphrasing.",
      tune: "k1 and b parameters; field boosting (title vs. body).",
      removeWhen: "Queries are purely conceptual with no exact-match requirements.",
    },
    {
      id: "vec", label: "Vector Search", x: 245, y: 200, w: 120, h: 40, type: "store",
      what: "Dense ANN retrieval returning semantically similar chunks.",
      why: "Covers synonyms, paraphrases, and intent that BM25 misses.",
      fails: "Misses exact identifiers; hallucination-prone on rare technical strings.",
      tune: "Embedding model domain alignment; top-k per branch.",
      removeWhen: "All queries are lexically precise (log search, error codes only).",
    },
    {
      id: "rrf", label: "RRF Fusion", x: 440, y: 140, w: 100, h: 40, type: "process",
      what: "Reciprocal Rank Fusion merges BM25 and vector result lists into one ranked list.",
      why: "Normalises scores across incompatible retrieval systems without shared scale.",
      fails: "Creates duplicates; can amplify noise if one branch returns garbage.",
      tune: "RRF constant k (default 60). Consider weighted RRF if one branch dominates.",
      removeWhen: "You have a cross-encoder reranker that can handle merging itself.",
    },
    {
      id: "rerank", label: "Reranker", x: 600, y: 140, w: 110, h: 40, type: "process",
      what: "Cross-encoder model scores each candidate against the query jointly.",
      why: "More accurate than bi-encoder similarity; catches subtle relevance differences.",
      fails: "Latency bottleneck; weaker on very long chunks.",
      tune: "Candidate budget fed to reranker (top-20 is common).",
      removeWhen: "Latency budget is tight; use RRF output directly.",
    },
    {
      id: "llm", label: "LLM", x: 765, y: 140, w: 80, h: 40, type: "model",
      what: "Generates the final answer from the reranked, merged context.",
      why: "Synthesis step — benefits from the higher-precision retrieval upstream.",
      fails: "Hallucination still possible if top chunks are close but wrong.",
      tune: "System prompt, citation instructions, temperature.",
      removeWhen: "Never.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "bm25", payloadType: "query", speed: "fast", via: { x: 160, y: 80 } },
    { id: "e2", from: "query", to: "vec", payloadType: "query", speed: "fast", via: { x: 160, y: 200 } },
    { id: "e3", from: "bm25", to: "rrf", payloadType: "score", speed: "medium", via: { x: 390, y: 80 } },
    { id: "e4", from: "vec", to: "rrf", payloadType: "score", speed: "medium", via: { x: 390, y: 200 } },
    { id: "e5", from: "rrf", to: "rerank", payloadType: "chunk", speed: "medium", label: "top-20" },
    { id: "e6", from: "rerank", to: "llm", payloadType: "chunk", speed: "slow", label: "top-5" },
    { id: "e7", from: "query", to: "rerank", payloadType: "query", speed: "fast", label: "query", via: { x: 470, y: 65 } },
  ],
  patternCard: {
    bestFor: [
      "Technical docs with exact identifiers, error codes, or product names",
      "Support tickets, Jira, runbooks, API references",
      "Corpora with proper nouns that semantic search misses",
    ],
    pros: ["Best of both worlds: keyword precision + semantic recall", "RRF is robust without needing score normalisation"],
    cons: ["More moving parts to tune", "Merging can create duplicates and noise"],
    failureModes: "Keyword branch floods results with common-word matches; RRF fails to surface the genuinely relevant chunk.",
    costNotes: "2–2.5× retrieval cost vs. Vanilla. BM25 index adds storage overhead.",
    latencyNotes: "Parallel retrieval keeps latency near Vanilla + ~50ms for RRF + reranker.",
  },
}

// ─── Pattern 3: Rerank-first RAG ─────────────────────────────────────────────

const rerankFirstRag: RagPattern = {
  id: "rerank-first-rag",
  name: "Rerank-first RAG",
  shortDesc: "Over-retrieve, then cross-encode for precision",
  viewBox: "0 0 900 180",
  nodes: [
    {
      id: "query", label: "User Query", x: 65, y: 90, w: 90, h: 40, type: "input",
      what: "Raw user question dispatched to initial recall.",
      why: "Entry point — seeds the wide retrieval step.",
      fails: "Multi-part questions produce diluted recall across two intents.",
      tune: "Consider splitting compound questions before this step.",
      removeWhen: "Never.",
    },
    {
      id: "embed", label: "Embed Query", x: 200, y: 90, w: 100, h: 40, type: "process",
      what: "Encodes query into a vector for ANN search.",
      why: "Required for semantic retrieval in the recall phase.",
      fails: "Model mismatch with the index embedding model degrades all downstream steps.",
      tune: "Embedding model aligned to corpus domain.",
      removeWhen: "Replaced by hybrid retrieval for recall.",
    },
    {
      id: "recall", label: "Initial Recall", x: 365, y: 90, w: 130, h: 40, type: "store",
      what: "Wide ANN search returning a large candidate set (top-50 or more).",
      why: "Cast a wide net so the reranker has enough candidates to work with.",
      fails: "If the answer isn't in the top-50, the reranker can't rescue it.",
      tune: "Recall k (50–200). Bigger k improves ceiling; smaller k reduces reranker cost.",
      removeWhen: "Corpus is small enough that brute-force comparison is feasible.",
    },
    {
      id: "reranker", label: "Cross-Encoder", x: 545, y: 90, w: 130, h: 40, type: "process",
      what: "Scores each candidate against the query jointly using a cross-encoder model.",
      why: "Bi-encoder similarity is approximate; cross-encoder sees both texts simultaneously for higher accuracy.",
      fails: "Bottleneck on large candidate sets; slow on very long chunks.",
      tune: "Cross-encoder model size; candidate budget; chunk length limit.",
      removeWhen: "Latency is critical; RRF fusion result is precise enough.",
    },
    {
      id: "topk", label: "Top-k Result", x: 725, y: 90, w: 100, h: 40, type: "process",
      what: "Trims reranked candidates to a tight final set (top-5 to top-8).",
      why: "Post-rerank, scores are well-calibrated so a small k is safe.",
      fails: "Cutting too aggressively still possible if chunks are too similar to distinguish.",
      tune: "k value; add a minimum score threshold to filter weak matches.",
      removeWhen: "Pass all reranked candidates if context window allows.",
    },
    {
      id: "llm", label: "LLM", x: 855, y: 90, w: 80, h: 40, type: "model",
      what: "Generates the answer from the high-precision reranked context.",
      why: "Receives a much cleaner signal than Vanilla RAG — less hallucination risk.",
      fails: "Still hallucinates if reranker ranked a wrong-but-plausible chunk first.",
      tune: "System prompt emphasising faithfulness to context.",
      removeWhen: "Never.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "embed", payloadType: "query", speed: "fast" },
    { id: "e2", from: "embed", to: "recall", payloadType: "embedding", speed: "fast" },
    { id: "e3", from: "recall", to: "reranker", payloadType: "chunk", speed: "medium", label: "top-50" },
    { id: "e4", from: "reranker", to: "topk", payloadType: "score", speed: "slow", label: "ranked" },
    { id: "e5", from: "topk", to: "llm", payloadType: "chunk", speed: "medium" },
    { id: "e6", from: "query", to: "reranker", payloadType: "query", speed: "fast", label: "query", via: { x: 270, y: -50 } },
  ],
  patternCard: {
    bestFor: [
      "High-precision answers: support, legal, policy, compliance",
      "Corpora with many near-duplicate or closely related passages",
      "When accuracy matters more than latency",
    ],
    pros: ["Large accuracy improvement over pure vector top-k", "Well-calibrated scores after reranking"],
    cons: ["Adds 100–500ms reranker latency", "Candidate set must be large enough to matter"],
    failureModes: "Correct chunk outside the recall window; reranker bottleneck with large k.",
    costNotes: "1.5–2× compute vs. Vanilla. Cross-encoder inference is GPU-bound.",
    latencyNotes: "100–500ms extra for cross-encoder on top of recall.",
  },
}

// ─── Pattern 4: Query Expansion ──────────────────────────────────────────────

const queryExpansion: RagPattern = {
  id: "query-expansion",
  name: "Query Expansion",
  shortDesc: "LLM generates query variants for broader recall",
  viewBox: "0 0 960 300",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 150, w: 90, h: 40, type: "input",
      what: "The original user question, potentially vague or under-specified.",
      why: "Entry point — the expander uses it to generate richer search variants.",
      fails: "Highly ambiguous queries cause the expander to generate irrelevant variants.",
      tune: "Pre-process the query to strip filler words before expansion.",
      removeWhen: "Never.",
    },
    {
      id: "expander", label: "LLM Expander", x: 230, y: 150, w: 130, h: 40, type: "model",
      what: "An LLM call that generates 3–5 alternative phrasings of the original query.",
      why: "Different phrasings retrieve different chunks; union gives better recall.",
      fails: "Expanded queries can drift far from original intent; amplifies noise.",
      tune: "Number of variants; temperature (low for focused, high for diverse).",
      removeWhen: "Queries are already precise; expansion adds latency with no recall gain.",
    },
    {
      id: "retrieve-a", label: "Retrieve A", x: 435, y: 90, w: 110, h: 40, type: "store",
      what: "Vector search for query variant A.",
      why: "Each variant targets a different semantic neighborhood in the index.",
      fails: "Variant too similar to original: retrieves duplicate chunks.",
      tune: "top-k per variant (typically 10–20).",
      removeWhen: "Consolidated into a single search with multi-vector queries.",
    },
    {
      id: "retrieve-b", label: "Retrieve B", x: 435, y: 210, w: 110, h: 40, type: "store",
      what: "Vector search for query variant B.",
      why: "Diversifies the candidate pool beyond what a single embedding can reach.",
      fails: "Overlapping chunks with variant A inflate the merged pool.",
      tune: "top-k per variant; consider MMR (maximal marginal relevance) dedup.",
      removeWhen: "Same as Retrieve A — collapse into unified search.",
    },
    {
      id: "dedup", label: "Dedup / Merge", x: 620, y: 150, w: 110, h: 40, type: "process",
      what: "Deduplicates and merges results from all retrieve branches into one ranked list.",
      why: "Multiple retrieval calls produce overlapping chunks; dedup avoids redundancy.",
      fails: "Near-duplicate chunks (same content, different wording) survive dedup.",
      tune: "Similarity threshold for dedup; RRF vs. score-based merge strategy.",
      removeWhen: "Variants retrieve fully disjoint sets with no overlap.",
    },
    {
      id: "rerank", label: "Reranker", x: 785, y: 150, w: 110, h: 40, type: "process",
      what: "Cross-encoder reranks the merged candidate pool against the original query.",
      why: "Expansion improves recall; reranking restores precision on the original intent.",
      fails: "Expanded pool too large slows reranker; drift in variants biases reranker.",
      tune: "Rerank the top-30 from merge; discard below a score threshold.",
      removeWhen: "Merge output is already precise; latency budget is tight.",
    },
    {
      id: "llm", label: "LLM", x: 910, y: 150, w: 80, h: 40, type: "model",
      what: "Generates the final answer from the deduped, reranked context.",
      why: "Benefits from the broader recall that expansion unlocks.",
      fails: "Expanded context may include slightly off-topic chunks that confuse the model.",
      tune: "System prompt instruction to use only directly relevant context.",
      removeWhen: "Never.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "expander", payloadType: "query", speed: "fast" },
    { id: "e2", from: "expander", to: "retrieve-a", payloadType: "query", speed: "fast", via: { x: 350, y: 90 } },
    { id: "e3", from: "expander", to: "retrieve-b", payloadType: "query", speed: "fast", via: { x: 350, y: 210 } },
    { id: "e4", from: "retrieve-a", to: "dedup", payloadType: "chunk", speed: "medium", via: { x: 565, y: 150 } },
    { id: "e5", from: "retrieve-b", to: "dedup", payloadType: "chunk", speed: "medium", via: { x: 565, y: 150 } },
    { id: "e6", from: "dedup", to: "rerank", payloadType: "chunk", speed: "medium" },
    { id: "e7", from: "rerank", to: "llm", payloadType: "chunk", speed: "slow" },
    { id: "e8", from: "query", to: "rerank", payloadType: "query", speed: "fast", label: "original query", via: { x: 440, y: -50 } },
  ],
  patternCard: {
    bestFor: [
      "Ambiguous queries where users don't know the right vocabulary",
      "Broad research questions spanning multiple sub-topics",
      "Low-recall corpora where single-pass retrieval misses answers",
    ],
    pros: ["Big recall boost for vague or indirect queries", "Rescues prompts with poor vocabulary match"],
    cons: ["Multiple LLM calls for expansion add latency and cost", "Drift amplifies noise if not reranked"],
    failureModes: "Expanded queries drift intent; merged pool overwhelms dedup; reranker demotes the correct chunk.",
    costNotes: "2–4× retrieval cost. Extra LLM call for expansion adds ~$0.001–0.01.",
    latencyNotes: "Parallel retrieval helps; expansion LLM call adds 200–800ms.",
  },
}

// ─── Pattern 5: HyDE ─────────────────────────────────────────────────────────

const hyde: RagPattern = {
  id: "hyde",
  name: "HyDE",
  shortDesc: "Embed a hypothetical answer, not the query",
  viewBox: "0 0 900 180",
  nodes: [
    {
      id: "query", label: "User Query", x: 65, y: 90, w: 90, h: 40, type: "input",
      what: "The original user question, often conceptual or open-ended.",
      why: "Entry point — passed to the LLM to draft a hypothetical answer.",
      fails: "Very specific factual questions produce a hypothetical that misleads retrieval.",
      tune: "Use HyDE for conceptual queries; fallback to Vanilla for exact lookups.",
      removeWhen: "Never.",
    },
    {
      id: "hyp-gen", label: "LLM: Draft\nHypothetical", x: 230, y: 90, w: 130, h: 40, type: "model",
      what: "An LLM generates a plausible (but possibly wrong) answer to the query.",
      why: "A hypothetical answer in the corpus's vocabulary retrieves more relevant chunks than the raw query.",
      fails: "A confidently wrong hypothesis biases retrieval toward the wrong topic.",
      tune: "Temperature (0.3–0.7); constrain output length to 100–200 tokens.",
      removeWhen: "Queries are already well-formed and vocabulary-aligned with the corpus.",
    },
    {
      id: "embed-hyp", label: "Embed Hypothetical", x: 420, y: 90, w: 130, h: 40, type: "process",
      what: "Encodes the hypothetical answer (not the query) into a vector.",
      why: "The hypothetical is closer to the corpus's language than the original question.",
      fails: "Wrong hypothetical embeds near wrong chunks; garbage in, garbage out.",
      tune: "Same embedding model as the index. Consider averaging query + hypothetical vectors.",
      removeWhen: "Hypothetical quality is poor; use query embedding as fallback.",
    },
    {
      id: "search", label: "Vector Search", x: 610, y: 90, w: 120, h: 40, type: "store",
      what: "ANN search using the hypothetical answer's embedding as the query vector.",
      why: "The hypothetical embedding sits closer to real answer chunks in vector space.",
      fails: "Same failure as Vanilla if the hypothesis is off-topic.",
      tune: "top-k; consider returning both query-embed and hyp-embed results and merging.",
      removeWhen: "Hypothetical quality is consistently poor for your domain.",
    },
    {
      id: "llm", label: "LLM Final", x: 800, y: 90, w: 80, h: 40, type: "model",
      what: "Generates the final answer from the retrieved chunks (not from the hypothesis).",
      why: "Corrects any errors in the hypothesis; grounds the answer in real retrieved text.",
      fails: "If retrieved chunks contradict the hypothesis, the LLM may be confused.",
      tune: "System prompt: 'Use only the provided context. Ignore your prior knowledge.'",
      removeWhen: "Never.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "hyp-gen", payloadType: "query", speed: "fast" },
    { id: "e2", from: "hyp-gen", to: "embed-hyp", payloadType: "chunk", speed: "medium" },
    { id: "e3", from: "embed-hyp", to: "search", payloadType: "embedding", speed: "fast" },
    { id: "e4", from: "search", to: "llm", payloadType: "chunk", speed: "medium" },
    { id: "e5", from: "query", to: "llm", payloadType: "query", speed: "fast", label: "question", via: { x: 400, y: -80 } },
  ],
  patternCard: {
    bestFor: [
      "Conceptual or open-ended questions ('describe the mechanism of X')",
      "Corpora where query vocabulary doesn't match document vocabulary",
      "Zero-shot retrieval on new domains",
    ],
    pros: ["Improves retrieval when user wording is poor", "No index changes required — purely query-side"],
    cons: ["Wrong hypothesis biases retrieval", "Extra LLM call adds latency and cost"],
    failureModes: "Confident wrong hypothesis steers retrieval toward a plausible but incorrect topic.",
    costNotes: "1.5–2× vs. Vanilla due to the extra LLM call for hypothesis generation.",
    latencyNotes: "Hypothesis generation adds 300–1000ms. Run async if possible.",
  },
}

// ─── Pattern 6: Conversational RAG ───────────────────────────────────────────

const conversationalRag: RagPattern = {
  id: "conversational-rag",
  name: "Conversational RAG",
  shortDesc: "Condense chat history, then retrieve",
  viewBox: "0 0 880 280",
  nodes: [
    {
      id: "query", label: "Current Query", x: 85, y: 70, w: 120, h: 40, type: "input",
      what: "The latest user message that needs an answer right now.",
      why: "This is the active question that retrieval must ground.",
      fails: "If it is too short ('what about that?'), standalone retrieval fails.",
      tune: "Capture the latest turn verbatim before condensation.",
      removeWhen: "Never.",
    },
    {
      id: "history", label: "Chat History", x: 85, y: 160, w: 110, h: 40, type: "input",
      what: "The accumulated prior turns of the conversation.",
      why: "Provides context so the retrieval question reflects the full conversation state.",
      fails: "Long history exceeds context window; stale turns mislead the condenser.",
      tune: "Limit history to last N turns; summarise older turns into a rolling summary.",
      removeWhen: "Single-turn queries only — history adds no value.",
    },
    {
      id: "condenser", label: "Condenser", x: 265, y: 110, w: 120, h: 40, type: "model",
      what: "An LLM call that reformulates the latest question in light of the conversation history into a standalone query.",
      why: "Raw follow-up questions ('what about the second one?') are un-retrievable without context.",
      fails: "Condenser drops a constraint mentioned earlier; retrieves wrong topic.",
      tune: "Condensation prompt design; temperature low (0.1–0.2) for determinism.",
      removeWhen: "All user turns are already fully self-contained questions.",
    },
    {
      id: "retrieve", label: "Vector Retrieve", x: 445, y: 110, w: 120, h: 40, type: "store",
      what: "Standard ANN retrieval using the condensed standalone question.",
      why: "A clean, de-contextualised query retrieves accurately from the index.",
      fails: "Condensation error propagates here — wrong question → wrong chunks.",
      tune: "top-k; add hybrid retrieval if queries contain technical identifiers.",
      removeWhen: "Replaced by memory-augmented retrieval.",
    },
    {
      id: "llm", label: "LLM", x: 625, y: 110, w: 80, h: 40, type: "model",
      what: "Generates the answer using the condensed question, retrieved chunks, and abridged history.",
      why: "Has access to both retrieved facts and conversation state for coherent multi-turn responses.",
      fails: "Contradicts earlier answers if memory store is inconsistent.",
      tune: "History injection strategy: full vs. summary vs. key-facts-only.",
      removeWhen: "Never.",
    },
    {
      id: "answer", label: "Answer", x: 765, y: 110, w: 90, h: 40, type: "output",
      what: "The model's response, returned to the user and stored in memory.",
      why: "Output of the pipeline; also feeds the memory store for future turns.",
      fails: "Errors in this turn persist in memory and propagate to future turns.",
      tune: "Post-process to extract facts worth storing vs. transient phrasing.",
      removeWhen: "Never.",
    },
    {
      id: "memory", label: "Memory Store", x: 445, y: 215, w: 120, h: 40, type: "store",
      what: "Persistent store of key facts, constraints, and context extracted from prior turns.",
      why: "Avoids re-reading full history; keeps context compact for long sessions.",
      fails: "Accumulates wrong assumptions; over-fits to early turns; stale context.",
      tune: "Memory compaction strategy; TTL on stored facts; relevance scoring.",
      removeWhen: "Single-session, single-turn usage only.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "condenser", payloadType: "query", speed: "fast", via: { x: 165, y: 110 } },
    { id: "e2", from: "history", to: "condenser", payloadType: "query", speed: "fast", via: { x: 165, y: 150 } },
    { id: "e3", from: "condenser", to: "retrieve", payloadType: "query", speed: "fast" },
    { id: "e4", from: "retrieve", to: "llm", payloadType: "chunk", speed: "medium" },
    { id: "e5", from: "llm", to: "answer", payloadType: "chunk", speed: "medium" },
    { id: "e6", from: "answer", to: "memory", payloadType: "chunk", speed: "slow",
      path: "M 810,110 Q 810,215 505,215" },
    { id: "e7", from: "memory", to: "history", payloadType: "chunk", speed: "slow",
      path: "M 385,215 Q 85,215 85,180" },
    { id: "e8", from: "condenser", to: "llm", payloadType: "query", speed: "fast", label: "standalone query", via: { x: 455, y: 28 } },
  ],
  patternCard: {
    bestFor: [
      "Multi-turn support and troubleshooting threads",
      "Long research sessions where context accumulates",
      "Chatbots where follow-up questions reference earlier answers",
    ],
    pros: ["Keeps context without stuffing the full transcript", "Reduces token bloat on long sessions"],
    cons: ["Condensation can rewrite intent", "Memory can accumulate wrong assumptions over time"],
    failureModes: "Condenser drops a constraint from an earlier turn; memory anchors to a wrong early assumption.",
    costNotes: "1.5× vs. Vanilla: extra condensation call + memory read/write.",
    latencyNotes: "Condensation adds 300–800ms. Memory lookup is fast if cached.",
  },
}

// ─── Pattern 7: Router RAG ───────────────────────────────────────────────────

const routerRag: RagPattern = {
  id: "router-rag",
  name: "Router RAG",
  shortDesc: "Classify the query, route to the right source",
  viewBox: "0 0 940 320",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 160, w: 90, h: 40, type: "input",
      what: "Raw user question dispatched to the router for classification.",
      why: "Entry point — the router decides which retrieval source(s) to query.",
      fails: "Ambiguous queries confuse the router and land on the wrong source.",
      tune: "Add confidence threshold; require high-confidence for single-source routing.",
      removeWhen: "Never.",
    },
    {
      id: "router", label: "Router", x: 230, y: 160, w: 110, h: 40, type: "branch",
      what: "Classifies the query intent and dispatches to the appropriate retrieval source(s).",
      why: "Searching the wrong corpus wastes tokens and returns irrelevant results.",
      fails: "Low-confidence routing with no fallback silently returns bad results.",
      tune: "Confidence threshold; multi-label routing for broad queries; fallback policy.",
      removeWhen: "You only have one retrieval source.",
    },
    {
      id: "index-a", label: "Docs Index", x: 440, y: 80, w: 110, h: 40, type: "store",
      what: "Vector index of product documentation, wiki, or knowledge base.",
      why: "Best source for 'how do I' and conceptual questions about the product.",
      fails: "Returns outdated docs if index is stale.",
      tune: "Freshness-weighted retrieval; metadata filters (version, category).",
      removeWhen: "Queries routed here can be answered from a different, more authoritative source.",
    },
    {
      id: "index-b", label: "Code Index", x: 440, y: 160, w: 110, h: 40, type: "store",
      what: "Vector index of source code, READMEs, or technical specs.",
      why: "Provides implementation-level answers that docs can't give.",
      fails: "Code chunks lack natural language explanation; LLM misinterprets.",
      tune: "Include docstrings and inline comments in chunks; code-aware embeddings.",
      removeWhen: "No code corpus; users don't ask implementation questions.",
    },
    {
      id: "sql", label: "SQL / API", x: 440, y: 240, w: 110, h: 40, type: "store",
      what: "Structured data source queried via generated SQL or tool call.",
      why: "Metrics, counts, and structured lookups are better answered from a DB than a vector index.",
      fails: "LLM-generated SQL is wrong; DB schema mismatch.",
      tune: "Schema context injection; constrained SQL generation.",
      removeWhen: "All data is unstructured; no tabular source exists.",
    },
    {
      id: "merge", label: "Merge", x: 630, y: 160, w: 90, h: 40, type: "process",
      what: "Combines results from whichever source(s) the router selected.",
      why: "Broad queries may fan out to multiple sources; results need merging before LLM.",
      fails: "Heterogeneous result formats (chunks vs. SQL rows) are hard to merge cleanly.",
      tune: "Normalise result format before merging; add source attribution.",
      removeWhen: "Router always selects exactly one source.",
    },
    {
      id: "llm", label: "LLM", x: 800, y: 160, w: 80, h: 40, type: "model",
      what: "Generates the final answer from the routed and merged context.",
      why: "Receives context from the most relevant source — higher signal than searching everything.",
      fails: "Routing error propagates: wrong source, wrong context, wrong answer.",
      tune: "Include source attribution in system prompt for transparency.",
      removeWhen: "Never.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "router", payloadType: "query", speed: "fast" },
    { id: "e2", from: "router", to: "index-a", payloadType: "query", speed: "fast", via: { x: 350, y: 80 } },
    { id: "e3", from: "router", to: "index-b", payloadType: "query", speed: "fast" },
    { id: "e4", from: "router", to: "sql", payloadType: "query", speed: "fast", via: { x: 350, y: 240 } },
    { id: "e5", from: "index-a", to: "merge", payloadType: "chunk", speed: "medium", via: { x: 580, y: 80 } },
    { id: "e6", from: "index-b", to: "merge", payloadType: "chunk", speed: "medium" },
    { id: "e7", from: "sql", to: "merge", payloadType: "chunk", speed: "medium", via: { x: 580, y: 240 } },
    { id: "e8", from: "merge", to: "llm", payloadType: "chunk", speed: "medium" },
  ],
  patternCard: {
    bestFor: [
      "Multiple corpora: product docs + Jira + runbooks + policies",
      "Teams where each data source has different retrieval characteristics",
      "Reducing context noise by searching only the relevant source",
    ],
    pros: ["Avoids polluting context with irrelevant sources", "Each source can be optimised independently"],
    cons: ["Routing mistakes are catastrophic — wrong source, no recovery", "Adds classification latency"],
    failureModes: "Low-confidence route with no fallback silently returns results from the wrong corpus.",
    costNotes: "Router classification adds ~$0.0005. Only the routed source(s) are queried.",
    latencyNotes: "Classification adds 50–200ms. Parallel source querying reduces total latency.",
  },
}

// ─── Pattern 8: Iterative / Corrective RAG ───────────────────────────────────

const iterativeRag: RagPattern = {
  id: "iterative-rag",
  name: "Iterative / Corrective RAG",
  shortDesc: "Retrieve, draft, critique, refine — repeat",
  viewBox: "0 0 880 280",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 110, w: 90, h: 40, type: "input",
      what: "The original user question, often complex or multi-hop.",
      why: "Entry point — seeds the first retrieval pass.",
      fails: "Poorly-formed queries produce weak initial retrieval that the critic can't rescue.",
      tune: "Pre-process query into sub-questions for iterative answering.",
      removeWhen: "Never.",
    },
    {
      id: "retrieve", label: "Retrieve", x: 230, y: 110, w: 100, h: 40, type: "store",
      what: "Standard retrieval pass against the index.",
      why: "Provides the initial evidence base for draft generation.",
      fails: "Sparse corpus: relevant content doesn't exist; loop runs indefinitely.",
      tune: "Vary retrieval strategy per iteration (different k, different query rewrite).",
      removeWhen: "Never — this is the evidence-gathering step.",
    },
    {
      id: "draft", label: "Draft Answer", x: 400, y: 110, w: 110, h: 40, type: "model",
      what: "LLM generates a candidate answer from the current retrieval context.",
      why: "Provides a concrete answer for the critic to evaluate.",
      fails: "LLM confidently produces a wrong draft; critic can't detect it.",
      tune: "Prompt the LLM to highlight uncertain claims for critic review.",
      removeWhen: "Never — the draft is what the critic evaluates.",
    },
    {
      id: "critic", label: "Critic", x: 570, y: 110, w: 100, h: 40, type: "process",
      what: "Evaluates the draft against the retrieved context — checks faithfulness, completeness, and confidence.",
      why: "Catches hallucinations and gaps before the final answer is returned.",
      fails: "Critic is itself an LLM that can fail to detect subtle errors.",
      tune: "Structured critique format; confidence score threshold for acceptance.",
      removeWhen: "Answer quality is consistently high without it; latency budget is tight.",
    },
    {
      id: "output", label: "Final Answer", x: 750, y: 110, w: 100, h: 40, type: "output",
      what: "The accepted answer returned to the user after critic approval.",
      why: "Only returned when the critic is satisfied — higher quality guarantee.",
      fails: "If the loop never converges, a max-iterations fallback is needed.",
      tune: "Set a max iteration count (2–3); use the best draft if limit is reached.",
      removeWhen: "Never.",
    },
    {
      id: "refine", label: "Refine Query", x: 400, y: 220, w: 120, h: 40, type: "process",
      what: "Uses critic feedback to rewrite the retrieval query for the next iteration.",
      why: "If the first retrieval was insufficient, a new query strategy may find better evidence.",
      fails: "Query rewrite loops in circles; retrieves the same bad chunks repeatedly.",
      tune: "Inject specific critic feedback into the rewrite prompt; track seen query variants.",
      removeWhen: "If critic acceptance rate is already high on first pass.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "retrieve", payloadType: "query", speed: "fast" },
    { id: "e2", from: "retrieve", to: "draft", payloadType: "chunk", speed: "medium" },
    { id: "e3", from: "draft", to: "critic", payloadType: "chunk", speed: "medium", label: "draft" },
    { id: "e4", from: "critic", to: "output", payloadType: "chunk", speed: "medium", label: "accepted" },
    { id: "e5", from: "critic", to: "refine", payloadType: "score", speed: "slow", label: "weak",
      path: "M 620,110 Q 620,220 460,220" },
    { id: "e6", from: "refine", to: "retrieve", payloadType: "query", speed: "medium",
      path: "M 340,220 Q 230,220 230,130" },
    { id: "e7", from: "retrieve", to: "critic", payloadType: "chunk", speed: "medium", label: "evidence", via: { x: 415, y: 22 } },
  ],
  patternCard: {
    bestFor: [
      "Complex multi-hop questions requiring evidence synthesis",
      "Sparse corpora where first-pass retrieval often misses",
      "High-stakes domains where hallucination cost is high",
    ],
    pros: ["Self-correcting: bad drafts trigger re-retrieval", "Catches hallucinations before user sees them"],
    cons: ["High latency: each iteration adds a full retrieve + draft + critic cycle", "Risk of infinite loop on sparse corpora"],
    failureModes: "Loop fails to converge; critic is itself unreliable; corpus has no answer and loop runs to limit.",
    costNotes: "2–4× vs. Vanilla per iteration. Cap iterations at 2–3.",
    latencyNotes: "Each iteration adds 1–3s. Total: 3–10s for 2-iteration run.",
  },
}

// ─── Pattern 9: Graph RAG ─────────────────────────────────────────────────────

const graphRag: RagPattern = {
  id: "graph-rag",
  name: "Graph RAG",
  shortDesc: "Traverse entity relationships, summarise communities",
  viewBox: "0 0 900 280",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 140, w: 90, h: 40, type: "input",
      what: "User question, often about relationships, hierarchies, or connected concepts.",
      why: "Entry point — entity extraction pulls named concepts for graph traversal.",
      fails: "Queries with no entity hooks produce empty graph traversal paths.",
      tune: "Add entity linking and disambiguation before extraction.",
      removeWhen: "Never.",
    },
    {
      id: "entity", label: "Entity Extract", x: 235, y: 140, w: 130, h: 40, type: "process",
      what: "Extracts named entities and concepts from the query for graph lookup.",
      why: "Graph traversal requires seed nodes; entity extraction identifies them.",
      fails: "Incorrect entity recognition anchors traversal on the wrong node.",
      tune: "NER model quality; coreference resolution for pronoun-heavy queries.",
      removeWhen: "Replaced by direct graph embedding lookup.",
    },
    {
      id: "graph-trav", label: "Graph Traversal", x: 440, y: 80, w: 130, h: 40, type: "store",
      what: "Traverses the knowledge graph from seed entities, collecting related nodes and edges.",
      why: "Captures relationships that chunk-based retrieval misses (A causes B; B depends on C).",
      fails: "Dense graph produces too many hops; context window overflow.",
      tune: "Max hop depth (2–3); relationship type filters; community detection.",
      removeWhen: "Data has no meaningful relational structure.",
    },
    {
      id: "vec-search", label: "Vector Search", x: 440, y: 200, w: 130, h: 40, type: "store",
      what: "Standard ANN retrieval running in parallel with graph traversal.",
      why: "Supplements graph paths with local text chunks that have no graph representation.",
      fails: "Same as Vanilla RAG if graph traversal returns the only relevant context.",
      tune: "top-k balanced against graph result volume.",
      removeWhen: "Graph alone covers all required context.",
    },
    {
      id: "summaries", label: "Community\nSummaries", x: 650, y: 140, w: 130, h: 40, type: "process",
      what: "Pre-computed or on-the-fly summaries of entity communities merged with local chunks.",
      why: "Converts raw graph paths and chunks into coherent, LLM-digestible context.",
      fails: "Summary quality depends on community detection quality; stale if graph changes.",
      tune: "Summary granularity (coarse community vs. sub-community); freshness policy.",
      removeWhen: "Graph is small enough to pass raw paths to the LLM directly.",
    },
    {
      id: "llm", label: "LLM", x: 840, y: 140, w: 80, h: 40, type: "model",
      what: "Generates the answer from graph-derived summaries and local text chunks.",
      why: "Benefits from relational context that flat chunk retrieval can't provide.",
      fails: "Graph summaries contain irrelevant community nodes that confuse the model.",
      tune: "System prompt to reason over relationships explicitly.",
      removeWhen: "Never.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "entity", payloadType: "query", speed: "fast" },
    { id: "e2", from: "entity", to: "graph-trav", payloadType: "query", speed: "medium", via: { x: 355, y: 80 } },
    { id: "e3", from: "query", to: "vec-search", payloadType: "query", speed: "fast", via: { x: 255, y: 240 } },
    { id: "e4", from: "graph-trav", to: "summaries", payloadType: "chunk", speed: "slow", via: { x: 585, y: 80 } },
    { id: "e5", from: "vec-search", to: "summaries", payloadType: "chunk", speed: "medium", via: { x: 585, y: 200 } },
    { id: "e6", from: "summaries", to: "llm", payloadType: "chunk", speed: "medium" },
  ],
  patternCard: {
    bestFor: [
      "Connected knowledge: org charts, codebases, scientific literature",
      "Questions about relationships, causes, hierarchies, or impact chains",
      "Corpora where entities are cross-referenced across many documents",
    ],
    pros: ["Captures relationships chunk-based RAG structurally misses", "Community summaries compress large graph contexts"],
    cons: ["Complex to build and maintain", "Graph construction and community detection are expensive upfront"],
    failureModes: "Dense graph traversal overflows context; community summaries mix unrelated entities.",
    costNotes: "High upfront: graph construction + community pre-computation. Runtime: 1.5–3× Vanilla.",
    latencyNotes: "Graph traversal adds 200–800ms. Pre-computed summaries reduce runtime latency.",
  },
}

// ─── Pattern 10: Structured (SQL / Tool-first) RAG ───────────────────────────

const structuredRag: RagPattern = {
  id: "structured-rag",
  name: "Structured RAG",
  shortDesc: "LLM generates SQL or tool calls for tabular data",
  viewBox: "0 0 960 200",
  nodes: [
    {
      id: "query", label: "User Query", x: 70, y: 100, w: 90, h: 40, type: "input",
      what: "User question about metrics, counts, records, or structured data.",
      why: "Entry point — routed here because structured retrieval is appropriate.",
      fails: "Ambiguous query leads to wrong SQL; NL to SQL translation fails silently.",
      tune: "Pre-classify query as structured vs. unstructured before routing here.",
      removeWhen: "Never.",
    },
    {
      id: "schema", label: "Schema Context", x: 225, y: 100, w: 120, h: 40, type: "store",
      what: "Database schema, table descriptions, and column metadata injected into the LLM prompt.",
      why: "The LLM needs schema to generate valid, accurate SQL.",
      fails: "Incomplete or misleading schema descriptions cause wrong table/column selection.",
      tune: "Include example rows; add semantic column descriptions; use schema compression for large DBs.",
      removeWhen: "Never — SQL generation without schema is unreliable.",
    },
    {
      id: "llm-gen", label: "LLM: Generate\nSQL / Tool Call", x: 410, y: 100, w: 140, h: 40, type: "model",
      what: "LLM generates a SQL query or structured API/tool call from the user question and schema.",
      why: "Translates natural language into a precise, executable query against structured data.",
      fails: "Incorrect JOIN logic, wrong aggregation, or hallucinated column names.",
      tune: "Few-shot SQL examples; constrained generation; SQL linter post-processing.",
      removeWhen: "Replaced by a fine-tuned Text-to-SQL model for the specific schema.",
    },
    {
      id: "execute", label: "Execute Query", x: 610, y: 100, w: 120, h: 40, type: "process",
      what: "Runs the generated SQL against the database or calls the specified tool.",
      why: "Retrieves the actual structured data that answers the user's question.",
      fails: "SQL error at runtime; timeout on large tables; permission denied.",
      tune: "Query timeout limits; read-only DB user; row-limit guards.",
      removeWhen: "Never — this step produces the actual answer data.",
    },
    {
      id: "llm-final", label: "LLM: Format\nAnswer", x: 800, y: 100, w: 130, h: 40, type: "model",
      what: "Generates a natural language answer from the structured query results.",
      why: "Converts raw SQL results into a readable, contextualised response for the user.",
      fails: "Misinterprets large result sets; invents data not in the result.",
      tune: "Cap result rows passed to LLM; include units and field descriptions.",
      removeWhen: "User prefers raw tabular output; downstream system handles formatting.",
    },
  ],
  edges: [
    { id: "e1", from: "query", to: "llm-gen", payloadType: "query", speed: "fast", via: { x: 200, y: 0 } },
    { id: "e2", from: "schema", to: "llm-gen", payloadType: "chunk", speed: "medium" },
    { id: "e3", from: "llm-gen", to: "execute", payloadType: "sql", speed: "fast" },
    { id: "e4", from: "execute", to: "llm-final", payloadType: "chunk", speed: "medium", label: "results" },
    { id: "e5", from: "query", to: "llm-final", payloadType: "query", speed: "fast",
      path: "M 115,100 C 115,150 320,150 530,150 C 640,150 700,135 735,110" },
  ],
  patternCard: {
    bestFor: [
      "Metrics, counts, aggregations, and record lookups",
      "CRM, analytics, finance, or inventory data",
      "Questions answerable only from a structured database",
    ],
    pros: ["Exact answers from authoritative structured data", "No hallucination on numeric facts when SQL is correct"],
    cons: ["SQL generation errors are silent and hard to detect", "Schema management overhead"],
    failureModes: "Incorrect SQL runs successfully but returns the wrong answer; LLM confidently presents wrong data.",
    costNotes: "Two LLM calls. SQL execution cost depends on query complexity.",
    latencyNotes: "SQL generation adds 300–800ms. DB execution varies (10ms–10s).",
  },
}

// ─── Exported array (selector order) ─────────────────────────────────────────

export const RAG_PATTERNS: RagPattern[] = [
  vanillaRag,
  hybridRag,
  rerankFirstRag,
  queryExpansion,
  hyde,
  conversationalRag,
  routerRag,
  iterativeRag,
  graphRag,
  structuredRag,
]
