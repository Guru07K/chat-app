export interface ChatModel {
  allContacts: any[];
  chats: any[];
  messages: any[];
  activeTab: string;
  selectedUser: any;
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  pendingStatuses: Record<string, string>; // ✅ ADD THIS
  success?: string;
  error?: string;

  setActiveTab: (tab: string) => void;
  setSelectedUser: (user: any) => void;
  getAllContacts: () => void;
  getMyChatPartners: () => void;
  getMyMessagesByUserId: (user_id: string) => void;
  sendMessage: (data: any) => void;
  SubscribeEvent: () => void;
  UnSubscribeEvent: () => void;
}
