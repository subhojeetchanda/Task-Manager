import { app } from './app.js';
import { config } from './config/env.js';

const startServer = () => {
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
};

startServer();
