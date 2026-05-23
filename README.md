<div align="center">

# 🛡️ Project Aegis

**Predictive Crowd Safety. Zero-Trust Operations.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase App Hosting](https://img.shields.io/badge/Firebase-App_Hosting-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Genkit](https://img.shields.io/badge/Genkit-Gemini_1.5_Pro-4285F4?style=for-the-badge&logo=google)](https://firebase.google.com/docs/genkit)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Glassmorphism-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

*A military-grade, Genkit-powered orchestrator designed to eliminate manual estimation and actively prevent kinetic crowd shockwaves before they occur.*

</div>

---

## 📖 The Catalyst: Solving the Manual Gap
The evolution of urban stadium security has reached a critical inflection point. Traditional, manually-driven crowd control paradigms are reactive and linear, often failing catastrophically in dynamic environments. 

The tragic events following the RCB IPL Victory Celebration in Bengaluru on **June 4, 2025**—where an abrupt parade cancellation funneled an unmanaged mass of fans into a static stadium perimeter—served as a stark baseline for structural failure. **Aegis** was born to ensure this never happens again.

By replacing VHF radio silos and visual density estimation with **hard numerical capacity caps** and **autonomous AI load balancing**, Aegis transforms stadiums from unmanageable pressure cookers into predictable, fluid ecosystems.

---

## ⚡ Core Architecture

Project Aegis is a zero-trust, multi-agent spatial operating system built on a unified **Next.js 15 Next-PWA** architecture.

### 🧠 The Genkit Supervisor
Powered by **Firebase Genkit** and **Vertex AI (Gemini 1.5 Pro & Gemini 3.5 Flash)**, the Supervisor acts as the central brain. It ingests high-frequency density data from Supabase Realtime and executes a Maker-Checker escalation matrix. We enforce strict explicit context caching to eliminate token bloat during 60fps telemetry streaming.

### 📡 The Vanguard Protocol (Fan PWA)
Fans authenticate via Google OAuth to access their digital ticket. Aegis utilizes **Zustand + idb-keyval** to ensure tickets survive offline 4G network dropouts. The AI proactively load-balances foot traffic by sending dynamic rerouting bounties (gamification credits) to Fans in dense (Orange) zones.

### 🎙️ Action Node (Volunteer PWA)
Volunteers bypass complex UI under stress. Using the **Web Speech API** bound to a physical Push-to-Talk (PTT) interface, volunteers issue vocal directives (e.g., *"Command Code Alpha: Gate 7 Red"*), instantly triggering AI triage protocols.

### 🗺️ Command Center (Admin Glass Backend)
Admins monitor the stadium via a dark-mode **Framer Motion SVG map** that interpolates density percentages into Hex Colors (`Green -> Yellow -> Orange -> Red`). The "Glass Backend" streams the AI's internal reasoning (thought logs) in real-time via Server-Sent Events (SSE).

---

## 🛠️ Tech Stack Matrix

| Layer | Framework / Version | Justification |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 15 (App Router) | Edge-compatible API routes for zero cold-start SSE streaming. |
| **Auth & Database** | Supabase (`@supabase/ssr`) | JWT-based Zero-Trust RBAC. WebSockets natively broadcast crowd density spikes. |
| **State Management**| Zustand + `idb-keyval` | Handles transient UI state and persists digital tickets offline. |
| **AI Orchestration** | Firebase Genkit + Vertex AI | Supervisor-Worker pattern using Gemini 1.5 Pro. |
| **UI & Motion** | Tailwind v4 + Framer Motion | Binds natively to SSE events to orchestrate the SVG Map color interpolation smoothly. |
| **PWA Engine** | `@serwist/next` | Aggressively caches static assets for standalone mobile home screen installation. |

---

## 🎨 Deterministic Design System (OKLCH)
Aegis employs a strict **OKLCH color space** to ensure mathematically perfect contrast ratios (WCAG 2.1 AA compliant) for outdoor readability and low-light operations. 

- **Human UI:** `Geist Sans` for clear, readable standard interfaces.
- **Agent Telemetry:** `Geist Mono` for precise event logs, data tables, and AI thought streams.
- **Aesthetics:** Deep Space Tactical Dark Mode (`oklch(0.13 0.01 285)`), featuring 64px backdrop blurs and subtle 3% noise overlays for a premium, zero-trust glassmorphism feel.

---

## 🚀 Execution & Deployment
Aegis is configured for seamless deployment to **Firebase App Hosting**. 

### The 4-Tier Agentic Workflow
1. **Load-Balancing Loop:** The Node.js Mock Engine pushes density updates (`GATE_7: 85%`). Supabase Realtime triggers the Next.js API. The Genkit Supervisor evaluates and issues Vanguard Bounties to reroute traffic to `GATE_4`.
2. **Voice-Steered Code Red:** A Volunteer triggers *"Command Code Alpha"*. The AI halts autonomous routing and drafts an SOS.
3. **Maker-Checker Pause:** The Admin UI locks down, displaying the AI's drafted SOS. A human Admin must physically click "APPROVE" to execute the closure.
4. **Audit Trail:** Every action, AI evaluation, and Admin override is permanently recorded in the `event_logs` table.

---

<div align="center">
  <i>"Aegis ensures that human intervention is reserved for strategy, while execution is handled by mathematics."</i>
</div>
