# PRD Studio — AI Product Manager

> Transform product ideas into structured, critique-ready PRDs in seconds. Built like a real SaaS tool.

![PRD Studio](https://img.shields.io/badge/built%20with-Claude%20Sonnet%204.6-6366f1?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Express-0ea5e9?style=flat-square)

---

## Features

- **PRD Generator** — Converts a product idea into a complete 12-section PRD (personas, user stories, functional requirements, KPIs, risks, MVP scope, roadmap, and more)
- **Senior PM Critique Mode** — An AI VP reviews your PRD, assigns a 0–100 score, and returns a verdict: `APPROVE / REVISE / REJECT`
- **Iteration Mode** — One-click PRD improvement that addresses all critique findings
- **History** — All PRDs are persisted to localStorage for quick retrieval
- **Templates** — 5 pre-built product scenarios to explore
- **Export** — Copy any PRD as formatted Markdown

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | TailwindCSS 3 + custom design tokens |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Node.js + Express |
| AI | Anthropic Claude Sonnet 4.6 via `@anthropic-ai/sdk` |

---

## Project Structure

```
prd-studio/
├── api/                            # Vercel serverless functions (production)
│   ├── generate-prd.js             # POST /api/generate-prd
│   └── critique-prd.js             # POST /api/critique-prd
│
├── lib/
│   └── aiService.js                # Shared Claude SDK calls + prompts
│
├── server/                         # Optional Express server (local dev only)
│   ├── index.js
│   ├── routes/
│   │   ├── generatePrd.js
│   │   └── critiquePrd.js
│   └── services/aiService.js
│
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Global state + routing logic
│       ├── index.css               # Tailwind + custom utilities
│       ├── api/prdApi.js           # fetch wrappers for API endpoints
│       └── components/
│           ├── Sidebar.jsx
│           ├── PRDInput.jsx
│           ├── PRDOutput.jsx
│           ├── PRDSection.jsx
│           ├── CritiquePanel.jsx
│           └── LoadingState.jsx
│
├── vercel.json                     # Vercel build + routing config
├── package.json                    # Root deps for serverless functions
├── .vercelignore
├── .env.example
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd prd-studio

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
# In the /server directory
cp ../.env.example .env
```

Edit `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Run both servers

**Terminal 1 — API server:**
```bash
cd server
npm run dev
# → API running at http://localhost:3001
```

**Terminal 2 — React client:**
```bash
cd client
npm run dev
# → App running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Reference

### `POST /api/generate-prd`

Generates a structured PRD from a product idea.

**Request:**
```json
{
  "idea": "A B2B SaaS tool that helps remote engineering teams automate standup reports using AI..."
}
```

**Response:**
```json
{
  "success": true,
  "prd": {
    "title": "StandupAI",
    "tagline": "Automated standups for async-first engineering teams",
    "version": "1.0",
    "date": "2026-05-14",
    "problem_statement": "...",
    "personas": [...],
    "goals": [...],
    "non_goals": [...],
    "user_stories": [...],
    "functional_requirements": [...],
    "non_functional_requirements": [...],
    "kpis": { "north_star": "...", "metrics": [...] },
    "edge_cases": [...],
    "risks": [...],
    "mvp_scope": [...],
    "future_roadmap": [...],
    "open_questions": [...]
  }
}
```

### `POST /api/critique-prd`

Critiques a PRD and returns structured feedback.

**Request:**
```json
{
  "prd": { ...prd object... }
}
```

**Response:**
```json
{
  "success": true,
  "critique": {
    "overall_score": 74,
    "verdict": "REVISE",
    "verdict_reason": "...",
    "summary": "...",
    "assumptions_critique": [...],
    "missing_requirements": [...],
    "ux_risks": [...],
    "engineering_risks": [...],
    "strengths": [...],
    "improvements": [...],
    "next_steps": [...]
  }
}
```

### `POST /api/critique-prd` (Improve mode)

Improves the PRD based on critique findings.

**Request:**
```json
{
  "prd": { ...prd object... },
  "critique": { ...critique object... },
  "mode": "improve"
}
```

---

## Deployment

### Vercel — One-click full-stack deploy (Recommended)

The project is pre-configured to deploy as a single Vercel project. The React app builds to a static SPA and the API endpoints run as serverless functions — both served from the same domain. **No CORS, no separate backend hosting, no proxy.**

#### How it's structured for Vercel

```
prd-studio/
├── api/                      ← Vercel auto-detects these as serverless functions
│   ├── generate-prd.js       → POST /api/generate-prd
│   └── critique-prd.js       → POST /api/critique-prd
├── lib/
│   └── aiService.js          ← Shared between functions (Claude SDK calls)
├── client/                   ← Vite build → output goes to client/dist
├── package.json              ← Root deps (@anthropic-ai/sdk) for functions
├── vercel.json               ← Build + routing config
└── .vercelignore             ← Skips /server (only used for local dev)
```

#### Steps

1. **Push to GitHub**:
   ```bash
   cd /Users/ythan/prd-studio
   git init && git add . && git commit -m "Initial commit"
   gh repo create prd-studio --public --source=. --push
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your `prd-studio` repo
   - Vercel auto-detects the config from `vercel.json` — no overrides needed
   - **Framework Preset**: leave as "Other"
   - **Root Directory**: `./` (project root)

3. **Add environment variable**:
   - In **Settings → Environment Variables**, add:
     ```
     ANTHROPIC_API_KEY = sk-ant-...
     ```
   - Apply to: Production, Preview, Development

4. **Deploy** — Vercel will:
   - Run `cd client && npm install && npm run build`
   - Serve `client/dist/` as the SPA
   - Deploy `api/*.js` as Node.js serverless functions
   - Route all non-`/api/*` requests to `index.html` (SPA fallback)

#### CLI deployment alternative

```bash
npm i -g vercel
cd /Users/ythan/prd-studio
vercel              # first time: connect project
vercel --prod       # production deploy
```

Add the env var either via the dashboard or:
```bash
vercel env add ANTHROPIC_API_KEY production
```

#### Local development with Vercel dev (optional)

To test the serverless functions locally exactly as Vercel runs them:
```bash
npm i -g vercel
cd /Users/ythan/prd-studio
vercel dev          # serves SPA + serverless functions on http://localhost:3000
```

This replaces the need for the separate Express server when developing.

#### Alternative: Express server locally

The `server/` directory still works for local dev with the original Express setup — useful if you want hot-reload on the API without `vercel dev`. The Vite proxy points `/api/*` to `localhost:3001`. The `server/` folder is excluded from Vercel deploys via `.vercelignore`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key |
| `PORT` | Optional | Server port (default: 3001) |
| `NODE_ENV` | Optional | `development` or `production` |
| `CLIENT_URL` | Optional | Frontend URL for CORS (default: localhost:5173) |
| `VITE_API_URL` | Optional | Backend URL (empty = same origin via proxy) |

---

## Portfolio Description

PRD Studio is a full-stack AI product tool that converts raw product ideas into structured, executive-ready PRDs — complete with automated PM critique and one-click iteration. It demonstrates end-to-end thinking across product strategy, AI prompt engineering, modern UI/UX, and full-stack architecture.

### What This Demonstrates as a PM

| Skill | Evidence |
|---|---|
| **Product thinking** | 12-section PRD structure reflects real PM frameworks (Jobs-to-be-Done, RICE, MoSCoW) |
| **Metrics understanding** | KPI framework includes North Star metric, AARRR funnel mapping, and measurable targets |
| **Iteration mindset** | Critique → Score → Improve loop mirrors actual sprint retrospective processes |
| **UX awareness** | Dark-mode SaaS design with glassmorphism, micro-interactions, and progressive disclosure |
| **Cross-functional simulation** | Generates artifacts relevant to Design (personas), Engineering (FRs, NFRs), and Business (KPIs, risks) |
| **AI product design** | Structured prompting to produce consistent, parseable JSON from an LLM — a core modern PM skill |

---

*Built with Claude Sonnet 4.6 · React · TailwindCSS · Express*
