import { critiquePRD, improvePRD } from '../lib/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prd, mode, critique } = req.body || {};

  if (!prd || typeof prd !== 'object') {
    return res.status(400).json({ error: 'Valid PRD data is required' });
  }

  try {
    if (mode === 'improve') {
      if (!critique || typeof critique !== 'object') {
        return res.status(400).json({ error: 'Critique data is required for improvement mode' });
      }
      const improved = await improvePRD(prd, critique);
      return res.status(200).json({ success: true, prd: improved });
    }

    const result = await critiquePRD(prd);
    return res.status(200).json({ success: true, critique: result });
  } catch (error) {
    console.error('Critique/improve error:', error.message);

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    return res.status(500).json({
      error: mode === 'improve' ? 'Failed to improve PRD.' : 'Failed to critique PRD.',
    });
  }
}

export const config = {
  maxDuration: 60,
};
