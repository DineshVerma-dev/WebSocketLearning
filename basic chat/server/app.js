import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.get("/", (_, res) => {
    res.send("hello world")
})

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id : ", socket.id);

    socket.on("disconnect", () => {
        console.log(`User disconnnected ${socket.id}`)
    })

})


server.listen(4000, () => {
    console.log(`Server is running on port ${4000}`);
})