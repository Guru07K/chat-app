import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { User } from "../schema/user.schema";
import { Message } from "../schema/message.schema";
import { Utils } from "../utils/Utils";
import cloudinary from "../service/cloudinary/clodinary.service";
import { getReceiverSocketId, io } from "../utils/socket";
import { messaging } from "../service/Firebase/firebase";

export class MessageController extends BaseController {

    // API : /api/v1/message/contacts
    public getAllContacts = async (req: Request | any, res: Response, next: NextFunction) => {
        try {
            const logged_user_id = req.user._id;

            const users = await User.find({ _id: { $ne: logged_user_id } })
            return this.sendSuccessResponse(res, 200, "Contacts fetched successfully", { users: users });

        } catch (error: any) {
            return this.sendErrorResponse(next, 500, error.message);
        }
    }

    // API : /api/v1/message/send/:id
    public sendMessage = async (req: Request | any, res: Response, next: NextFunction) => {
        try {
            const { text, image } = req.body;
            const { id: receiver_id } = req.params;
            const sender_id = req.user._id;


            let image_url;
            if (!Utils.isNull(image)) {
                // const data = await Cloudinary.uploader.upload(image);
                const data = await cloudinary.uploader.upload(image, {
                    folder: "messages",
                });
                image_url = data.secure_url;
            }

            const user = await User.findById(sender_id);

            const message = await Message.create({ sender_id, receiver_id, text, image: image_url });

            const receiver_socket_id = getReceiverSocketId(receiver_id);
            if (receiver_socket_id) {
                io.to(receiver_socket_id).emit("newMessage", message);
            } else {
                const receiver = await User.findById(receiver_id);

                if (receiver?.fcm_token) {
                    await messaging.send({
                        token: receiver.fcm_token,
                        data: {
                            title: user?.user_name || "",
                            body: message.text || "📷 Image",
                            sender_id: sender_id.toString(),
                            url: `${process.env.CLIENT_URL}/chat/${sender_id}`
                        }
                    });
                }
            }

            return this.sendSuccessResponse(res, 200, "Message sent successfully", { message });

        } catch (error: any) {
            console.log('error :>> ', error);
            return this.sendErrorResponse(next, 500, error.message);
        }
    }

    // API : /api/v1/message/:id
    public getMessagesByUserId = async (req: Request | any, res: Response, next: NextFunction) => {
        try {
            const my_id = req.user._id;
            const { id: user_to_chat_id } = req.params;

            const messages = await Message.find({
                $or: [
                    { sender_id: my_id, receiver_id: user_to_chat_id },
                    { sender_id: user_to_chat_id, receiver_id: my_id }
                ]
            })

            return this.sendSuccessResponse(res, 200, "Messages fetched successfully", { messages });

        } catch (error: any) {
            return this.sendErrorResponse(next, 500, error.message);
        }
    }

    // API : /api/v1/message/chats
    public getPartnersChat = async (req: Request | any, res: Response, next: NextFunction) => {
        try {
            const my_id = req.user._id;

            const messages = await Message.find({
                $or: [{ sender_id: my_id }, { receiver_id: my_id }]
            })

            const chat_partner_ids = [...new Set(messages.map((msg) => {
                return msg.sender_id.toString() === my_id.toString() ? msg.receiver_id.toString() : msg.sender_id.toString()
            }))]

            const chat_partners = await User.find({ _id: { $in: chat_partner_ids } })

            return this.sendSuccessResponse(res, 200, "Chat partners fetched successfully", { chat_partners: chat_partners });
        } catch (error: any) {
            return this.sendErrorResponse(next, 500, error.message);
        }
    }

}