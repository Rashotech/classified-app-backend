const httpStatus = require("http-status");
const mongoose = require("mongoose");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { Expo } = require("expo-server-sdk");
const sendPushNotification = require('../utils/pushNotifications');

const createChat = async (sender, receiver, listingId) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        users: {
          $size: 2,
          $all: [
            { $elemMatch: { $eq: mongoose.Types.ObjectId(sender) } },
            { $elemMatch: { $eq: mongoose.Types.ObjectId(receiver) } },
          ],
        },
        ads: listingId,
      },
      {
        $setOnInsert: {
          users: [sender, receiver],
          ads: listingId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    ).populate("users");
    return chat;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create chat");
  }
};

const chatList = async (userId, unreadOnly = undefined) => {
  let results;
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users")
      .populate("ads")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // if (
    //     unreadOnly !== undefined &&
    //     unreadOnly == "true"
    // ) {
    //     chats = chats.filter(
    //       (r) =>
    //         r.latestMessage && !r.latestMessage.readBy.includes(userId)
    //     );
    //   }
    results = await User.populate(chats, { path: "latestMessage.sender" });
    return results;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const loadChat = async (userId, chatId) => {
  Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } })
    .populate("users")
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.log(error);
      throw new ApiError(httpStatus.BAD_REQUEST, error);
    });
};

const sendMessage = async (sender, chatId, content) => {
  var newMessage = {
    sender,
    content,
    chat: chatId
  };

  try {
    var message =  await Message.create(newMessage);
    await message.populate("sender");
    await message.populate("chat");
    message = await User.populate(message, { path: "chat.users" });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message }).catch(
      (error) => console.log(error)
    );
    await Message.updateOne({ _id: message._id }, { $addToSet: { readBy: sender } });

    const users = message.chat.users;

    const expoPushToken = getExpoToken(users, sender);

    if(expoPushToken !== undefined) {
      if (Expo.isExpoPushToken(expoPushToken))
        await sendPushNotification(expoPushToken, content);
    }

    return message;

  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const getExpoToken = (users, sender) => {
  const result = users.filter((user) => {
    return user._id.toString() !== sender.toString()
  });
  return result[0].expoPushToken
}

const getChatMessages = async (chatId) => {
  try {
    const messages = await Message.find({ chat: chatId }).populate("sender");
    return messages;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const markChatAsRead = async (userId, chatId) => {
  Message.updateMany({ chat: chatId }, { $addToSet: { readBy: userId } })
    .then((results) => {
      return results;
    })
    .catch((error) => {
      console.log(error);
      throw new ApiError(httpStatus.BAD_REQUEST, error);
    });
};

module.exports = {
  createChat,
  chatList,
  loadChat,
  sendMessage,
  getChatMessages,
  markChatAsRead,
};
