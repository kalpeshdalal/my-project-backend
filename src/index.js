const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./app");
const logger = require("./config/logger");

let server;
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("MongoDB Connected");
    server = app.listen(config.port, () => {
      logger.info(`Server running on PORT ${config.port}`);
    });
  })
  .catch((err) => logger.error("MongoDB connection error:", err));


  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info(`Server closed from PORT ${config.port}`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);   

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
  