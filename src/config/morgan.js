const morgan = require('morgan');
const logger = require('./logger'); 

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getLogFormat = () => {
  return (tokens, req, res) => {
    const logObject = {
      remoteAddr: tokens['remote-addr'](req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: tokens['response-time'](req, res) + 'ms',
      message: tokens.message(req, res),
    };
    return JSON.stringify(logObject);
  };
};

const successHandler = morgan(getLogFormat(), {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message) },
});

const errorHandler = morgan(getLogFormat(), {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message) },
});

module.exports = {
  successHandler,
  errorHandler,
};
