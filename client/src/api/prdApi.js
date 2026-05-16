const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, body) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}. Check your connection.`);
  }

  const text = await res.text();

  if (!text) {
    if (res.status === 504 || res.status === 502) {
      throw new Error(
        `The AI took too long to respond (HTTP ${res.status}). The serverless function timed out. ` +
        `Check Vercel → Functions → Logs and confirm maxDuration: 60 is applied.`
      );
    }
    throw new Error(
      `Server returned an empty response (HTTP ${res.status}). ` +
      `The function likely crashed before responding. Check Vercel function logs and verify ANTHROPIC_API_KEY is set.`
    );
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned a non-JSON response (HTTP ${res.status}). ` +
      `Check Vercel function logs — the function probably threw before sending JSON.`
    );
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (HTTP ${res.status})`);
  }

  return data;
}

export async function generatePRD(idea) {
  const data = await request('/api/generate-prd', { idea });
  return data.prd;
}

export async function critiquePRD(prd) {
  const data = await request('/api/critique-prd', { prd });
  return data.critique;
}

export async function improvePRD(prd, critique) {
  const data = await request('/api/critique-prd', { prd, critique, mode: 'improve' });
  return data.prd;
}
