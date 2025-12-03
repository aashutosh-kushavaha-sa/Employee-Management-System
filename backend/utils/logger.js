const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
  transports: [
    new transports.Console({ level: 'debug' }),
    // You can add file transports if required
    // new transports.File({ filename: 'combined.log' })
  ],
});

module.exports = logger;
