---
title: "Infrastructure as Code Without the Evangelism"
subtitle: "Or How I Learned to Stop Copy/Pasting and Love the Plan File"
date: "2025-07-18"
excerpt: "A satirical deep dive into Infrastructure as Code. What it solves, how it hurts, and why Terraform isn’t a religion (even if it feels like one)."
tags: ["DevOps", "Infrastructure As Code", "Infrastructure", "Devtools", "Software Engineering"]
series: "Without the Hype"
series_slug: "without-the-hype"
series_order: 4
series_description: "A pragmatic infrastructure series that strips out dogma and explains what these technologies actually solve, where they hurt, and when to use them."
reading_time: 5
featured_image: /infrastructureascodewithouttheevangelism.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/infrastructure-as-code-without-the-evangelism-53b9d1358671
devto_link: https://dev.to/tawe/infrastructure-as-code-without-the-evangelism-or-how-i-learned-to-stop-copypasting-and-love-the-1jmf
substack:
code_languages: []
draft: false
---

It started the way it always does.

A couple of bash scripts. Some EC2s. A few RDS instances strung together by tribal knowledge and hope. It wasn’t elegant, but it worked. Until it didn’t.

Someone suggested Terraform. “Just use infrastructure as code,” they said. Just.

Weeks later, your team is reverse-engineering state files, debugging mysterious diffs in `terraform plan`, and explaining to compliance why an S3 bucket disappeared after a seemingly harmless pull request. Welcome to the promised land, where your infrastructure is finally versioned, and also terrifying.

## What Infrastructure as Code Was Supposed to Fix

IaC was sold as a revelation: predictable, repeatable, auditable infrastructure. No more snowflake servers. No more ops people SSHing into production to fix things “just this once.”

And in theory, it’s true. IaC:

- Codifies your infrastructure into declarative files
- Enables version control, reviews, and rollbacks
- Gives you visibility into what’s changing and why

But the minute you adopt it, you inherit its dark side too.

## The Four Horsemen of Overzealous IaC

1. **Copy/Paste Hell**  
You started with one repo. Then a second. Then a module. Then a “core-infra-shared-v2” directory with 900 lines of duplicated logic. Now every service owns its own version of the VPC.  
2. **The Plan File Oracle**  
`terraform plan` becomes scripture. It gets reviewed by three engineers before anyone dares run `apply`. But nobody really knows what it will _do_ until it’s too late.  
3. **State File Roulette**  
State is sacred. Touching it is taboo. Everyone has at least one horror story involving a corrupted state file, drift, or a lock that never released.  
4. **The Idempotence Delusion**  
You believe running `apply` will be safe because “it’s idempotent.” Until Terraform decides your ASG needs to be replaced because someone reordered tags alphabetically.

They’re not just bugs. They’re rituals. Each one a rite of passage you didn’t ask for.

## What It Actually Gives You (When It Works)

- **Consistency across environments**  
    Your staging and production infra finally look like siblings instead of distant cousins.
- **Auditability**  
    Every infra change is tied to a Git commit. Blame is now trackable (comforting and horrifying).
- **Disaster Recovery**  
    Blow away your infra, recreate it from code. (Assuming you remembered the remote backend and your secrets aren’t in plaintext.)
- **CI/CD for Infra**  
    Infra deploys become automated, reviewed, and repeatable. With rollback plans.

## The Hidden Tax of IaC

- **Cognitive Overhead**  
    Welcome to HCL, YAML, JSON, bash, and templating systems duct-taped together. One wrong indent and you destroy the universe.
- **Drift and Denial**  
    IaC says your infra looks one way. Reality disagrees. Nobody knows which is right.
- **Toolchain Sprawl**  
    Terraform, Terragrunt, Pulumi, Infracost, TFLint, tfsec, Vault, Atlantis, Spacelift. All just to spin up a dev box.
- **Slow Onboarding**  
    New devs need a crash course in infrastructure internals just to run `terraform plan` without fear.

## One Tuesday, Two Hours, and Four Dropped Services

Imagine this: a team bumps a Terraform module version in what seems like a harmless PR. The `plan` output shows some routine IAM changes and a few security group tweaks. All green. Looks fine.

But buried in that diff is a new `launch configuration` that triggers an ASG replacement. Which relies on a misconfigured ELB health check. Which promptly starts terminating perfectly good instances because none of the new ones can pass. Four services down before anyone realizes what’s happening.

`terraform plan` wasn’t wrong. It just didn’t speak human. And in that gap between truth and understanding, downtime was born.

## When IaC Is a Superpower

Use IaC when:

- You have multiple environments that must stay in sync
- You need a paper trail for infra changes (compliance, audits, postmortems)
- You manage infra across teams, services, or regions
- You actually change infrastructure regularly (not once a quarter)

## When It’s Just a Fancy Bash Script

Don’t reach for IaC just because it’s trendy. You might not need it if:

- Your infra is small, static, and stable
- You’re the only one maintaining it
- You only spin up infra once and never touch it again
- You’re spending more time writing IaC than shipping value

## How Teams Shoot Themselves in the Foot

- **Terraform All The Things**: You use IaC for DNS, IAM, GitHub users, and Slack channels. It becomes your second codebase. Twice the drift, half the clarity.
- **Over-DRY Modules**: You abstract everything until nobody can tell what any module actually does without expanding 12 layers of includes.
- **Shared State Files**: Everyone updates the same state. Until someone accidentally deletes a VPC used by six other services.
- **Ceremonial Changes**: Every PR becomes a debate about tag order, naming conventions, or why a single comma breaks everything.

## Organizational Impact: It Rewires Your Teams

- **Platform Teams Become Infra Priests**  
    Terraform PRs feel like kernel contributions. Only three people understand the module structure.
- **Developers Become Infra Curious**  
    Whether they like it or not. Debugging `terraform apply` becomes a rite of passage.
- **Onboarding Slows Down**  
    Because before you deploy a feature, you must learn the sacred incantations of `terraform output`.

## Where This Is Heading

- **Modular Abstractions**: Platforms like Terraform Cloud and Spacelift are trying to make IaC friendlier and safer for teams
- **GitOps Integration**: IaC blends with deployment workflows, policies, and drift detection
- **Security Tooling**: Scanning, enforcement, image verification, not optional anymore
- **Self-Service Infra**: Developers request infra, platforms fulfill it. Less code, more contracts

## **The Verdict: IaC Is a Gift. Worshipping It Isn’t.**

Infrastructure as Code solves real problems. It can reduce chaos, increase repeatability, and enable serious engineering maturity.

But it is not free. And it is not a religion.

Sometimes the simplest way to spin up a dev box is a bash script. Sometimes a cloud console click is fine. Sometimes versioning your infra isn’t the bottleneck, understanding your infra is.

So use it wisely. Use it when you need it. And stop pretending it’s the answer to every deployment problem.

Because the best infrastructure isn’t the most elaborate. It’s the one that stays out of your way so you can build something that matters.
