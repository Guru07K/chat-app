import { create } from "zustand";
import type { ChatModel } from "../model/Message.model";
import axios from "axios";
import { useAuthStore } from "./AuthStore";

export const useChatStore = create<ChatModel>((set, get) => {
    return {

        allContacts: [],
        chats: [],
        messages: [],
        activeTab: "chats",
        selectedUser: null,
        isUsersLoading: false,
        isMessageLoading: false,
        isSoundEnabled: localStorage.getItem('isSoundEnabled')?.toString() == 'true',

        setActiveTab: (tab: string) => set({ activeTab: tab }),
        setSelectedUser: (user: any) => set({ selectedUser: user }),

        toggleSound: () => {
            localStorage.setItem('isSoundEnabled', get().isSoundEnabled.toString());
            set({ isSoundEnabled: !get().isSoundEnabled, })
        },

        getAllContacts: async () => {
            try {
                set({ isUsersLoading: true })

                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/contacts`, { withCredentials: true });
                set({
                    allContacts: res.data.result.users,
                    success: res.data.message
                })

            } catch (error: any) {
                set({ error: error.response.data.message })
            } finally {
                set({ isUsersLoading: false })
            }
        },

        getMyChatPartners: async () => {
            try {
                set({ isUsersLoading: true })

                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/chats`, { withCredentials: true });
                set({
                    chats: res.data.result.chat_partners,
                    success: res.data.message
                })

            } catch (error: any) {
                set({ error: error.response.data.message })
            } finally {
                set({ isUsersLoading: false })
            }
        },

        getMyMessagesByUserId: async (user_id: string) => {
            try {
                set({ isMessageLoading: true })

                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/${user_id}`, { withCredentials: true });

                set({ messages: res.data.result.messages })

            } catch (error: any) {
                set({ error: error.response.data.message })
            } finally {
                set({ isMessageLoading: false })
            }
        },

        sendMessage: async (data: any) => {

            const { user } = useAuthStore.getState()

            const temp_id = `temp-${Date.now()}`

            const optmistic_message = {
                _id: temp_id,
                sender_id: user._id,
                receiver_id: get().selectedUser._id,
                text: data.text,
                image: data.image,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isOptimistic: true
            }

            set({ messages: [...get().messages, optmistic_message] })

            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/message/send/${get().selectedUser._id}`, data, { withCredentials: true });

                set({
                    messages: [
                        ...get().messages.filter((message: any) => message._id !== temp_id),
                        res.data.result.message
                    ]
                })

            } catch (error: any) {

                set({ messages: get().messages });
                set({ error: error.response.data.message })
            } {
                set({ isMessageLoading: false })
            }
        },

        SubscribeEvent: () => {
            if (!get().selectedUser) return;

            const socket = useAuthStore.getState().socket;
            socket.on("newMessage", (newMessage: any) => {
                set({ messages: [...get().messages, newMessage] })
            })
        },

        UnSubscribeEvent: () => {
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage")
        }

    }
})