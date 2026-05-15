const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
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
