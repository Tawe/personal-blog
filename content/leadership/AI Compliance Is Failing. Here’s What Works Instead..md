---
title: "AI Compliance Is Failing. Here’s What Works Instead."
subtitle: "Why resilience, not paperwork, will define responsible AI"
date: 2025-07-17
updated: 2026-04-23
excerpt: "AI compliance is failing under real production pressure. Responsible AI depends less on paperwork and more on resilient operating practices that monitor, adapt, and respond as systems change."
tags:
  - AI Governance
  - Compliance
  - AI
  - Machine Learning
  - Technical Leadership
featured_image: /aicompliance2026.png?height=400&width=800
reading_time: 6
medium_link: https://medium.com/@johnmunn/ai-compliance-is-failing-heres-what-works-instead-40b5d93cfe96
devto_link:
substack: https://johnmunntech.substack.com/p/ai-compliance-is-failing-heres-what
draft: false
---

_Updated to reflect the current state of AI systems, risks, and how teams are actually operating in 2026._

The AI compliance industry is booming right now. Gartner estimates organizations will spend close to $500 million on AI governance platforms in 2026, with that number set to climb fast. Enterprises are rolling out frameworks, audits, policies, legal reviews. But I feel that once those controls run into deadlines and people trying to get their work done, they will fall by the wayside.

We’ve seen the same lesson play out again and again. Compliance frameworks have a hard time holding up in the real world.

Over the past year, regulators and state attorneys general started issuing fines, filing lawsuits, and forcing public disclosures, and each time it became clear that once people were actually using AI tools and models in production, the policies and audits weren’t doing much to stop things from going wrong.

## AI systems keep failing

At Samsung, engineers started using ChatGPT to speed up their work. One pasted in proprietary source code to debug it. Another shared internal chip design notes. A third uploaded meeting summaries tied to product plans. No one was trying to leak anything, but it all went into a system outside the company. A few days later, Samsung locked down access to public AI tools after realizing what had already been shared.

There were policies and training, but in that moment none of it mattered or stopped anyone.

This isn’t rare anymore. AI-related failures drove $4.4 billion in losses across organizations in 2025. The AI Incident Database logged 362 incidents that year, up from 233 the year before, and early 2026 numbers are already higher month to month.

McDonald’s ran an AI hiring system with default credentials and no MFA, which meant anyone who found it could access the system and view or manipulate applicant data. In other cases, chatbots validated suicidal thinking instead of directing users to help, and lawsuits followed.

There’s nothing unusual here. It’s what happens when controls are loose, ownership is muddy, and people are focusing on getting work done as quickly as possible.

## It’s not your models, it’s you

Compliance is built on the idea that people will follow the rules, but under pressure people look for the path of least resistance.

Show someone an AI recommendation before they’ve made up their mind and they will favour it, even when they know better. In some cases, accuracy drops, even when the user is a trained professional.

Security teams are having a hard time catching up, many analysts are ignoring more of their alerts due to false positives, and CrowdStrike’s 2025 Global Threat Report puts AI-generated phishing click rates around 54% versus roughly 12% for traditional attacks.

The system scales faster than people can keep up, and that gap keeps widening.

## You don’t have as much control as you think

As time passes, AI systems drift, get probed, and end up in situations no one has tested.

Prompt injection attacks have evolved into multi-step versions that can pull data or rewrite instructions, and CrowdStrike reported these attacks across more than 90 organizations in 2026 alone.

Documentation doesn’t help much here because it tells you how a model was trained, not what it will do when someone tries to break it, and most organizations are running black-box APIs with no visibility into training data or insight into the architecture, which means you’re operating something you can’t fully inspect.

That’s what it looks like once these systems are out in the wild.

## Regulation is still playing catch up

The EU AI Act is already in effect. Rules for general-purpose AI models kicked in in August 2025, and full enforcement for high-risk systems is to follow in August 2026.

In the U.S., the situation is a bit different. States like California, Colorado, Texas, and New York are moving quickly, each setting their own rules on automated decisions, training data, and safety reporting. California’s AB 2013 now requires companies to publicly disclose what goes into their training data.

At the same time, a December 2025 executive order from Donald Trump pushed for a lighter federal approach and signaled challenges to state laws.

So now you have two forces pulling in opposite directions. State enforcement is getting more strict, while federal pressure is easing. Things are moving fast and no one can say what the rules will look like in 18 months.

That kind of uncertainty makes compliance models hard to rely on, because the rules are a moving target.

## More tooling won’t fix a structural problem

The market’s answer has been predictable: buy more tools. Governance platforms, monitoring dashboards, risk scoring systems.

Some of it helps. A lot of it just adds another layer no one fully owns.

We’ve seen this before. IBM Watson Health, Microsoft Tay, and Amazon’s recruiting tool all failed with controls in place.

Right now, 45% of AI-generated code contains security issues. 93% of companies are using that code in production. Only 12% consistently test it.

That gap isn’t a tooling issue. It’s an operational one.

## We need to focus on resilience

The organizations that are getting ahead of this aren’t focused on adding more paperwork. They treat governance as ongoing work, something they revisit and adjust as the systems change. They expect things to break and are planning around that, set up workflows where people stay in the loop instead of handing decisions over to AI, and keeping a close eye on how systems behave once they’re live rather than relying on documentation written months earlier.

They keep a close eye on how their AI tools and models behave in production. Teams meet regularly, adjust controls, and work through issues as they come up instead of relying on documentation that gets written once and then ignored.

Consider this pattern that’s becoming common in well-governed fintech organizations, a standing model risk group that reviews anomalies every week and updates policies just as often. They catch drift early, adjust before it turns into a regulatory issue, and keep the system within bounds as it’s actually being used.

This is how experienced teams run these systems.

## The part people don’t like

Compliance still matters, but it doesn’t totally hold up in practice.

In 2025, the companies that avoided the worst failures weren’t the ones with perfect documentation, they were the ones that spotted problems early and acted on them before they became larger issues.

Treating resilience as an operating practice ends up producing compliance as a byproduct, while building around checklists tends to create systems with the facade that it is solid.

## Where to Start

Start with a clear view of what you’re actually running in production, because most companies don’t have that figured out. Bring security, legal, and product into the same room on a regular basis and make sure they have the power to change things, not just talk about them.

Put monitoring in the systems that matter the most, so you can see what they’re doing as they run, and make those signals something people can understand and act on. From there, you start filling in what’s missing, a place to test changes without breaking things, a way to see what’s actually happening when the system is in use, and vendor agreements that don’t leave you guessing when something goes wrong.
