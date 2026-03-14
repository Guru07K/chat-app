import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BaseController } from "./BaseController";
import { GetUserFilter, LoginRequest, SignUpRequest, UpdateUserRequest } from '../model/auth_model';
import { User } from '../schema/user.schema';
import { Utils } from '../utils/Utils';
import { UserEmailService } from '../service/email/user_email.service';

export class AuthController extends BaseController {

    // API ==> /api/v1/auth/signup
    public signUpUser = async (req: Request, res: Response, next: NextFunction) => {
        const signup_req = req.body as SignUpRequest;

        if (signup_req.password !== signup_req.confirm_password) {
            return this.sendErrorResponse(next, 400, "Password and confirm password didn't match");
        }
        if (signup_req.password.length < 8) {
            return this.sendErrorResponse(next, 400, "Password must be at least 8 characters long");
        }

        let user = await User.findOne({ email: signup_req.email });
        if (!Utils.isNull(user)) {
            return this.sendErrorResponse(next, 400, "User already exists with this email");
        }

        const hashed_password = await bcrypt.hash(signup_req.password, 10);

        user = await User.create({ ...signup_req, password: hashed_password });
        const { password, ...rest } = user.toObject();

        if (Utils.isNull(user)) {
            return this.sendErrorResponse(next, 500, "Failed to create user");
        } else {
            // TODO: need to uncomment after deploy
            // await UserEmailService.sendVerificationEmail(user)
            return this.sendSuccessResponse(res, 201, "User created successfully", { user: rest });
        }

    }

    // API ==> /api/v1/auth/login
    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        const login_req: LoginRequest = req.body;

        const user = await User.findOne({ email: login_req.email }).select("+password");
        if (Utils.isNull(user)) {
            return this.sendErrorResponse(next, 400, "User not found");
        }
        // TODO: need to uncomment
        // else if (!Utils.isTrue(user.is_verified)) {
        //     return this.sendErrorResponse(next, 400, "User is not verified");
        // }

        const isPasswordValid = await bcrypt.compare(login_req.password, user.password);
        if (!isPasswordValid) {
            return this.sendErrorResponse(next, 400, "Invalid password");
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
        const { password, ...rest } = user.toObject();

        this.setCookie(res, "token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return this.sendSuccessResponse(res, 200, "User logged in successfully", { user: rest });
    }

    // API ==> /api/v1/auth/removeUser
    public removeUser = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.body.user_id;
        const user = await User.findByIdAndDelete(user_id);
        if (Utils.isNull(user)) {
            return this.sendErrorResponse(next, 400, "User not found");
        }
        this.clearCookie(res, "token");
        return this.sendSuccessResponse(res, 200, "User removed successfully");
    }

    // API ==> /api/v1/auth/updateUser
    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const update_req: UpdateUserRequest = req.body;
        if (Utils.isNull(update_req?.user_id)) {
            return this.sendErrorResponse(next, 400, "User id is required");
        }

        let query: any = {};

        if (!Utils.isNull(update_req.user_name)) {
            query.user_name = update_req.user_name;
        }
        if (!Utils.isNull(update_req.email)) {
            query.email = update_req.email;
        }
        if (!Utils.isNull(update_req.password)) {
            if (update_req.password.length < 8) {
                return this.sendErrorResponse(next, 400, "Password must be at least 8 characters long");
            }
            query.password = await bcrypt.hash(update_req.password, 10);
        }


        const user = await User.findByIdAndUpdate(update_req.user_id, query, { new: true });
        if (Utils.isNull(user)) {
            return this.sendErrorResponse(next, 400, "User not found");
        }
        return this.sendSuccessResponse(res, 200, "User updated successfully", { user: user });
    }

    // API ==> /api/v1/auth/verify-email
    public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {

        const { token } = req.query;
        if (Utils.isNull(token)) {
            return this.sendErrorResponse(next, 400, "Token is required");
        }

        const user = await User.findOne({ verify_token: token });
        if (Utils.isNull(user)) {
            return this.sendErrorResponse(next, 400, "Invalid token");
        }

        user.is_verified = true;
        user.verify_token = undefined;
        await user.save();

        return this.sendSuccessResponse(res, 200, "User verified successfully", { user: user });
    }

    // API ==> /api/v1/auth/userList
    public getUserList = async (req: Request, res: Response, next: NextFunction) => {
        const filter = req.body as GetUserFilter;

        let query: any = {};

        if (!Utils.isNull(filter)) {
            if (!Utils.isNull(filter.user_id)) {
                query._id = filter.user_id;
            }
            if (!Utils.isNull(filter.user_name)) {
                query.user_name = filter.user_name;
            }
            if (!Utils.isNull(filter.email)) {
                query.email = filter.email;
            }
        }

        const users = await User.find(query);
        return this.sendSuccessResponse(res, 200, "User list", { users });
    }

}
