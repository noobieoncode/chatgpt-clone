const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const validate = require('../middleware/validate');
const env = require('../config/env');

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: '7d' });
}

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = String(email).trim().toLowerCase();
      const existing = await User.findOne().where('email').equals(normalizedEmail);

      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      const user = await User.create({ name, email: normalizedEmail, password });
      const token = signToken(user._id);

      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      return next(error);
    }
  },
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await User.findOne().where('email').equals(normalizedEmail);

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = signToken(user._id);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = router;
