const logger = require('../utils/logger');
module.exports = (err, req, res, next) => {
  logger.error(err.stack || err.message || err);
  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Internal Server Error');
  res.status(status).json({ success: false, message });
};
