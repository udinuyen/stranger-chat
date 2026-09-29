import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const PORT = process.env.PORT || 3000;
const ROOM = 'stranger-chat';
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('join', (user) => {
    const userData = {
      id: user.id || socket.id,
      name: user.name || 'Người lạ',
      avatar: user.avatar || null,
    };
    onlineUsers.set(socket.id, userData);
    socket.join(ROOM);

    io.to(ROOM).emit('onlineUsers', Array.from(onlineUsers.values()));
    io.to(ROOM).emit('systemMessage', {
      text: `${userData.name} đã tham gia`,
      time: new Date().toISOString(),
    });
  });

  socket.on('sendMessage', (msg) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text: msg.text,
      userId: user.id,
      userName: user.name,
      avatar: user.avatar,
      time: new Date().toISOString(),
    };
    io.to(ROOM).emit('newMessage', message);
  });

  socket.on('typing', (isTyping) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      socket.to(ROOM).emit('userTyping', {
        userName: user.name,
        isTyping,
      });
    }
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.to(ROOM).emit('onlineUsers', Array.from(onlineUsers.values()));
      io.to(ROOM).emit('systemMessage', {
        text: `${user.name} đã rời`,
        time: new Date().toISOString(),
      });
    }
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'OK', online: onlineUsers.size });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server chạy tại http://0.0.0.0:${PORT}`);
});