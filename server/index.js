import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePrdRoute } from './routes/generatePrd.js';
import { critiquePrdRoute } from './routes/critiquePrd.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }));
app.post('/api/generate-prd', generatePrdRoute);
app.post('/api/critique-prd', critiquePrdRoute);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 PRD Studio API running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
