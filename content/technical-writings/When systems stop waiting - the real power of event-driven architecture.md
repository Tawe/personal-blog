---
title: "When systems stop waiting: the real power of event-driven architecture"
subtitle: "How decoupled design turns microservice chaos into sustainable flow"
date: "2025-10-30"
excerpt: "Discover how event-driven architecture transforms tightly coupled microservices into resilient, autonomous systems using SNS, SQS, and EventBridge to create scalable, asynchronous flow."
tags: ["Software Architecture", "Event Driven Architecture", "System Design Concepts", "Software Development", "Microservices"]
reading_time: 4
featured_image: /Whensystemsstopwaiting.png?height=400&width=800
medium_link: https://medium.com/@johnmunn/when-systems-stop-waiting-the-real-power-of-event-driven-architecture-c6a7c0a45058
devto_link: 
substack:
code_languages: []
draft: false
---

You did it. After a year of work, your team finally migrated the old monolith into small, scalable microservices. The architecture diagram looks neat, boxes aligned, arrows between services. But something feels off.

As you stare at the dependency graph, you realize how coupled everything still is. Every service knows about three others. Half of them can’t start until another finishes. The latency graphs tell the truth: you didn’t break up the monolith; you just distributed it, with extra network hops.

Did you just build a microservices monolith, with added latency?

That’s where event-driven architecture offers a different contract: connect without coordinating every call.

## The shift: from command to collaboration

In request-driven systems, services depend on each other’s timing. One slow API call drags the whole chain. In EDA, services communicate without coordination. A producer emits an event, such as “OrderPlaced,” and any interested service reacts. No waiting for replies, no direct coupling.

A simple event might look like this:


```json
{  
  "eventType": "OrderPlaced",  
  "timestamp": "2025-10-29T14:32:00Z",  
  "data": {  
    "orderId": "A12345",  
    "customerId": "C789",  
    "total": 94.50,  
    "currency": "USD"  
  }  
}
```

A Payment service might pick this up to charge the card, while an Inventory service decrements stock, all without knowing each other exists.

That single change, broadcast instead of request, reshapes everything. Services no longer need to know who’s listening. They only need to report what happened.

## The AWS building blocks: SNS, SQS, and EventBridge

In AWS, three managed services cover the core responsibilities:

- SNS (Simple Notification Service): high-fan-out publish/subscribe. Producers publish once; many subscribers receive.
- SQS (Simple Queue Service): durable buffering, retries, and back-pressure. Consumers pull at their own pace.
- EventBridge: routing and filtering across services and accounts, with schema discovery and rules.

Together, they enable decoupled producers and consumers that scale independently and degrade gracefully when parts of the system are unavailable.

## Why teams choose EDA

- Scalability through decoupling. Each service grows independently.
- Fault tolerance. A downstream failure doesn’t block upstream work.
- Flexibility. Add or remove consumers without rewriting producers.
- Transparency. Events record facts, what happened, not instructions.

EDA is as much about operating model as technology: teams commit to clear contracts and accept eventual completion rather than synchronous certainty.

## The hidden costs

EDA doesn’t remove complexity; it moves it.

1. Observability. Each event can traverse multiple queues and consumers. Without correlation IDs and tracing, root cause analysis is guesswork.
2. Schema management. Events evolve. A missing key or added field can break consumers that were never updated. For example, a Payment service expects `customerId` but suddenly receives `userId` after a schema update, orders succeed, but payments silently fail for two hours before monitoring catches the discrepancy.
3. Testing. Unit tests miss asynchronous race conditions. Event replay and contract tests become essential.

You gain flexibility, but you owe the system clarity. Documentation, versioning, and discipline replace direct calls and control.

## Messaging vs. streaming: the Kafka tradeoff

When your events need to outlive the systems that produce or consume them, you move from messaging to streaming.

Kafka sits here, not as an alternative to SNS/SQS, but as the long-term memory of your event system.

- _SNS/SQS/EventBridge:_ operational simplicity, eventual delivery, lower cost.
- _Kafka:_ retention, replay, ordering, operational overhead.

Kafka fits when:

- Ordering and replay are business-critical.
- Multiple consumers need to process the same stream in different ways.
- Data pipelines, analytics, or stream processing drive the product.

Mature architectures often mix both: SNS for fan-out, SQS for buffering, EventBridge for routing, Kafka for long-lived streams and analytics.

## When microservices come home, the modular monolith

Event-driven systems often begin as fleets of microservices, each with its own repo, pipeline, and data store. The dream is independence. The reality, sometimes, is orchestration fatigue.

A new feature crosses three repos, two contracts, and a queue. A schema update becomes a negotiation. The system still works, but every step is slower.

Some teams bring the architecture back home as a modular monolith: the same domain boundaries and events, inside one deployable. Modules publish and subscribe internally, without network latency or distributed failure modes.

Microservices aren’t a mistake; they’re a cost model. When autonomy and scale outweigh complexity, they shine. When speed, cohesion, and visibility matter more, modular monoliths win by subtraction. The skill is knowing when autonomy stops paying for itself.

## The human architecture

Event-driven systems work best when teams act like autonomous services: clear interfaces, no hidden dependencies, and trust that others will handle their events.

That means publishing documentation as faithfully as code, designing for consumption rather than control, and building observability into every interaction.

The healthiest event systems aren’t just loosely coupled technically, they’re built by teams comfortable giving up control. When engineers share ownership of events, they stop designing for hierarchy and start designing for flow.

## Closing

When systems stop waiting for permission, they cope better with spikes, failures, and change. Event-driven design won’t make systems simple, but it makes them resilient in the ways that matter.

The next time something fails and the rest of the platform keeps working, that’s the architecture doing its job.