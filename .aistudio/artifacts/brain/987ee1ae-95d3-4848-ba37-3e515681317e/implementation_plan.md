# Lumiq TV — Legal Policies, Interactive FAQ Accordion, Top-Right Account Button & SEO Content Upgrade

This plan upgrades Lumiq TV with comprehensive streaming industry legal policies, a space-saving interactive FAQ accordion where only the first question opens by default, a dedicated top-right **Login / My Account** button (with admin access kept strictly at `/admin`), and richly formatted SEO articles with step-by-step checklists and comparison tables.

## User Review & Critical Decisions

> [!IMPORTANT]
> All three product decisions below incorporate your confirmed preferences from our clarification step:

- **Confirmed Decision 1 — 7-Day Technical Guarantee Refund Policy**: Paid IPTV subscription plans will feature a clear **7-day money-back guarantee** from activation for verified technical issues, with a mandatory support troubleshooting step first (24–48 hours) and transparent exclusions for expired 7-day windows, local ISP speed limits, or third-party player app fees.
- **Confirmed Decision 2 — Top-Right Login / My Account Button**: The top-right header bar will display a clean **Login** button (when signed out) or **My Account** button (when signed in) right next to **View Plans ($10/mo)**. Admin access remains strictly at `/admin` and is removed from the customer `/login` and `/account` screens.
- **Confirmed Decision 3 — Comprehensive SEO Articles with Checklists & Comparison Tables**: Blog articles and setup guides will feature structured **Key Takeaways**, **Step-by-Step Checklists**, **Comparison Tables**, and internal SEO cross-links to pricing, free trial, and device pages.

---

## 1. Overview & Core Concept

- **What It Delivers**:
  1. **Complete Legal & Policy Center (`/terms`, `/privacy`, `/refund-policy`, `/compatibility-disclosure`, `/copyright`)**: Modelled after established digital subscription and streaming platforms, featuring a "Quick Summary in Plain English" box, side-by-side policy switcher tabs, table-of-contents jump links, and detailed clauses covering service scope, M3U/Xtream credential rules, connection limits, data privacy, and the 7-day refund workflow.
  2. **Space-Saving Accordion FAQ (Homepage & `/faq`)**: Replaces the long expanded list of questions with an interactive accordion. Only the **1st FAQ item** is open initially so customers see an immediate example answer while the rest stay compactly closed until clicked.
  3. **Top-Right Account Access & Clean `/admin` Separation**: Moves account access to a dedicated top-right **Login** / **My Account** button alongside the primary **View Plans ($10/mo)** button, and keeps store administration isolated at `/admin`.
  4. **Rich SEO Editorial Articles & Setup Guides**: Expands the article library and upgrades the article reader so every guide includes scannable comparison tables, step-by-step checklists, diagnostic matrices, and contextual internal links.
- **Target Audience**: Everyday Smart TV, FireStick, Apple TV, and Android TV viewers looking for a trustworthy, easy-to-navigate IPTV subscription store, alongside search engine crawlers indexing high-intent IPTV keywords.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Header Account Flow**: A visitor lands on any page and sees **Login** in the top-right corner next to **View Plans ($10/mo)**. Clicking **Login** opens `/login` (with customer-only sign-in options). Once signed in, the top-right button automatically switches to **My Account** and routes to `/account`. Store administrators access the admin console directly by visiting `/admin`.
  - **FAQ Accordion Flow**: On both the Homepage and `/faq`, the first FAQ item is expanded by default with a minus/chevron indicator. Clicking any closed question smoothly expands its answer; users can either toggle individual questions or click "Expand All / Collapse All".
  - **Legal Policy Navigation Flow**: Visiting any legal link in the footer opens a structured two-column policy view with a top policy switcher (`Terms of Service`, `Privacy Policy`, `7-Day Refund Policy`, `Compatibility Disclosure`, `Copyright Policy`), a "Plain-English Summary" highlight box, and numbered legal sections.
  - **SEO Article Reading Flow**: Visiting `/blog` or any article (`/blog/:slug`) presents an editorial layout with an interactive Table of Contents, a Quick Checklist callout, a structured Comparison Table (e.g., *TiviMate vs. IPTV Smarters Pro vs. IBO Player* or *1-Month vs. 12-Month vs. 48-Month Value*), and a bottom conversion banner linking to `/pricing` and `/free-trial`.
- **Visual Identity & Theme**:
  - **Aesthetic Direction**: Clean consumer streaming storefront—high-contrast light mode (`#FAFAFA` canvas, crisp `#FFFFFF` surfaces, `#E4E4E7` hairline borders, and `#2563EB` primary royal blue accents).
  - **Typography & Hierarchy**: `Plus Jakarta Sans` for display headings, `DM Sans` for comfortable long-form reading (65–75ch measure on articles and policies), and `JetBrains Mono` / `tabular-nums` for pricing tables and technical specifications.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: First-Item-Open Accordion Pattern with Full DOM Presence for SEO**
  - *Chosen Approach*: Initialize accordion state with the first visible FAQ item's ID open (`openFaqIds = [firstFaq.id]`) and allow manual toggling of any item, while keeping the full FAQPage Schema.org JSON-LD intact in the page metadata.
  - *Why*: Reduces vertical scrolling on the homepage by more than 65% while preserving 100% of the SEO structured data for search engines.
- **Decision 2: Strict Customer vs. `/admin` Separation**
  - *Chosen Approach*: Display **Login** (when logged out) or **My Account** (when logged in) in the top-right header action group, remove the Admin shortcut from the customer `/login` and `/account` pages, and keep `/admin` self-contained with its own admin sign-in prompt if not yet authenticated as admin.
  - *Why*: Prevents regular customers from seeing internal store admin buttons while keeping `/admin` 1-click accessible via its direct URL.
- **Decision 3: Structured Markdown Table & Checklist Parser in Editorial Articles**
  - *Chosen Approach*: Upgrade the article renderer to support markdown tables (`| Column | Column |`), numbered checklists, and callout blocks across both built-in SEO articles and CMS-published articles.
  - *Why*: Search engines and human readers strongly favor structured comparison tables and checklists for queries like *"IPTV Smarters Pro setup"*, *"IPTV subscription pricing"*, and *"FireStick IPTV buffering fix"*.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       TOP NAVIGATION BAR (Layout)                          │
│  [Lumiq TV]    [Plans · Free Trial · Supported TVs · Guides · FAQ]         │
│                                      [Login / My Account] [View Plans CTA] │
└───────────────┬──────────────────────────────────────────┬─────────────────┘
                │                                          │
                ▼                                          ▼
┌───────────────────────────────────────┐  ┌─────────────────────────────────┐
│     PUBLIC SEO & CONTENT VIEWS        │  │   CUSTOMER & ADMIN WORKFLOWS    │
│                                       │  │                                 │
│ • Home & FAQ Views                    │  │ • /login & /account             │
│   └─ Interactive Accordion            │  │   └─ Customer-only Login &      │
│      (1st item open, rest closed)     │  │      Order / Trial Dashboard    │
│                                       │  │                                 │
│ • /blog & /guides                     │  │ • /admin (Direct URL Access)    │
│   └─ Rich SEO Renderer (Checklists,   │  │   └─ Orders, Trials, Customers, │
│      Comparison Tables, TOC, JSON-LD) │  │      Editorial CMS & Audit Logs │
│                                       │  │                                 │
│ • Legal Policy Suite                  │  └─────────────────────────────────┘
│   └─ /terms, /privacy, /refund-policy │
│      /compatibility-disclosure,       │
│      /copyright (7-Day Guarantee)     │
└───────────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - **Header Account Button**: Reads `profile` from `useApp()`. Renders `Login` (`/login`) with a subtle user icon when `profile === null`, and `My Account` (`/account`) when `profile !== null`.
  - **FAQ Accordion Component**: Reusable `FaqAccordionList` component shared between `HomeView` and `FaqView`. Tracks expanded item IDs in state, defaulting to `[items[0]?.id]`, and resets to the first filtered item whenever the user changes the search query or category filter.
  - **Legal Policy Center (`LegalDocumentView`)**: Expanded data model containing effective date, plain-English summary bullets, sidebar quick-jump anchors, and 7–9 comprehensive legal clauses per policy document.
  - **Editorial Article Engine**: Expands `INITIAL_EDITORIAL_ARTICLES` to 6 comprehensive, keyword-targeted guides with comparison tables and checklists, and upgrades `BlogPostView` to render tables, checklists, and internal links cleanly.
