import jwt from "jsonwebtoken";
import env from 'dotenv';
import { Utils } from "../utils/Utils";
import { User } from "../schema/user.schema";
env.config();

export const socketMiddleware = async (socket: any, next: any) => {
    try {
        const token = socket.handshake.headers.cookie?.split("; ")
            .find((row: any) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("Socket connection rejected: No token provided"));
        }

        const decode: any = jwt.verify(token, process.env.JWT_SECRET!)
        if (Utils.isNull(decode)) {
            return next(new Error("Socket connection rejected: Invalid token"));
        }

        const user = await User.findById(decode.id);
        if (Utils.isNull(user)) {
            return next(new Error("Socket connection rejected: User not found"));
        }

        socket.user = user;
        socket.user_id = user._id.toString();
        // console.log(`Socket authenticated for user: ${user.user_name} (${user._id})`);
        next();
    } catch (error: any) {
        return next(new Error("Socket connection rejected: " + error.message));
    }
}