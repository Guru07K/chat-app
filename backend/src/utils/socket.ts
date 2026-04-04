import { Server } from "socket.io";
import express from "express";
import http from 'http'
import { socketMiddleware } from "../middleware/socketAuthMiddleware";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});
io.use(socketMiddleware);

export function getReceiverSocketId(receiver_id: string) {
    return users_socket[receiver_id];
}

const users_socket: any = {};

io.on("connection", (socket: any) => {
    console.log("A user connected Socket.io=> ", socket.user.user_name);

    const user_id = socket.user_id;
    users_socket[user_id] = socket.id;

    io.emit("getOnlineUsers", Object.keys(users_socket));

    socket.on("disconnect", () => {
        console.log("A user disconnected => ", socket.user.user_name);
        delete users_socket[user_id];
        io.emit("getOnlineUsers", Object.keys(users_socket));
    })

    socket.on("sendMessage", () => {

    })

});

export { io, app, server }