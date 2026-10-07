import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

const file = fs.readFileSync(new URL('../docs/openapi.yaml', import.meta.url), 'utf8');
const swaggerDocument = yaml.parse(file);

app.use(
  cors({
    origin: config.corsOrigin,
  })
);

app.use(express.json());

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export { app };
