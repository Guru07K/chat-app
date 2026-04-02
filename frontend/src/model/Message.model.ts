export interface ChatModel {
    allContacts: any[],
    chats: any[],
    messages: any[],
    activeTab: string,
    selectedUser: any,
    isUsersLoading: boolean,
    isMessageLoading: boolean,
    isSoundEnabled: boolean,
    success?: string,
    error?: string,


    toggleSound: () => void,
    setActiveTab: (tab: string) => void,
    setSelectedUser: (user: any) => void,
    getAllContacts: () => void,
    getMyChatPartners: () => void,
    getMyMessagesByUserId: (user_id: string) => void,
    sendMessage: (data: any) => void,
    SubscribeEvent: () => void,
    UnSubscribeEvent: () => void,

    // setActiveTab: (tab: string) => set({ activeTab: tab }),
    // setSelectedUser: (user: any) => set({ selectedUser: user }),
}

