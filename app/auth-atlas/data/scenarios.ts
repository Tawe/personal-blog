import type { Scenario } from "../types"

export const scenarios: Scenario[] = [
  {
    id: "saas-web-app",
    name: "SaaS web app login",
    description: "You run a browser app with a backend and need secure user sign-in.",
    topRecommendations: ["session-cookies", "oidc", "jwt-refresh"],
  },
  {
    id: "spa-public-api",
    name: "SPA + public API",
    description: "Single-page app calls APIs across domains and tokens are unavoidable.",
    topRecommendations: ["oidc", "jwt-refresh", "opaque-tokens"],
  },
  {
    id: "mobile-app",
    name: "Mobile app auth",
    description: "Native iOS/Android app needs user login and secure API access.",
    topRecommendations: ["oidc", "jwt-refresh", "opaque-tokens"],
  },
  {
    id: "third-party-api",
    name: "3rd-party integration",
    description: "External partners and developers need scoped API access.",
    topRecommendations: ["oauth2", "api-keys", "opaque-tokens"],
  },
  {
    id: "enterprise-sso",
    name: "Enterprise SSO rollout",
    description: "B2B customers need centralized identity from corporate providers.",
    topRecommendations: ["saml", "oidc", "oauth2"],
  },
  {
    id: "internal-legacy",
    name: "Legacy internal tooling",
    description: "You have old internal apps and need minimum-friction controls.",
    topRecommendations: ["session-cookies", "basic-auth", "api-keys"],
  },
  {
    id: "service-to-service",
    name: "Service-to-service APIs",
    description: "Non-human workloads call each other in zero-trust environments.",
    topRecommendations: ["mtls", "hmac-signed", "opaque-tokens"],
  },
  {
    id: "high-regulation",
    name: "High-regulation environment",
    description: "You need strong auditability, short-lived credentials, and revocation.",
    topRecommendations: ["opaque-tokens", "oidc", "mtls"],
  },
]
