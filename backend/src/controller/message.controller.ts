import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { User } from "../schema/user.schema";
import { Message } from "../schema/message.schema";
import { Utils } from "../utils/Utils";
import Cloudinary from "../service/cloudinary/clodinary.service";

export class MessageController extends BaseController {

    // API : /api/v1/message/contacts
    public getAllContacts = async (req: Request | any, res: Response, next: NextFunction) => {
        try {
            const logged_user_id = req.user._id;

            const users = await User.find({ _id: { $ne: logged_user_id } })
            return this.sendSuccessResponse(res, 200, "Contacts fetched successfully", users);

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
                const data = await Cloudinary.uploader.upload(image);
                image_url = data.secure_url;
            }

            const message = await Message.create({ sender_id, receiver_id, text, image: image_url });
            return this.sendSuccessResponse(res, 200, "Message sent successfully", message);

        } catch (error: any) {
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

            return this.sendSuccessResponse(res, 200, "Messages fetched successfully", messages);

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

            return this.sendSuccessResponse(res, 200, "Chat partners fetched successfully", chat_partners);
        } catch (error: any) {
            return this.sendErrorResponse(next, 500, error.message);
        }
    }

}