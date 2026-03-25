export interface SignUpRequest {
    user_name: string;
    email: string;
    password: string;
    confirm_password?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    user_id: string;
    user_name?: string;
    email?: string;
    password?: string;
    profile_image_url?: string;
}

export interface GetUserFilter {
    user_name?: string;
    email?: string;
    user_id?: string;
}