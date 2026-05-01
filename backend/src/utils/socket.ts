import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketMiddleware } from "../middleware/socketAuthMiddleware";
import { Message } from "../schema/message.schema";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
io.use(socketMiddleware);

export function getUserSocketId(receiver_id: string) {
  return users_socket[receiver_id];
}

const users_socket: any = {};

io.on("connection", async (socket: any) => {
  console.log("A user connected Socket.io=> ", socket.user.user_name);

  const user_id = socket.user_id;
  users_socket[user_id] = socket.id;

  io.emit("getOnlineUsers", Object.keys(users_socket));

  try {
    const undeliveredMessages = await Message.find({
      receiver_id: user_id,
      status: "sent",
    });

    if (undeliveredMessages.length > 0) {
      // Update all to delivered in DB
      await Message.updateMany({ receiver_id: user_id, status: "sent" }, { status: "delivered" });

      // Group by sender and notify each sender
      const senderGroups: Record<string, string[]> = {};
      for (const msg of undeliveredMessages) {
        const sid = msg.sender_id.toString();
        if (!senderGroups[sid]) senderGroups[sid] = [];
        senderGroups[sid].push(msg._id.toString());
      }

      for (const [sender_id, message_ids] of Object.entries(senderGroups)) {
        const sender_socket_id = getUserSocketId(sender_id);
        if (sender_socket_id) {
          // Notify sender for each message
          for (const message_id of message_ids) {
            io.to(sender_socket_id).emit("messageStatus", {
              message_id,
              status: "delivered",
            });
          }
        }
      }
    }
  } catch (error) {
    console.log("[ CONNECTION: deliver pending messages ] ==>> ", error);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected => ", socket.user.user_name);
    delete users_socket[user_id];
    io.emit("getOnlineUsers", Object.keys(users_socket));
  });

  socket.on("messageStatus", async (data: { message_id: string; sender_id: string }) => {
    const { message_id, sender_id } = data;
    try {
      // ✅ Only update to delivered if NOT already read
      const data = await Message.findOneAndUpdate({ _id: message_id, status: { $ne: "read" } }, { status: "delivered" }, { returnDocument: "after" });
      console.log("data :>> ", data);

      const sender_socket_id = getUserSocketId(sender_id);
      if (sender_socket_id) {
        io.to(sender_socket_id).emit("messageStatus", {
          message_id: data?._id,
          status: "delivered",
        });
      }
    } catch (error) {
      console.log("[ EVENT: messageStatus ] ==>> ", error);
    }
  });

  socket.on("messageSeen", async (sender_id: string) => {
    try {
      const receiver_id = socket.user_id;

      await Message.updateMany(
        {
          receiver_id,
          sender_id,
          status: { $ne: "read" },
        },
        { status: "read" },
      );

      const senderSocketId = getUserSocketId(sender_id);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageStatusBulk", {
          receiver_id,
          status: "read",
        });
      }
    } catch (error) {
      console.log("[ EVENT: messageSeen ] ==>> ", error);
    }
  });
});

export { io, app, server };
