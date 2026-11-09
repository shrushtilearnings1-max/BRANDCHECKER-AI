# BRANDCHECKER AI — Intelligent Brand & Content Governance Platform

> *"Every piece of content should reflect your identity."*
> 
> An intelligent governance platform that creates an automated, explainable verification layer between content creation and publication.

---

## 🚀 Live Product Overview

Modern organizations, marketing agencies, and creators publish high volumes of content across multiple employees, external freelancers, and generative AI tools. This creates critical risks:
- Inconsistent tone and voice drift
- Contradictions of legal SLAs, verified facts, and security claims
- Prohibited vocabulary, clickbait hyperbole, and aggressive sales shouting
- Off-brand visual assets, uncalibrated palettes, and missing disclosures
- Repeated mistakes across decentralized content teams

**BRANDCHECKER AI** solves this by learning the distinct identity of each managed brand and analyzing every incoming draft (social posts, technical whitepapers, marketing copy, video transcripts, images, or documents) across **9 weighted dimensions**. Rather than simply rejecting content, it explains the exact root cause, cites the relevant brand guideline, and provides a **Content Improvement Studio** where creators can review side-by-side diffs and apply brand-aligned improvements.

---

## 🌟 Key Product Capabilities

### 1. Multi-Account Brand Management
- Manage distinct brand accounts (e.g. *Nexus Cloud AI*, *Lumina Health*, *Pulse Media Network*).
- Each account maintains its own:
  - **Account Vision & Philosophy:** Long-term mission, core objectives, focus topics, and strictly avoided topics.
  - **Content Strategy:** Pillars, category targets, posting style, and communication approaches.
  - **Communication Identity:** Brand voice, formality level, preferred vocabulary dictionary, and blacklisted words.
  - **Visual Standards:** Brand hex colors, typography, image style guides, and approved graphics.
  - **Approved Information Knowledge Base:** Contractual SLAs, security compliance certifications (SOC 2, ISO 27001), verified product claims, and legal disclaimer requirements.
  - **Guideline File Ingestion & Version History:** Upload and audit PDF, DOCX, and TXT brand manuals.

### 2. Multi-Vector AI Analysis Engine (9 Evaluation Dimensions)
Incoming submissions receive a calculated 0–100% weighted score across:
1. **Vision Alignment (20%):** Does the content support the mission and steer clear of avoided topics?
2. **Content Pillar Alignment (15%):** Does it map to approved editorial pillars?
3. **Tone & Voice (15%):** Does it match the account's required formality and cadence?
4. **Audience Relevance (10%):** Does it speak directly to target audience pain points?
5. **Factual Accuracy (15%):** Are claims backed by verified facts in the knowledge base?
6. **Terminology Consistency (5%):** Does it use preferred vocabulary and eliminate blacklisted terms?
7. **Visual Consistency (10%):** Color space and asset alignment.
8. **Accessibility Standards (5%):** Cognitive load, sentence length, and sensory clarity.
9. **Promotional Claim Compliance (5%):** Flags unprovable absolutes ("100% zero downtime", "cheapest") and missing disclaimers.

### 3. Content Improvement Studio
- **Side-by-Side Before & After:** Highlights detected off-brand statements vs. suggested brand-aligned phrasing.
- **Diff Highlighting:** View changes in Split or Inline mode.
- **1-Click Suggestion Application:** Accept AI recommendations or fine-tune directly in an interactive editor.
- **Instant Re-Analysis:** Re-evaluates modified content against guidelines and tracks score progression (*e.g. 54% → 84% → 96%*).

### 4. Collaborative Review & Approval Centre
- Role-based permissions supporting 4 distinct personas:
  - **ADMIN:** Full system access, guideline editing, custom scoring weights.
  - **MANAGER:** Account assignments, reviewer assignments, approval sign-off.
  - **CREATOR:** Upload copy, run AI analysis, edit in Studio, submit for review.
  - **REVIEWER:** Quality audits, public & private internal notes, revision requests, approve/reject.
- Complete audit trail with timestamps and human sign-off logging.

### 5. Analytics & Continuous Governance Insights
- **Recurring Mistake Patterns:** Identifies the most common off-brand issues across upload batches.
- **Intelligent Guidelines Drift Recommendations:** Suggests additions to brand guidelines based on observed creator patterns.
- **Export Data:** Download audit reports in CSV and print-ready PDF formats.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4 (Dark Navy/Charcoal with Purple/Blue accents)
- **Charts & Visualizations:** Recharts 2.15
- **Icons:** Lucide React
- **AI Engine:** Google Gemini API integration + Built-in Semantic Governance Rule Engine

---

## 💻 Running the Application Locally

The application is running and accessible at:
```
http://localhost:3000
```

To run manually:
```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Start production server
npm start
```

---

## 🧭 Application Routes

| Route | Feature | Description |
|---|---|---|
| `/` | Landing Page | Hero, interactive live verification demo, scoring model explainer |
| `/dashboard` | Executive Dashboard | KPI metrics, alignment trend charts, workflow distribution, recent activity |
| `/accounts` | Brand Portfolio | Multi-brand management, active account switcher, performance cards |
| `/guidelines` | Brand Guidelines | Multi-tab guideline editor, blacklist, facts knowledge base, version history |
| `/setup` | Onboarding Wizard | 6-step guided wizard to create a new brand identity profile |
| `/upload` | Content Upload Centre | Drag-and-drop uploader, metadata tags, instant AI analysis launcher |
| `/reports` | Analysis Reports Directory | Archive of 9-dimension content evaluation reports |
| `/reports/[id]` | Detailed Report Viewer | Circular score gauge, 9 dimension scores, issue inspector with 10 fields |
| `/studio` | Improvement Studio | Side-by-side diff viewer, suggestion acceptor, live editor, re-analysis engine |
| `/approval` | Review & Approval Centre | 11-stage workflow, public comments, internal reviewer notes, approve/reject |
| `/history` | Content History | Searchable content audit trail, version timeline diffs, CSV export |
| `/analytics` | Governance Insights | Error frequency charts, guideline recommendations, print PDF/CSV |
| `/team` | Team & Permissions | Role-based access control, team directory, member invite modal |
| `/settings` | Settings & Weights | Customizable scoring weights (0-100% sliders), Gemini API configuration |
| `/login` | Authentication | Login form with 1-click persona simulation buttons |
