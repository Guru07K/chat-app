import { NextFunction, Request, Response } from "express";
import { Utils } from "../utils/Utils";
import { ErrorHandler } from "../utils/error_handler";
import jwt from "jsonwebtoken";
import { User } from "../schema/user.schema";

export class Authenticator {
    public isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.token;
        if (Utils.isNull(token)) {
            return next(new ErrorHandler(401, "Login required to access this resource"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        const user = await User.findById(decoded.id);
        if (Utils.isNull(user)) {
            return next(new ErrorHandler(401, "Unauthorized user"));
        }
        next();
    }
}