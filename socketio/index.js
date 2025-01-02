import { Socket } from 'dgram';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from "socket.io"


const app = express();
const server = createServer(app);
const io = new Server(server)

app.use(express.static(path.resolve("./public")))


app.get('/', (req, res) => {
    return res.sendFile("/public/index.html");
});

io.on('connection', (socket) => {
    console.log('A new user has connected', socket.id)

    socket.on("user-message", (message) => {               // --> frontend se msg server me la reh h
        console.log("A new msg received from frontend : ", message);

        io.emit("msg-from-server-to-frontend", message)    
        console.log("msg-from-server-to-frontend: ", message);            // --> server  se frontend me leke ja rh h
    })               
})                                                         // bidirection event is happening here amazing

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});