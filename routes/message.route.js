const express = require('express');
const validate = require('../middleware/validate');

const messageValidation = require('../validations/message.validation');
const chatController = require('../controllers/message.controller');

const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(), validate(messageValidation.createChat), chatController.createChat);
router.get('/', auth(), chatController.chatList);
router.get('/:chatId', auth(), validate(messageValidation.loadChat), chatController.loadChat);
router.post('/message', auth(), validate(messageValidation.sendMessage), chatController.sendMessage);
router.get('/:chatId/messages', auth(), validate(messageValidation.loadChat), chatController.getChatMessages);
router.put('/:chatId/messages/markAsRead', auth(), validate(messageValidation.loadChat),  chatController.markChatAsRead);

module.exports = router;    




