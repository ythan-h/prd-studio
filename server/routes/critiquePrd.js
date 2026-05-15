import { critiquePRD, improvePRD } from '../services/aiService.js';

export async function critiquePrdRoute(req, res) {
  const { prd, mode, critique } = req.body;

  if (!prd || typeof prd !== 'object') {
    return res.status(400).json({ error: 'Valid PRD data is required' });
  }

  try {
    if (mode === 'improve') {
      if (!critique || typeof critique !== 'object') {
        return res.status(400).json({ error: 'Critique data is required for improvement mode' });
      }
      console.log(`[PRD] Improving PRD: "${prd.title}"`);
      const improved = await improvePRD(prd, critique);
      console.log(`[PRD] Improved successfully: "${improved.title}"`);
      return res.json({ success: true, prd: improved });
    } else {
      console.log(`[PRD] Critiquing PRD: "${prd.title}"`);
      const result = await critiquePRD(prd);
      console.log(`[PRD] Critique complete — score: ${result.overall_score}, verdict: ${result.verdict}`);
      return res.json({ success: true, critique: result });
    }
  } catch (error) {
    console.error('[PRD] Critique/improve error:', error.message);

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    return res.status(500).json({
      error: mode === 'improve' ? 'Failed to improve PRD.' : 'Failed to critique PRD.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  }
}
