const { Server } = require('socket.io');
const { server } = require('./../app');
const User = require('./../models/userModel');
const Inbox = require('./../models/Inbox');
const Notification = require('./../models/Notification');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});
let onlineUsers = [];

const addNewUser = (email, socketId) => {
  !onlineUsers.some(user => user.email === email) &&
    onlineUsers.push({ email, socketId });
};
const getUser = email => {
  return onlineUsers.find(user => user.email === email);
};
const removeUser = socketId => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

module.exports = io.on('connection', async socket => {
  console.log('socket connected', socket.id);
  socket.on('userEmail', async data => {
    console.log(data);
    addNewUser(data, socket.id);
    const user = getUser(data);

    await User.updateOne(
      { email: user.email },
      {
        isOnline: true,
      },
    );
  });
  socket.on('message', async data => {
    const inbox = await Inbox({
      senderEmail: data.senderEmail,
      diary: data.shareDiary,
      receiverEmail: data.receiverDiary,
    });
    console.log(data);

    inbox.save(err => {
      console.log(err);
    });
    const notification = await Notification({
      receiverEmail: data.receiverDiary,
      isRed: false,
      senderEmail: data.senderEmail,
    });
    notification.save(err => {
      console.log(err);
    });
    const user = getUser(data.receiverDiary);
    console.log(user);
    if (user?.socketId) {
      console.log('entered sendDIary');
      socket.to(user?.socketId).emit('sendDiary', {
        inbox,
      });
      socket.to(user?.socketId).emit('sendNotification', notification);
      socket.to(user?.socketId).emit('notification', notification);
    }
  });

  socket.on('disconnect', async () => {
    console.log('User Disconnected');
    removeUser(socket.id);
  });

  socket.on('connect_error', err => {
    console.log(`connect_error due to ${err.message}`);
  });
});
