---
title: "Catching Secrets Early - A Ligh-weight Build-Time Tripwire for Vite"
date: "2025-05-15"
excerpt: "Secrets don’t belong in your codebase. Not in a commit, not in a PR, and definitely not in production. And yet, it happens  -  a quick console.log() with an API key, a test token dropped into a config…"
tags: ["Vite", "Security", "javascript", "devtools", "development"]
reading_time: 4
featured_image: /catchingsecretsearly.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/catching-secrets-early-a-lightweight-build-time-tripwire-for-vite-825f0998430c
devto_link: https://dev.to/tawe/catching-secrets-early-a-lightweight-build-time-tripwire-for-vite-3caj
substack:
code_languages: ["javascript"]
draft: false
---

> Ever pushed an API key to production? Don’t lie - we’ve all done it. Here’s how to make sure it never happens again, using a 10-line Vite plugin.

Secrets don’t belong in your codebase. Not in a commit, not in a PR, and definitely not in production.

And yet, it happens - a quick ``console.log()`` with an API key, a test token dropped into a config file, a placeholder password that never gets removed. Days later? Still there. Weeks? Maybe it even gets pushed to production.

I've heard more than one story of dev teams scanning older, inherited codebases - only to find hardcoded API keys sitting in plain text. These weren’t new mistakes, they’d been buried for years. It’s a reminder that even quiet, untouched code can hide serious risks.

Let’s talk about how to catch this stuff early, right in your Vite dev build, before it ever hits version control. One easy win: adding a secret-scanning plugin to your **Vite** build.

---

### 🔍 The Code

```javascript
// vite-plugin-secret-scan.js
export default function secretScanPlugin() {
  return {
    name: 'vite-plugin-secret-scan',
    enforce: 'pre',
    transform(code, id) {
      const regex = /(apiKey|secret|token|password|credential)\s*=\s*["]([^"']+)["']/g;
      let match;
      while ((match = regex.exec(code)) !== null) {
        console.warn(`[Secret Scanner] Possible hardcoded secret in ${id}: ${match[0]}`);
      }
      return code;
    },
  };
}
```

### ⚙️ Add It to Your Vite Build

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import secretScanPlugin from './vite-plugin-secret-scan.js';

export default defineConfig({
  plugins: [secretScanPlugin()],
});
```

This runs the check before Babel or TypeScript touches anything. It’s fast, and it gives you a shot at catching problems early.

> 🧪 Heads-up: it’s super lightweight, but if you're worried about CI build speed, limit it to dev builds.

---

### Dev Isn’t Enough  -  Lock It Into Git Hooks

Catching secrets at build time is solid. But real safety? That comes from making it part of your workflow.

Set up a Git hook to catch it before things ever land in a commit. Use `husky` + `lint-staged`:

```bash
npx husky-init && npm install
```

In your `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": "vite build --config vite.config.js"
}
```

Or drop this in `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm run lint && npm run secret-scan
```

Want full coverage? Layer in tools like [gitleaks](https://github.com/gitleaks/gitleaks) or [truffleHog](https://github.com/trufflesecurity/trufflehog).

---

###  Why This Matters

Let’s break down some real-world tradeoffs and improvement areas. If you're thinking about using (or maintaining) a Vite-based secret scanner plugin, here’s what to consider:

---

#### Handling False Positives

The regex is intentionally broad - it catches obvious mistakes, but that means it can cry wolf. Think `tokenCount = 3` getting flagged just for containing “token.”

**Ways to quiet the noise:**

- **Refine your patterns**: Include value structure or length checks.
- **Add an ignorelist**: Build in comment-based suppressions or a config file.
- **Flag & review**: Don’t fail builds on warnings - just surface them.

> ⚠️ Don’t let false positives drive people to ignore all warnings. Make the scanner noisy enough to be useful, not ignored.

---

#### Performance Considerations

Yes, it’s fast. But on large monorepos or projects with thousands of files, it’s worth being smart about where it runs.

**Optimization tips:**

- Only include files likely to contain secrets (``src/``, ``config/``, not ``test/`` or ``dist/``)
- Run in dev builds only
- Cache hash-based results to skip unchanged files

If you’re using Vite in watch mode, performance is already tight - just don’t overdo the scan scope.

---

#### Regex Is Just a Start

This is where things get serious. Regex is good for catching easy, human-readable secrets. But what about base64 blobs? JWTs? Private keys split across lines?

You’ll need:

- Extended regexes tuned to your codebase
- Entropy checks to catch randomness
- Git-aware tools like `truffleHog` and `gitleaks`

> 💡 Want contextual awareness? Tools like SonarQube or DeepSource can go far deeper than anything regex-based.

The plugin isn’t meant to replace those. It’s meant to _augment_ them, giving you fast feedback before the code leaves your machine.

---

#### Don’t Underestimate the Risk

Hardcoded secrets are quiet killers. They don’t crash your build, but they can:

- Lead to breaches
- Rack up surprise cloud bills
- Shatter user or stakeholder trust

Start with the basics. Catch what you can. But know that secrets need defense in depth.

> 🔎 **Pro tip**: Visualize your secret hygiene. Add checkpoints on IDE → Git hook → CI. Make this visible in onboarding docs or security dashboards.

---

### Want to Make It Stick?

Here's a five-part starter workflow that balances developer speed with security sanity:

**1. Scan your legacy repos**  
Use `gitleaks` or `truffleHog` for a one-time sweep. Focus on older repos and anything inherited.

**2. Plug the scanner into your Vite build**  
Install the plugin, run it during dev builds, and surface warnings - not failures.

**3. Hook it into Git**  
Add a `pre-commit` check using `husky` and `lint-staged` to catch things early without slowing devs down.

**4. Codify your expectations**  
Write a simple checklist:
 - ✅ Secrets in `.env`, not code
 - ✅ Never expose keys client-side
 - ✅ Rotate test creds quarterly
 
**5. Treat secrets like any other hygiene**  
Run audits like you would with lint, dependencies, or tests. Secrets get stale. Checks shouldn't.

> 🎯 It’s not about blocking everything. It’s about reducing the chance of leaking something stupid - because this plugin might not save the world, but it could save your Friday night.

---

### 📌 TL;DR Snapshot


#### 🔧 Build Layer

 - Custom Vite plugin scans for obvious hardcoded secrets
 - Runs in dev mode, before other transforms
 - Warns, doesn’t block and keeps feedback fast

#### 🔄  Workflow Layer

 - Hook into Git with `lint-staged` and `husky`
 - Scan legacy repos with `gitleaks`, `truffleHog`
 - Add security hygiene to onboarding/playbooks

>💡 Secrets don’t belong in Git. And your future self doesn’t want to be paged because of one.