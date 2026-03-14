import { Response, Request, NextFunction } from "express";
import { ErrorHandler } from "../utils/error_handler";

export class ErrorMiddleware {
    public globalErrorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {

        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(statusCode).json({
            status: "Failed",
            message: message,
        });
    }

}