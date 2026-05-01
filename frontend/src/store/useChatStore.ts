import { create } from "zustand";
import type { ChatModel } from "../model/Message.model";
import axios from "axios";
import { useAuthStore } from "./AuthStore";

axios.defaults.withCredentials = true;

export const useChatStore = create<ChatModel>((set, get) => {
  return {
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,
    pendingStatuses: {},
    isSoundEnabled: localStorage.getItem("isSoundEnabled")?.toString() == "true",

    setActiveTab: (tab: string) => set({ activeTab: tab }),
    setSelectedUser: (user: any) => set({ selectedUser: user }),

    getAllContacts: async () => {
      try {
        set({ isUsersLoading: true });
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/contacts`);
        set({ allContacts: res.data.result.users, success: res.data.message });
      } catch (error: any) {
        set({ error: error.response.data.message });
      } finally {
        set({ isUsersLoading: false });
      }
    },

    getMyChatPartners: async () => {
      try {
        set({ isUsersLoading: true });
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/chats`);
        set({ chats: res.data.result.chat_partners, success: res.data.message });
      } catch (error: any) {
        set({ error: error.response.data.message });
      } finally {
        set({ isUsersLoading: false });
      }
    },

    getMyMessagesByUserId: async (user_id: string) => {
      try {
        set({ isMessageLoading: true });
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/${user_id}`);
        set({ messages: res.data.result.messages });
      } catch (error: any) {
        set({ error: error.response.data.message });
      } finally {
        set({ isMessageLoading: false });
      }
    },

    sendMessage: async (data: any) => {
      const { user } = useAuthStore.getState();
      const temp_id = `temp-${Date.now()}`;

      const optimistic_message = {
        _id: temp_id,
        sender_id: user._id,
        receiver_id: get().selectedUser._id,
        text: data?.text,
        image: data?.image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
        status: "sent",
      };

      set({ messages: [...get().messages, optimistic_message] });

      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/message/send/${get().selectedUser._id}`, data);

        const realMessage = res.data.result.message;
        const pending = get().pendingStatuses;
        set({
          messages: [...get().messages.filter((msg: any) => msg._id !== temp_id), { ...realMessage, status: pending[realMessage._id.toString()] ?? realMessage.status }],
          pendingStatuses: Object.fromEntries(Object.entries(pending).filter(([k]) => k !== realMessage._id.toString())),
        });
      } catch (error: any) {
        set({ messages: get().messages.filter((msg: any) => msg._id !== temp_id) });
        set({ error: error.response.data.message });
      } finally {
        set({ isMessageLoading: false });
      }
    },

    SubscribeEvent: () => {
      if (!get().selectedUser) return;

      const socket = useAuthStore.getState().socket;

      socket.on("newMessage", (newMessage: any) => {
        set((state: any) => ({
          messages: [...state.messages, newMessage],
        }));

        const { selectedUser, chats } = get();

        const senderInList = chats.some((chat: any) => chat._id === newMessage.sender_id);
        if (!senderInList) {
          get().getMyChatPartners();
        }

        if (selectedUser && newMessage.sender_id?.toString() === selectedUser._id?.toString()) {
          socket.emit("messageSeen", newMessage.sender_id);
        }
      });

      socket.on("messageStatus", (data: { message_id: string; status: string }) => {
        const { message_id, status } = data;
        const found = get().messages.find((m: any) => m._id.toString() === message_id);

        if (found) {
          // Message is in state, update directly
          set((state: any) => ({
            messages: state.messages.map((msg: any) => (msg._id.toString() === message_id ? { ...msg, status } : msg)),
          }));
        } else {
          // Message not in state yet (race condition) — store for later
          set((state: any) => ({
            pendingStatuses: { ...state.pendingStatuses, [message_id]: status },
          }));
        }
      });

      socket.on("messageStatusBulk", (data: { receiver_id: string; status: string }) => {
        const { receiver_id, status } = data;
        set((state: any) => ({
          messages: state.messages.map((msg: any) => (msg.receiver_id?.toString() === receiver_id ? { ...msg, status } : msg)),
        }));
      });
    },

    UnSubscribeEvent: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
      socket.off("messageStatus");
      socket.off("messageStatusBulk");
    },
  };
});
