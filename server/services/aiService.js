import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function parseJSON(text) {
  const cleaned = text
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim();
  return JSON.parse(cleaned);
}

export async function generatePRD(idea) {
  const today = new Date().toISOString().split('T')[0];

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: `You are a Senior Staff Product Manager at a top-tier tech company (FAANG level).
You write precise, opinionated, and actionable PRDs that engineering teams can immediately act on.
Your PRDs are known for: specific measurable goals, realistic MVP scoping, and surfacing edge cases others miss.
Always respond with valid JSON only — no markdown, no preamble.`,
    messages: [
      {
        role: 'user',
        content: `Generate a comprehensive, production-quality PRD for this product idea.

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
  "goals": [
    "Specific, measurable goal with a target (e.g. Reduce X by 30% within 6 months)",
    "Another specific goal",
    "Another specific goal"
  ],
  "non_goals": [
    "Explicit exclusion with brief rationale",
    "Another explicit exclusion",
    "Another explicit exclusion"
  ],
  "user_stories": [
    {
      "id": "US-001",
      "as_a": "specific persona type",
      "i_want": "specific action or capability",
      "so_that": "concrete business/personal benefit",
      "priority": "P0|P1|P2",
      "acceptance_criteria": ["measurable criterion 1", "measurable criterion 2", "measurable criterion 3"]
    }
  ],
  "functional_requirements": [
    {
      "id": "FR-001",
      "title": "Feature name",
      "description": "Detailed technical/product description of the feature",
      "priority": "P0|P1|P2",
      "user_impact": "How this directly impacts user value",
      "dependencies": ["any dependency"]
    }
  ],
  "non_functional_requirements": [
    {
      "category": "Performance|Security|Scalability|Reliability|Accessibility|Compliance",
      "requirement": "Specific requirement statement",
      "target": "Measurable target (e.g. p99 < 200ms)"
    }
  ],
  "kpis": {
    "north_star": "Single metric that best represents product success",
    "metrics": [
      {
        "name": "Metric name",
        "description": "What it measures and why it matters",
        "target": "Specific target with timeframe",
        "type": "Acquisition|Activation|Retention|Revenue|Referral",
        "measurement": "How to measure it"
      }
    ]
  },
  "edge_cases": [
    {
      "scenario": "Specific edge case description",
      "likelihood": "Low|Medium|High",
      "handling": "How the system should handle it"
    }
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
    {
      "feature": "Feature name",
      "rationale": "Why this is in MVP vs. later",
      "effort": "S|M|L|XL",
      "value": "Specific user value delivered"
    }
  ],
  "future_roadmap": [
    {
      "phase": "Phase 2 — Q3 2026",
      "theme": "Phase theme",
      "features": ["feature 1", "feature 2", "feature 3"],
      "rationale": "Why this phase comes after MVP"
    }
  ],
  "open_questions": [
    {
      "question": "Specific unresolved question",
      "owner": "Role responsible for answering (e.g. Legal, Engineering, Design)",
      "deadline": "When this needs to be answered"
    }
  ]
}

Requirements:
- Generate exactly 2-3 personas
- Generate exactly 6-8 user stories across P0/P1/P2
- Generate exactly 6-8 functional requirements
- Generate exactly 4-5 non-functional requirements
- Generate exactly 5-6 KPI metrics
- Generate exactly 4-6 edge cases
- Generate exactly 3-4 risks
- Generate exactly 5-7 MVP features
- Generate exactly 2-3 roadmap phases
- Generate exactly 3-4 open questions`,
      },
    ],
  });

  return parseJSON(message.content[0].text);
}

export async function critiquePRD(prd) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: `You are a VP of Product at a top-tier tech company doing a formal PRD review before engineering kickoff.
You are known for being thorough, direct, and catching issues others miss.
Your job is to find gaps, challenge assumptions, and ensure the team doesn't build the wrong thing.
Be specific — never vague. Always respond with valid JSON only.`,
    messages: [
      {
        role: 'user',
        content: `Review this PRD critically. Your review will determine if engineering can start.

PRD:
${JSON.stringify(prd, null, 2)}

Return a JSON object with EXACTLY this structure:

{
  "overall_score": 72,
  "score_rationale": "2 sentences explaining the score",
  "summary": "3 sentences: what this PRD does well, what it's missing, and your overall stance",
  "assumptions_critique": [
    {
      "assumption": "The specific assumption being made in the PRD",
      "concern": "Why this assumption is dangerous or unvalidated",
      "recommendation": "How to validate or de-risk this assumption"
    }
  ],
  "missing_requirements": [
    {
      "area": "Area lacking coverage",
      "gap": "Specific gap in the PRD",
      "importance": "High|Medium|Low",
      "suggestion": "Exactly what to add"
    }
  ],
  "ux_risks": [
    {
      "risk": "Specific UX risk",
      "affected_users": "Which personas are affected",
      "impact": "What breaks or frustrates users",
      "mitigation": "Design or product solution"
    }
  ],
  "engineering_risks": [
    {
      "risk": "Specific technical risk",
      "impact": "Engineering consequence",
      "mitigation": "Technical approach or spike needed"
    }
  ],
  "strengths": [
    "Specific thing this PRD does well",
    "Another specific strength",
    "Another specific strength"
  ],
  "improvements": [
    {
      "priority": "High|Medium|Low",
      "area": "Specific area to improve",
      "suggestion": "Actionable, specific improvement"
    }
  ],
  "verdict": "REVISE",
  "verdict_reason": "2-3 sentence explanation of the verdict — what needs to happen before this can be approved or must be rejected",
  "next_steps": [
    "Concrete, assigned action item 1",
    "Concrete, assigned action item 2",
    "Concrete, assigned action item 3"
  ]
}

Scoring guide: 85+ = APPROVE, 60-84 = REVISE, below 60 = REJECT.
The verdict MUST match the score range.
Generate 3-5 items for each critique section.`,
      },
    ],
  });

  return parseJSON(message.content[0].text);
}

export async function improvePRD(prd, critique) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: `You are a Senior Staff Product Manager revising your PRD after VP feedback.
You address every HIGH priority item from the critique completely.
You improve specificity, close gaps, and tighten scope.
Always respond with valid JSON only.`,
    messages: [
      {
        role: 'user',
        content: `Revise and improve this PRD based on the VP critique. Address all HIGH priority items and missing requirements.

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
The improved PRD should score at least 10-15 points higher than the original.`,
      },
    ],
  });

  return parseJSON(message.content[0].text);
}
