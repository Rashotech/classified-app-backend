const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createChat = {
  body: Joi.object().keys({
    user: Joi.string().custom(objectId).required(),
    listingId: Joi.string().custom(objectId).required()
  }),
};

const loadChat = {
  params: Joi.object().keys({
    chatId: Joi.custom(objectId).required()
  })
};

const sendMessage = {
    body: Joi.object().keys({
      chatId: Joi.string().custom(objectId).required(),
      content: Joi.string().required()
    }),
  };

module.exports = {
    createChat,
    loadChat,
    sendMessage,
};