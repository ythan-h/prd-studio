import { critiquePRD, improvePRD } from '../lib/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[critique-prd] ANTHROPIC_API_KEY is not set');
    return res.status(500).json({
      error: 'Server misconfigured: ANTHROPIC_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { prd, mode, critique } = body || {};

  if (!prd || typeof prd !== 'object') {
    return res.status(400).json({ error: 'Valid PRD data is required' });
  }

  const startedAt = Date.now();
  const action = mode === 'improve' ? 'improve' : 'critique';
  console.log(`[critique-prd] Starting ${action} for: "${prd.title}"`);

  try {
    if (mode === 'improve') {
      if (!critique || typeof critique !== 'object') {
        return res.status(400).json({ error: 'Critique data is required for improvement mode' });
      }
      const improved = await improvePRD(prd, critique);
      console.log(`[critique-prd] Improve done in ${Date.now() - startedAt}ms`);
      return res.status(200).json({ success: true, prd: improved });
    }

    const result = await critiquePRD(prd);
    console.log(`[critique-prd] Critique done in ${Date.now() - startedAt}ms — score: ${result.overall_score}`);
    return res.status(200).json({ success: true, critique: result });
  } catch (error) {
    console.error(`[critique-prd] Failed ${action} after ${Date.now() - startedAt}ms:`, error.message, error.stack);

    if (error.status === 401) {
      return res.status(500).json({ error: 'Invalid ANTHROPIC_API_KEY. Verify it in Vercel env vars.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }
    if (error.status === 400 && /credit balance/i.test(error.message || '')) {
      return res.status(402).json({
        error: 'Your Anthropic account has no credits. Add credits at console.anthropic.com/settings/billing to use the app.',
      });
    }
    if (error instanceof SyntaxError) {
      return res.status(502).json({ error: 'AI returned malformed JSON. Please try again.' });
    }

    return res.status(500).json({
      error: `Failed to ${action} PRD: ${error.message || 'Unknown error'}`,
    });
  }
}

export const config = {
  maxDuration: 60,
};
