const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4-flash:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
].filter(Boolean);

function parseJSON(text) {
  const cleaned = text
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim();

  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    return JSON.parse(cleaned.slice(first, last + 1));
  }
  return JSON.parse(cleaned);
}

async function callModel({ system, user, maxTokens = 8000, model = MODEL_CHAIN[0] }) {
  if (!process.env.OPENROUTER_API_KEY) {
    const err = new Error('OPENROUTER_API_KEY is not set');
    err.status = 401;
    throw err;
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'https://prd-studio.vercel.app',
      'X-Title': 'PRD Studio',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`OpenRouter ${res.status}: ${text.slice(0, 500)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenRouter returned empty content: ' + JSON.stringify(data).slice(0, 300));
  }
  return content;
}

async function callWithFallback({ system, user, maxTokens }) {
  let lastErr;
  for (const model of MODEL_CHAIN) {
    try {
      return await callModel({ system, user, maxTokens, model });
    } catch (err) {
      lastErr = err;
      const retryable = err.status === 429 || err.status === 503 || err.status === 404;
      if (!retryable) throw err;
      console.warn(`[aiService] Model ${model} failed (${err.status}), trying next in chain`);
    }
  }
  throw lastErr;
}

export async function generatePRD(idea) {
  const today = new Date().toISOString().split('T')[0];

  const content = await callWithFallback({
    maxTokens: 8000,
    system: `You are a Senior Staff Product Manager at a top-tier tech company (FAANG level).
You write precise, opinionated, and actionable PRDs that engineering teams can immediately act on.
Your PRDs are known for: specific measurable goals, realistic MVP scoping, and surfacing edge cases others miss.
You MUST respond with valid JSON only — no markdown code blocks, no preamble, no explanation.`,
    user: `Generate a comprehensive, production-quality PRD for this product idea.

Product Idea: ${idea}

Return a JSON object with EXACTLY this structure. Be specific, realistic, and opinionated:

{
  "title": "Short product name",
  "tagline": "Single compelling sentence describing the product",
  "version": "1.0",
  "date": "${today}",
  "problem_statement": "3-4 sentences explaining the core pain point, who suffers from it, current inadequate solutions, and why now is the right time to solve it",
  "personas": [
    {
      "name": "Full name e.g. Marcus Chen",
      "role": "Specific job title",
      "company_type": "Type of company they work at",
      "description": "2 sentences describing their context and day-to-day",
      "pain_points": ["specific pain point", "specific pain point", "specific pain point"],
      "goals": ["concrete goal", "concrete goal"],
      "tech_savviness": "Low|Medium|High"
    }
  ],
  "goals": ["Specific measurable goal with a target", "Another", "Another"],
  "non_goals": ["Explicit exclusion with rationale", "Another", "Another"],
  "user_stories": [
    {
      "id": "US-001",
      "as_a": "specific persona type",
      "i_want": "specific action or capability",
      "so_that": "concrete benefit",
      "priority": "P0|P1|P2",
      "acceptance_criteria": ["criterion 1", "criterion 2", "criterion 3"]
    }
  ],
  "functional_requirements": [
    {
      "id": "FR-001",
      "title": "Feature name",
      "description": "Detailed description",
      "priority": "P0|P1|P2",
      "user_impact": "How this impacts user value",
      "dependencies": ["any dependency"]
    }
  ],
  "non_functional_requirements": [
    {
      "category": "Performance|Security|Scalability|Reliability|Accessibility|Compliance",
      "requirement": "Specific requirement",
      "target": "Measurable target (e.g. p99 < 200ms)"
    }
  ],
  "kpis": {
    "north_star": "Single metric that best represents product success",
    "metrics": [
      {
        "name": "Metric name",
        "description": "What it measures",
        "target": "Specific target with timeframe",
        "type": "Acquisition|Activation|Retention|Revenue|Referral",
        "measurement": "How to measure it"
      }
    ]
  },
  "edge_cases": [
    { "scenario": "Specific edge case", "likelihood": "Low|Medium|High", "handling": "How to handle it" }
  ],
  "risks": [
    {
      "title": "Risk name",
      "description": "Specific risk description",
      "category": "Technical|Market|Legal|Operational|Security",
      "severity": "High|Medium|Low",
      "probability": "High|Medium|Low",
      "mitigation": "Concrete mitigation strategy"
    }
  ],
  "mvp_scope": [
    { "feature": "Feature name", "rationale": "Why in MVP vs later", "effort": "S|M|L|XL", "value": "User value" }
  ],
  "future_roadmap": [
    { "phase": "Phase 2 — Q3 2026", "theme": "Phase theme", "features": ["feature 1", "feature 2"], "rationale": "Why this phase" }
  ],
  "open_questions": [
    { "question": "Specific question", "owner": "Role responsible", "deadline": "When needed" }
  ]
}

Requirements:
- Generate 2-3 personas
- Generate 6-8 user stories across P0/P1/P2
- Generate 6-8 functional requirements
- Generate 4-5 non-functional requirements
- Generate 5-6 KPI metrics
- Generate 4-6 edge cases
- Generate 3-4 risks
- Generate 5-7 MVP features
- Generate 2-3 roadmap phases
- Generate 3-4 open questions

Respond with ONLY the JSON object. No markdown, no preamble.`,
  });

  return parseJSON(content);
}

export async function critiquePRD(prd) {
  const content = await callWithFallback({
    maxTokens: 4000,
    system: `You are a VP of Product at a top-tier tech company doing a formal PRD review before engineering kickoff.
You are known for being thorough, direct, and catching issues others miss.
Your job is to find gaps, challenge assumptions, and ensure the team doesn't build the wrong thing.
Be specific — never vague. You MUST respond with valid JSON only — no markdown, no preamble.`,
    user: `Review this PRD critically. Your review will determine if engineering can start.

PRD:
${JSON.stringify(prd, null, 2)}

Return a JSON object with EXACTLY this structure:

{
  "overall_score": 72,
  "score_rationale": "2 sentences explaining the score",
  "summary": "3 sentences: what this PRD does well, what it's missing, and your overall stance",
  "assumptions_critique": [
    { "assumption": "...", "concern": "...", "recommendation": "..." }
  ],
  "missing_requirements": [
    { "area": "...", "gap": "...", "importance": "High|Medium|Low", "suggestion": "..." }
  ],
  "ux_risks": [
    { "risk": "...", "affected_users": "...", "impact": "...", "mitigation": "..." }
  ],
  "engineering_risks": [
    { "risk": "...", "impact": "...", "mitigation": "..." }
  ],
  "strengths": ["...", "...", "..."],
  "improvements": [
    { "priority": "High|Medium|Low", "area": "...", "suggestion": "..." }
  ],
  "verdict": "REVISE",
  "verdict_reason": "2-3 sentences explaining the verdict",
  "next_steps": ["action 1", "action 2", "action 3"]
}

Scoring guide: 85+ = APPROVE, 60-84 = REVISE, below 60 = REJECT.
The verdict MUST match the score range.
Generate 3-5 items for each critique section.

Respond with ONLY the JSON object. No markdown, no preamble.`,
  });

  return parseJSON(content);
}

export async function improvePRD(prd, critique) {
  const content = await callWithFallback({
    maxTokens: 8000,
    system: `You are a Senior Staff Product Manager revising your PRD after VP feedback.
You address every HIGH priority item from the critique completely.
You improve specificity, close gaps, and tighten scope.
You MUST respond with valid JSON only — no markdown, no preamble.`,
    user: `Revise and improve this PRD based on the VP critique. Address all HIGH priority items and missing requirements.

Original PRD:
${JSON.stringify(prd, null, 2)}

VP Critique:
${JSON.stringify(critique, null, 2)}

Return the IMPROVED PRD using the exact same JSON structure as the original.
Make every section measurably better:
- Add missing requirements the critique identified
- Strengthen vague goals with specific metrics
- Add edge cases that were missed
- Improve acceptance criteria for user stories
- Address technical and UX risks in the requirements
The improved PRD should score at least 10-15 points higher than the original.

Respond with ONLY the JSON object. No markdown, no preamble.`,
  });

  return parseJSON(content);
}
