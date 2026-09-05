const express = require('express');
const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Conversation = require('../models/Conversation');
const env = require('../config/env');
const { initSse, sendSse } = require('../utils/sse');

const router = express.Router();
const openai = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .select('_id title updatedAt')
      .sort({ updatedAt: -1 });

    return res.json(conversations);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const conversation = await Conversation.create({
      user: req.user.id,
      title: 'New chat',
      messages: [],
    });

    return res.status(201).json(conversation);
  } catch (error) {
    return next(error);
  }
});

router.get('/:conversationId', [param('conversationId').isMongoId()], validate, async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.conversationId, user: req.user.id });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.json(conversation);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:conversationId', [param('conversationId').isMongoId()], validate, async (req, res, next) => {
  try {
    const deleted = await Conversation.findOneAndDelete({ _id: req.params.conversationId, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.put(
  '/:conversationId/messages/:messageId',
  [
    param('conversationId').isMongoId(),
    param('messageId').isMongoId(),
    body('content').trim().notEmpty().withMessage('Message content is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const conversation = await Conversation.findOne({ _id: req.params.conversationId, user: req.user.id });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const message = conversation.messages.id(req.params.messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      message.content = req.body.content;
      await conversation.save();

      return res.json(message);
    } catch (error) {
      return next(error);
    }
  },
);

router.delete(
  '/:conversationId/messages/:messageId',
  [param('conversationId').isMongoId(), param('messageId').isMongoId()],
  validate,
  async (req, res, next) => {
    try {
      const conversation = await Conversation.findOne({ _id: req.params.conversationId, user: req.user.id });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const message = conversation.messages.id(req.params.messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      message.deleteOne();
      await conversation.save();

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
);

router.post(
  '/:conversationId/messages',
  [param('conversationId').isMongoId(), body('content').trim().notEmpty().withMessage('Message content is required')],
  validate,
  async (req, res, next) => {
    try {
      if (!openai) {
        return res.status(500).json({ error: 'OpenAI API key is not configured' });
      }

      const conversation = await Conversation.findOne({ _id: req.params.conversationId, user: req.user.id });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const userContent = req.body.content;
      conversation.messages.push({ role: 'user', content: userContent });

      if (conversation.messages.length === 1) {
        conversation.title = userContent.slice(0, 50) || 'New chat';
      }

      await conversation.save();

      initSse(res);

      const history = conversation.messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const stream = await openai.chat.completions.create({
        model: env.openAiModel,
        messages: history,
        stream: true,
      });

      let assistantText = '';

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) {
          assistantText += token;
          sendSse(res, { type: 'token', content: token });
        }
      }

      const assistantMessage = {
        _id: new mongoose.Types.ObjectId(),
        role: 'assistant',
        content: assistantText || 'No response generated.',
      };

      conversation.messages.push(assistantMessage);
      await conversation.save();

      sendSse(res, { type: 'done', message: assistantMessage, conversationId: conversation._id });
      return res.end();
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
      sendSse(res, { type: 'error', error: error.message || 'Failed to stream response' });
      return res.end();
    }
  },
);

module.exports = router;
