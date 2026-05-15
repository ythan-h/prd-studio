import { generatePRD } from '../lib/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea } = req.body || {};

  if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a product idea (at least 10 characters)' });
  }

  if (idea.trim().length > 2000) {
    return res.status(400).json({ error: 'Product idea is too long. Please keep it under 2000 characters.' });
  }

  try {
    const prd = await generatePRD(idea.trim());
    return res.status(200).json({ success: true, prd });
  } catch (error) {
    console.error('Generate PRD error:', error.message);

    if (error.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    return res.status(500).json({ error: 'Failed to generate PRD. Please try again.' });
  }
}

export const config = {
  maxDuration: 60,
};
