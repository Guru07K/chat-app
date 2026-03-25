import { create } from "zustand";
import type { ChatModel } from "../model/Message.model";
import axios from "axios";

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

        setActiveTab: (tab: string) => set({ activeTab: tab }),
        setSelectedUser: (user: any) => set({ selectedUser: user }),
    }
})