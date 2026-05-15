import { generatePRD } from '../services/aiService.js';

export async function generatePrdRoute(req, res) {
  const { idea } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
    return res.status(400).json({
      error: 'Please provide a product idea (at least 10 characters)',
    });
  }

  if (idea.trim().length > 2000) {
    return res.status(400).json({
      error: 'Product idea is too long. Please keep it under 2000 characters.',
    });
  }

  try {
    console.log(`[PRD] Generating PRD for: "${idea.slice(0, 60)}..."`);
    const prd = await generatePRD(idea.trim());
    console.log(`[PRD] Generated successfully: "${prd.title}"`);
    return res.json({ success: true, prd });
  } catch (error) {
    console.error('[PRD] Generation error:', error.message);

    if (error.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    return res.status(500).json({
      error: 'Failed to generate PRD. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  }
}
