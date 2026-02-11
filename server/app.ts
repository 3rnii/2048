import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import promptRouter from './routes/prompt.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/prompt', promptRouter);

  return app;
}

const app = createApp();
export default app;
