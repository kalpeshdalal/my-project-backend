const winston = require('winston');
require('winston-daily-rotate-file'); // Required for rotating log files daily.
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logFormat = winston.format.combine(
  enumerateErrorFormat(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

const transports = [
  new winston.transports.Console({
    stderrLevels: ['error'],
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  }),
//   // This transport is for rotating application log files daily.
//   new winston.transports.DailyRotateFile({
//     filename: 'logs/application-%DATE%.log', // Log file name pattern for application logs.
//     datePattern: 'YYYY-MM-DD', // Date pattern used in the log file name.
//     zippedArchive: true, // Enables log file compression.
//     maxSize: '20m', // Maximum size of log file before it's rotated.
//     maxFiles: '14d', // Maximum age of log file before it's deleted.
//     level: config.env === 'development' ? 'debug' : 'info', // Log level.
//     format: logFormat // Log format.
//   }),
//   // This transport is for rotating error log files daily.
//   new winston.transports.DailyRotateFile({
//     filename: 'logs/error-%DATE%.log', // Log file name pattern for error logs.
//     datePattern: 'YYYY-MM-DD', // Date pattern used in the log file name.
//     zippedArchive: true, // Enables log file compression.
//     maxSize: '20m', // Maximum size of log file before it's rotated.
//     maxFiles: '30d', // Maximum age of log file before it's deleted.
//     level: 'error', // Log level for this transport is set to only log errors.
//     format: logFormat // Log format.
//   })
];

if (config.env === 'production') {
  require('winston-mongodb');
  transports.push(new winston.transports.MongoDB({
    level: 'error',
    db: config.mongoose.url,
    options: {
      useUnifiedTopology: true
    },
    collection: 'log',
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.metadata()
    )
  }));
}

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.splat(),
    logFormat
  ),
  transports
});

module.exports = logger;
