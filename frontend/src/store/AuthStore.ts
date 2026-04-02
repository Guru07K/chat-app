import { create } from "zustand";
import type { AuthStore, LoginRequest, SignUpRequest, UpdateUserRequest } from "../model/Auth.model";
import axios from "axios";
import io from 'socket.io-client'

export const useAuthStore = create<AuthStore>((set, get) => {
    return {
        user: null,
        isLoading: false,
        isLoggedIn: false,
        isSignedUp: false,
        socket: null,
        onlineUsers: [],
        success: "",
        error: "",

        ChechAuth: async () => {
            try {
                set({ isLoading: true, isLoggedIn: false })
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/isLoggedIn`, { withCredentials: true });

                set({
                    user: res.data.result.user,
                    isLoggedIn: true,
                    success: res.data.result.message
                });

                get().ConnectSocket();

            } catch (error: any) {
                set({ user: null, isLoggedIn: false, error: error.response.data.message });
            } finally {
                set({ isLoading: false });
            }
        },

        Signup: async (req_data: SignUpRequest) => {
            try {
                set({ isLoading: true })

                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/signup`, req_data);

                set({
                    user: res.data.result.user,
                    success: res.data.message,
                    isSignedUp: true
                })

                get().ConnectSocket();

            } catch (error: any) {
                set({ user: null, error: error.response.data.message })
            } finally {
                set({ isLoading: false })
            }
        },

        Login: async (req_data: LoginRequest) => {
            try {
                set({ isLoading: true })

                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`, req_data, { withCredentials: true });
                set({
                    user: res.data.result.user,
                    success: res.data.message,
                    isLoggedIn: true
                })

                get().ConnectSocket();

            } catch (error: any) {
                set({ user: null, error: error.response.data.message })
            } finally {
                set({ isLoading: false })
            }
        },

        Logout: async () => {
            try {
                set({ isLoading: true })
                const res = await axios(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/logout`, { withCredentials: true });
                set({ user: null, success: res.data.message, isLoggedIn: false })
                get().DisConnectSocket();
            } catch (error: any) {
                set({ user: null, error: error.response.data.message })
            } finally {
                set({ isLoading: false })
            }
        },

        UpdateProfileImage: async (data: UpdateUserRequest) => {
            try {
                set({ isLoading: true })

                const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/updateUser`, data, { withCredentials: true });
                set({ user: res.data.result.user, success: res.data.message })

            } catch (error: any) {
                set({ user: null, error: error.response.data.message })
            } finally {
                set({ isLoading: false })
            }
        },

        ConnectSocket: () => {
            try {
                if (!get().user || get().socket?.connected) return

                const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });
                socket.connect();

                set({ socket: socket })

                socket.on("getOnlineUsers", (user_ids) => {
                    set({ onlineUsers: user_ids })
                })

            } catch (error: any) {

            }
        },

        DisConnectSocket: () => {
            if (get().socket?.connected) {
                get().socket.disconnect();
            }
        },

        ClearMessage: () => set({ success: "", error: "" })
    }
})