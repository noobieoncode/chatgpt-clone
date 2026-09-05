const jwt = require('jsonwebtoken');
const env = require('../config/env');

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.id };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = auth;
