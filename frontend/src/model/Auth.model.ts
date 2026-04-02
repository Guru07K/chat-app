export interface AuthStore {
    user: any,
    isLoading: boolean,
    isLoggedIn: boolean,
    isSignedUp: boolean,
    socket: any,
    onlineUsers: any[],
    success?: string,
    error?: string,

    ChechAuth: () => Promise<void>,
    Login: (user: any) => void,
    Logout: (user: any) => void,
    Signup: (data: SignUpRequest) => Promise<void>,
    ClearMessage: () => void
    ConnectSocket: () => void
    DisConnectSocket: () => void
    UpdateProfileImage: (data: UpdateUserRequest) => void
}

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