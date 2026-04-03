import { CookieOptions, NextFunction, Response } from "express";
import { ErrorHandler } from "../utils/error_handler";

export class BaseController {

    protected sendErrorResponse(next: NextFunction, statusCode: number, message: string) {
        next(new ErrorHandler(statusCode, message));
    }

    protected sendSuccessResponse(res: Response, statusCode: number, message: string, data?: any) {
        res.status(statusCode).json({
            status: "Success",
            message: message,
            result: data
        });
    }

    protected setCookie(res: Response, name: string, value: string, options: CookieOptions) {
        res.cookie(name, value, options);
    }

    protected clearCookie(res: Response, name: string, options?: CookieOptions) {
        res.clearCookie(name, options);
    }
}