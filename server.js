const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
let users = []; // stores {id, username, room}

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Chat Server is Running");
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", ({ username, room }) => {
    socket.username = username;
    socket.room = room;

    socket.join(room);

    // Add user to users list
    users.push({ id: socket.id, username, room });

    // Notify others in the room
    socket.to(room).emit("message", {
      username: "System",
      message: `${username} joined the chat`,
      time: new Date().toLocaleTimeString()
    });

    // Send updated user list to all in the room
    io.to(room).emit("roomUsers", {
      room,
      users: users.filter(u => u.room === room)
    });

    console.log(`${username} joined room ${room}`);
  });

  // Receive and broadcast message
  socket.on("chatMessage", ({ username, room, message }) => {
    io.to(room).emit("message", {
      username,
      message,
      time: new Date().toLocaleTimeString()
    });
  });

  // Typing indicator (inside connection)
  socket.on("typing", () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit("displayTyping", {
        username: socket.username
      });
    }
  });

  socket.on("stopTyping", () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit("hideTyping", {
        username: socket.username
      });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const userIndex = users.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      const user = users[userIndex];
      users.splice(userIndex, 1);

      // Notify room
      socket.to(user.room).emit("message", {
        username: "System",
        message: `${user.username} left the chat`,
        time: new Date().toLocaleTimeString()
      });

      // Send updated users list
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: users.filter(u => u.room === user.room)
      });
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

