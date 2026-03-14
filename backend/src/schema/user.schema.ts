import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    verify_token: {
        type: String,
    },
    is_verified: {
        type: Boolean,
        default: false,
    }

},
    { timestamps: true }

);

export const User = mongoose.model("User", userSchema);
export type IUser = mongoose.InferSchemaType<typeof userSchema>;