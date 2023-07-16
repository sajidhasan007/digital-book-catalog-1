/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
// import { errorlogger, logger } from './shared/logger';

// eslint-disable-next-line no-unused-vars
process.on('uncaughtException', error => {
  // errorlogger.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);

    console.log(`Database is connected successfully`);

    server = app.listen(config.port, () => {
      // logger.info(`Application  listening on port ${config.port}`);
      console.log(`Application  listening on port ${config.port}`);
    });
  } catch (err) {
    // errorlogger.error('Failed to connect database', err);
  }

  // eslint-disable-next-line no-unused-vars
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        // errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
