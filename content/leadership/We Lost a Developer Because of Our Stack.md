---
title: "We Lost a Developer Because of Our Stack"
subtitle: "Why system could cost you your best people"
date: 2026-04-22
excerpt: "Why stack decisions affect more than architecture: they shape hiring, retention, delivery, and the long-term health of your team."
tags:
  - Leadership
  - Hiring
  - Engineering Management
  - Software Engineering
  - Developer Experience
featured_image: /welostadeveloperbecauseofourstack.png?height=400&width=800
reading_time: 8
medium_link: https://medium.com/p/4dd89898c256
devto_link:
substack:
draft: false
---

It was a Wednesday in the spring, rain tapping against the boardroom windows. I was sitting across from one of my top developers, going through an exit interview.

I asked why he was leaving.

He paused for a second, then said, “The tech stack. It’s not what I want to be working on. It’s not helping me grow my skillset.”

Two months earlier, he and one of our architects had come to me with a proposal. Rebuild the backend, move off PHP, onto Python.

At the time, it didn't really make sense. The system worked, we had features to ship, bugs to fix, and a roadmap that was already tight. A full rebuild with no clear tie to revenue wasn't something we could justify.

But in that earlier conversation, he mentioned other developers felt the same way. The team wasn’t excited about the system anymore and it felt dated. I had been seeing something similar while hiring too, we weren’t attracting the people we wanted, and I had a feeling the stack was part of it.

Sitting there in that exit interview, I realized I hadn’t weighed the impact of the decision properly. I’d been focused on cost, delivery impact, system risk, all the obvious things, and that part made sense at the time, but I hadn’t thought about what it was doing to the people working on the system.

Truthfully, I wasn’t really thinking about the impact on our people at the time, so it just felt like an easy call to make then. Looking back on it now, it probably wasn’t as simple as I thought.

If you leave the system as it is, things keep moving. It’s predictable, and you don’t have to deal with the disruption that comes with trying to rebuild something that already works, which matters when the business depends on consistent output.

Over time though, hiring gets harder, strong candidates lose interest when they see the stack, and the team starts to disengage because they want to work on a modern system, not one that they feel is old and dated.

If you move to something newer, you get a different set of problems, hiring usually gets easier and people are more engaged, there’s more curiosity in the work again, but delivery slows down while the team is getting up to speed on the new stack and bugs start showing up in places that used to be stable. So you end up dealing with issues you didn’t have before while still being expected to deliver the work that was already planned.

There are times when staying put makes sense, if the system is doing its job, the team is shipping, and reliability matters more than change, introducing risk just to feel current usually backfires, and I’ve seen teams start pulling apart stable systems because they didn’t want to be working in that stack anymore, and then spend the next year rebuilding a lot of the same things anyway.

Other times, you’re still on the old stack and nothing is breaking, but hiring gets harder, candidates pass when they see it, people leave for work they’d rather be doing, and the day-to-day work gets less exciting, features take longer and fewer people are into what they’re building.

At that point someone usually asks if we should just rewrite it, which sounds reasonable in the moment but isn’t really the right question.

Most teams go to extremes and either try to keep everything or replace everything, but in practice it usually ends up somewhere in between, you don’t need to rebuild the foundation to make progress, you can introduce new services in a different stack, build new products on something more current, and give the team exposure to better tools without putting the entire platform at risk.

That doesn’t remove the tradeoff, it just keeps it manageable, and timing matters more than people want to admit, because even if a change is the right call, the business still has to be able to carry it, and if delivery pressure is high and the roadmap can’t slow down, a large migration creates problems on its own, while the same decision made later, with more room, can play out very differently.

At a certain point, the decision stops being technical. It becomes a balance between system health, business pressure, and team health. Push too far in one direction and something else starts to slip.

Explaining that balance to non-technical leadership is a different problem. Talking about modern stacks or what developers want to learn doesn’t usually come across, it just sounds like preference.

What people do pay attention to is impact.

If hiring is getting harder, if strong candidates are passing, if you’re at risk of losing experienced developers, those are business problems. They affect delivery in a real way.

It also helps to be clear about scope, what stays the same, where the new tech lives, and how the risk is being managed, because it’s easier to deal with when you know what’s changing and what isn’t.

Looking back on that conversation, approving a full rebuild wouldn’t have been the right call. Shutting it down because the revenue case wasn’t obvious wasn’t right either.

What I should have asked was where we actually needed to change to keep both the system and the team in a good place.

Not a full rebuild, but not ignoring it either, just enough change to keep delivery moving and still ship what we had planned without breaking what already worked. I wasn’t thinking about it like that at the time.
