---
title: "Keep Simple Things Simple. Let Complex Things Earn Their Complexity."
subtitle: "Why most systems get complicated long before they need to"
date: "2026-05-07"
updated: "2026-05-13"
description: "Most systems get complicated too early. This explores why teams overbuild, how complexity creeps in, and when it’s actually worth it."
excerpt: "Most systems get complicated too early. This explores why teams overbuild, how complexity creeps in, and when it’s actually worth it."
tags: ["Software Architecture", "Engineering Leadership", "Complexity", "Developer Experience", "Technical Strategy", "Systems Thinking", "AI"]
reading_time: 8
featured_image: /keep-simple-things-simple.png?height=630&width=1200
medium_link: https://medium.com/@johnmunn/keep-simple-things-simple-let-complex-things-earn-their-complexity-c51dff7a826c
code_languages: []
draft: false
---

I keep coming back to the same idea.

> _Keep simple things simple and let complex things earn their complexity._

I did not really set out with that in mind, but the more I think about it, the more it feels like it makes sense. I am not against complexity at all. Some problems are very hard, some systems need real sophistication, and sometimes you just do not get a choice.

What I have seen more often, though, is complexity showing up before the problem actually needs a complex solution. After a while you start to recognize the pattern. Things get harder not because the business needed it, but because someone wanted to work on something more interesting.

## The Gatsby Lesson

Several years ago we decided to try headless WordPress. This was back when Gatsby.js was one of the main options and well before Next.js became the default solution for this kind of work.

We pulled it into our stack and started building sites with it, even though, in hindsight, it was early enough that the Gatsby team probably would have told us to wait before using it in production.

The thing is, the sites we were building were not complicated. They were mostly brochure-style sites on WordPress with Timber and Twig, and they all sat behind a CDN. We already had something fast and predictable, as well as a tech stack the team actually understood end to end.

Nothing was broken with the sites, but the newer approach felt more modern and more aligned with where the industry seemed to be heading, so we went ahead anyway.

The system did not just collapse, but it did degrade over time as build times ticked up, edge cases started appearing in deployments, and debugging became harder because the surrounding ecosystem was not mature. We were dealing with all of that with only a couple of people on the team who really understood how Gatsby worked.

The part that really sucked was that the friction and instability did not just make development harder. It changed the level of faith the rest of the business had in our engineering department. We had promised better performance and easier-to-work-with sites. We delivered none of this.

Looking back, the uncomfortable part is that we did not introduce that complexity to solve a real problem. We took something that was already working and made it harder to work with, mostly because Gatsby felt more interesting than our old approach.

## Complexity Often Arrives Socially Before It Arrives Technically

I think this is where a lot of organizations get themselves into trouble.

Complexity does not always enter because systems demand it. More often than not, it shows up when people get restless with the ordinary work of maintaining stable systems and start looking for something that feels more interesting to work on.

When the bread-and-butter work starts to feel routine, there is a shift that happens in the team. People start wanting to try something new or pull in a tool they saw somewhere, and before long you are making decisions based more on what feels interesting than what is actually needed.

You see a version of this everywhere once you start looking for it. Teams reach for Kubernetes before they need it. Products that are still pretty linear end up with event-driven architectures. AI features show up in tools because, apparently, everything needs a chatbot nowadays.

The tricky part is that complexity can look impressive. It reads as sophisticated and modern, which makes it harder to question, even when it is not really improving anything.

We need to remember that complexity is never free. Each abstraction layer adds another place where ownership can fail. Workflows add coordination overhead, and new systems come with operational weight that someone has to carry.

Eventually, simple things start becoming surprisingly hard, and that is usually the point where you realize something drifted further than it should have.

## You Can Feel It When Simplicity Is Gone

One of the clearest signs of unnecessary complexity is when basic work suddenly requires navigating systems instead of solving problems.

You look at a task and it feels harder than it should be. That usually shows up in ways you cannot ignore, like when something simple turns into a chain of steps and dependencies that were never part of the original problem. Sometimes onboarding drags on for weeks because the local environment depends on a dozen interconnected services that all have to be understood before anything works.

Sometimes a deployment needs approvals and extra steps just to fix something small. Or a developer hits an issue and realizes only a couple of people can understand the system and what is happening. Or departments stop talking directly and everything gets routed through a ticketing system that was supposed to make things easier.

You can often measure organizational complexity by watching how basic communication flows.

If someone from Department A cannot walk over and talk directly to Department B, and instead has to go through managers, tickets, portals, workflows, or layers of process, complexity has entered the system.

Now, sometimes that complexity is necessary, especially as scale increases, compliance requirements grow, and organizations become more distributed, which naturally introduces more structure whether you intend it or not.

But the important question is always:

> _Is this complexity solving a real problem, or are we maintaining complexity because it already exists?_

That ends up being a very different kind of conversation when you actually think about it.

## Complexity Should Match the Shape of the Problem

When I talk about simplicity, I do not mean stripping everything down to the bare minimum or pretending hard problems do not exist. Some systems absolutely outgrow simpler approaches.

I worked on projects involving live game data flowing across dozens of websites where different sites needed different subsets of information delivered in near real time. At that point, introducing things like message queues and more advanced infrastructure actually made sense because the problem itself had changed shape. The old approaches were starting to crack under the pressure.

That difference shows up pretty clearly when you have been on both sides of it.

It was one of those cases where the complexity was not coming from some big forward-looking idea. It was just the system reacting to what the problem had actually become.

To me, simplicity really just means the solution fits the problem cleanly. You are not adding extra systems, abstractions, workflows, or operational burden unless the pressure of the problem genuinely requires them.

You start noticing the same kinds of patterns repeating, things like scaling bottlenecks, production getting a bit more fragile, issues that take longer to track down, and infrastructure costs creeping up. You also feel it in deployments getting riskier and coordination taking more effort than it used to.

At some point the existing approach just stops fitting the problem. You feel it in the friction, in the workarounds, in that nagging sense that things that used to be straightforward now take more effort than you expect. That is usually when adding complexity starts to make sense. Not because it is interesting, but because the problem has changed and the old way is starting to become too simple to handle it.

## AI Is About to Accelerate This Problem

I think AI is going to make this worse. Not because there is anything inherently wrong with the technology, but because it removes a lot of the friction that used to slow complexity down.

In the past, adding a new layer or system took time, people who actually understood it, and the effort to keep the whole thing running day to day, which meant you felt the cost early. Now you can generate whole systems, stitch together integrations, or even spin up infrastructure almost instantly, so it is much easier to introduce something complicated without really noticing what you have taken on.

You can already see it in how products are evolving. Features get added because they are available, not because anyone stopped to ask if they were needed. Like bolting a chatbot onto something so users can ask questions the interface should answer on its own.

At the same time, the tools developers use make it easier to add systems they do not fully understand, which means the complexity shows up both in the code itself and in how many moving pieces get introduced at once.

It all looks productive in the moment. The code compiles, everything looks fine on the surface. Underneath, ownership starts to muddle, the architecture drifts a bit, and over time people understand less of the system until you end up with something that works but is hard to fully understand.

## The Arms Race Problem

There is also a social side to this that organizations rarely talk about, and you start to notice it not in architecture diagrams but in behavior. Over time it shows up in how teams talk and what they reach for by default, and it slowly shapes what starts to feel like the "right" way to build something.

You might see one team bring in Kafka because they want to move toward event-driven systems, and that makes sense in their context. But then another team feels the pull to introduce their own version of something modern, and before long a third team is trying something else entirely.

None of these decisions are necessarily wrong on their own, but they rarely happen in isolation.

What you end up with is a mix of patterns and systems, along with a pile of assumptions that were all chosen at the team level. Eventually those decisions start to bump into each other. Teams try to stitch everything together, and that is usually when the cracks start to show, because the edges between these systems were never designed to meet.

At that point the organization stops feeling like a coherent platform and starts feeling more like a set of local decisions that all made sense when they were made but do not quite line up anymore. Instead of helping you move faster, it just gets in the way.

## The Real Cost of Unearned Complexity

If organizations do not learn this lesson, the impact tends to build gradually rather than all at once. Things start taking longer than they should, more people get pulled into work that used to be straightforward, and you notice a kind of background fragility where small changes have a habit of breaking something somewhere else.

Over time that wears people down, because instead of solving problems they are spending more and more energy dealing with the system itself.

What I am really interested by is what it does to the harder work. When everything is complicated, it becomes difficult to take on the problems that actually need real thought and care. Before long most of your time is going into things that should have been simple, which slowly chips away at the organization's ability to deal with anything that is truly difficult.

At that point, change itself starts to feel risky. Every adjustment carries the possibility of something cascading in a way no one fully understands. You end up in a place where the system is technically capable of more, but practically stuck.

That is usually where my head ends up. Not in trying to avoid complexity, but in making sure there is still room for it when it actually matters. Because if everything around you is already heavy, already tangled up, then when something genuinely difficult shows up you do not really have anywhere to put it.

And a lot of what passes for complexity in the meantime does not really deserve the weight we give it.
