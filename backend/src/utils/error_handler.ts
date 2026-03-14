export class ErrorHandler extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}