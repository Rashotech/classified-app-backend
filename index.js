const app = require('./app');
require('./config/database');
const PORT = process.env.PORT || 3000;

let server;

server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = require("socket.io")(server, { pingTimeout: 30000 });

// Socket Io Instance & Events
io.on("connection", socket => {
  console.log('User connected');

  socket.on("setup", userData => {
      socket.join(userData._id);
      socket.emit("connected");
  })

  socket.on("joinRoom", room =>{ 
    socket.join(room)
  });

  socket.on("typing", room => {
    socket.in(room).emit("typing")
  });
  socket.on("stop typing", room => {
    socket.in(room).emit("stop typing")
  });
  socket.on("notification received", room => socket.in(room).emit("notification received"));

  socket.on("newMessage", newMessage => {
    var chat = newMessage.data.chat;

    // socket.in(chat._id).emit("messageReceived", newMessage);

    if(!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach(user => {
        
        if(user._id == newMessage.data.sender._id) return;
        socket.in(user._id).emit("messageReceived", newMessage);
    })
  })
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
    console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});