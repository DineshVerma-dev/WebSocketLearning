import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server)

app.get("/", (req, res) => {
    res.send("hello world")
})
io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id : ", socket.id);
})
app.listen(4000, () => {
    console.log("app started at port : 4000 ")
})