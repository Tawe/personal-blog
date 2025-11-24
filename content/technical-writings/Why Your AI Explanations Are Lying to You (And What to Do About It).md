---
title: "Why Your AI Explanations Are Lying to You (And What to Do About It)"
subtitle: "Why SHAP Values and Attention Maps Mislead You"
date: "2025-10-30"
excerpt: "AI explanations often sound confident, but are they true? This piece explores when to trust them, when not to, and what really builds reliability."
tags: ["AI", "Explainability", "Machine Learning", "Model Interpretability", "LLM"]
reading_time: 6
featured_image: /theillusionofexplainability.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/the-illusion-of-explainability-921e409fc0b4
devto_link: 
substack:
code_languages: []
draft: false
---

You asked the model why it made that decision.  
It gave you an answer, coherent, confident, and convincing.

But here’s the problem: it might not be true.

In the rush to make AI feel understandable, we’ve built a strange new layer of storytelling. One where explanations aren’t always rooted in reasoning, but in plausibility. Where the line between _interpretable_ and _justified_ has quietly blurred.

And the tools we use to decode AI behavior? They’re often imperfect, frequently helpful, and occasionally misleading, but rarely definitive.

## The Rise of Explainability Theater

We want to believe we can understand our models. Tools like SHAP values, LIME, and attention heatmaps promise just that: visualizations and metrics that suggest _why_ a model made a particular decision. But many of these tools operate **after the fact**, approximating influence rather than tracing actual causality.

This can result in post hoc rationalization, more like a story crafted to fit the outcome than a provable insight into the decision-making process itself. These techniques often provide _correlations_ that can be useful, but they don’t always reflect the full internal logic of the model.

Take SHAP, for example: it might tell you that “Feature A contributed 62% to the model’s decision,” but that percentage is a modeled approximation, not a direct reading from the model’s architecture. In some cases, especially with complex or sparse feature spaces, this attribution can shift significantly with slight perturbations. SHAP’s reliability varies significantly by context — it can be quite stable for tree-based models with structured data, but may be brittle for complex neural networks with high-dimensional or sparse features.

Similarly, attention heatmaps have been criticized for not aligning with causal influence, but in certain transformer tasks like translation or summarization, they have been shown to highlight useful linguistic relationships.

Also worth mentioning are gradient-based methods like Integrated Gradients, which attempt to trace contribution paths through a model’s activations during inference. These offer a different lens than SHAP or LIME, and can be more faithful for deep neural networks under certain conditions.

In short, these tools offer **valuable perspectives**, not absolute truths. When used well, by experts who understand the model, data, and domain, they can highlight potential failure modes or confirm suspicions. When over-trusted or used for surface-level narratives, they risk becoming clarity theater.

## LLMs: Masters of Plausible Explanation

Language models complicate this picture further. When asked, “Why did you do that?” they respond with something that _sounds_ like a justification. But unlike humans, they don’t transparently reconstruct intent, they generate forward from patterns.

These “explanations” are just more completions, influenced by prompt phrasing, recent tokens, temperature settings, and training data bias. They are not mirrors of internal reasoning but shadows of external expectation.

For example: ask an LLM why it chose to sort a list using `.sort()` instead of writing a bubble sort. It might say, “Because `.sort()` is more efficient and readable.” Sounds good. But ask again with a prompt that praises bubble sort and it might reply, “Bubble sort was used because it offers clearer logic for educational purposes.” Two completely different rationales, neither driven by model intent.

That doesn’t mean LLMs are incapable of reasoning. In fact, chain-of-thought prompting, self-reflection mechanisms, and approaches like Constitutional AI attempt to scaffold models toward more structured reasoning. But these explanations are still **constructs**, not confessions.

So while some LLM-generated rationales can be enlightening, especially when used to debug, refine prompts, or support user trust, they should not be treated as ground truth. They are better seen as **interpretive artifacts**, shaped by training and context.

## False Trust Is Worse Than No Trust

One real-world example illustrates this risk vividly, and shows how seemingly plausible explanations can obscure deep structural harm. In 2019, a healthcare risk prediction model used across U.S. hospitals was found to systematically underestimate the care needs of Black patients. The model’s post-hoc explanations pointed to “healthcare cost” as the primary driver of risk, an input that appeared neutral. But in reality, Black patients often incurred lower healthcare costs due to systemic access issues, not because they were healthier. The explanation seemed plausible. The outcome was racially biased. And the justification cloaked the harm.

This case is a textbook example of moral outsourcing: stakeholders relied on the model’s explanation to justify downstream decisions, even though the rationale masked underlying bias. That said, it’s worth noting that the harm may have persisted even without those explanations, the deeper issue lay in flawed proxy selection and societal inequities baked into the data.

(Reference: Obermeyer et al., 2019 — _Dissecting racial bias in an algorithm used to manage the health of populations_, Science.)

The danger isn’t just academic. In high-stakes environments like healthcare, finance, hiring, or compliance, decision-makers rely on explanations to validate outputs. But if those explanations are simulations, not reflections, we risk basing serious decisions on illusions.

A shiny dashboard with model outputs and a sidebar saying “this decision was influenced by feature X” feels trustworthy. But it may simply be a statistical coincidence, a guess dressed in certainty.

This creates a kind of moral outsourcing: “The model explained itself, so we can act on it.” But if the explanation is wrong, we’re no better off than if we had no visibility at all.

To visualize this, consider the **Explainability Tradeoff Triangle**:

       Narrative  
        /     \  
       /       \  
   Trust —— Signal

You can’t fully optimize for all three. If your explanation prioritizes **narrative,** making it easily understood. It may sacrifice **signal** (accurately identifying the model’s true influences) or **trust** (ensuring those influences are stable and testable).

This triangle is meant to provoke reflection, not prescribe a formula. To illustrate:

- **Narrative-first** explanations are often critical in user-facing applications like voice assistants or chatbots, where clarity and confidence drive trust and engagement, even if the fidelity of the explanation is imperfect.
- **Signal-first** approaches matter most during model development or auditing — when understanding true causal influence is essential, even if those insights are difficult to communicate clearly.
- **Trust-first** scenarios arise in high-stakes domains like healthcare, finance, or law, where repeatability, fairness, and robustness outweigh interpretability or story coherence.

Knowing _what you’re optimizing for,_ and _what you’re willing to trade off,_ is more important than pretending you can have it all.

## What You Can Actually Trust

Explainability isn’t useless, but it must be used responsibly, with full awareness of its limitations.

### 1. Behavioral Testing

Instead of asking the model why, **observe how it behaves under stress**. Modify inputs, add noise, test edge cases. Look for consistency, not narrative.

### 2. Mechanistic Interpretability (Where Possible)

For smaller or custom models, teams are building tools to trace circuits and neuron activations. Recent work from labs like Anthropic has made initial progress applying these techniques to larger models, though significant challenges remain.

### 3. Prompt Observability

Track what the model actually saw. Tools like prompt history, system prompt overlays, and token-by-token visualization can reveal surprising context pollution or tool interference.

### 4. Human Context

Always pair interpretability tools with human domain knowledge. Explanations should augment judgment, not replace it.

## Closing Thought: Trust the System, Not the Story

The stories models tell about their behavior are often elegant, convincing, and occasionally useful, but often incomplete. They satisfy our craving for narrative without satisfying our need for truth.

Real trust isn’t built on how good an explanation sounds, it’s built on how consistent and verifiable the system behaves over time.

So the next time a model tells you why it did something, pause. Ask how you’d know if that answer were wrong. Then start building _that_ kind of system.

Because explainability doesn’t mean safety. And stories don’t mean understanding.

Evidence does.