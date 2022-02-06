const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const messageService = require("../services/message.service");

const createChat = catchAsync(async (req, res) => {
  const chat = await messageService.createChat(
    req.user._id,
    req.body.user,
    req.body.listingId
  );
  res.status(httpStatus.CREATED).send(chat);
});

const chatList = catchAsync(async (req, res) => {
  const chats = await messageService.chatList(req.user._id);
  return res.send(chats);
});

const loadChat = catchAsync(async (req, res) => {
  const chats = await messageService.loadChat(req.user._id, req.params.chatId);
  res.send(chats);
});

const sendMessage = catchAsync(async (req, res) => {
  const message = await messageService.sendMessage(
    req.user._id,
    req.body.chatId,
    req.body.content
  );
  res.status(httpStatus.CREATED).send(message);
});

const getChatMessages = catchAsync(async (req, res) => {
  const messages = await messageService.getChatMessages(req.params.chatId);
  res.send(messages);
});

const markChatAsRead = catchAsync(async (req, res) => {
  await messageService.markChatAsRead(req.user._id, req.params.chatId);
  res.sendStatus(204);
});

module.exports = {
  createChat,
  chatList,
  loadChat,
  sendMessage,
  getChatMessages,
  markChatAsRead,
};
