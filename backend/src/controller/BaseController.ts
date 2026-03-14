import { NextFunction, Response } from "express";
import { ErrorHandler } from "../utils/error_handler";

export class BaseController {

    protected sendErrorResponse(next: NextFunction, statusCode: number, message: string) {
        next(new ErrorHandler(statusCode, message));
    }

    protected sendSuccessResponse(res: Response, statusCode: number, message: string, data?: any) {
        res.status(statusCode).json({
            status: "Success",
            message: message,
            data: data
        });
    }

    protected setCookie(res: Response, name: string, value: string, options?: any) {
        res.cookie(name, value, options);
    }
}