import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = process.env.JWT_SECRET || "your-secret-key";
const port = process.env.PORT || 4000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "user123" }, secretKeyJWT, { expiresIn: "1h" });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      message: "Login Success",
    });
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) {
      console.error("No token provided");
      return next(new Error("Authentication Error"));
    }

    try {
      const decoded = jwt.verify(token, secretKeyJWT);
      socket.user = decoded; // Attach user data to the socket
      next();
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return next(new Error("Authentication Error"));
    }
  });
});

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.user._id} joined room ${room}`);
    socket.to(room).emit("notification", `User ${socket.user._id} has joined the room.`);
  });

  socket.on("message", ({ room, message }) => {
    console.log(`Message from ${socket.user._id} in room ${room}: ${message}`);
    socket.to(room).emit("receive-message", { sender: socket.user._id, message });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
