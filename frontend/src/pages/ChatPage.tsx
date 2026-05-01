import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";


function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser, getMyChatPartners } = useChatStore();
  const { user_id } = useParams();

  useEffect(() => {
    if (user_id && !selectedUser) {
      loadUserFromUrl(user_id);
    }
  }, [user_id]);

  useEffect(() => {
    const socket = useAuthStore.getState().socket;

    const handleNewMessage = () => {
      getMyChatPartners();
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, []);

  const loadUserFromUrl = async (id: string) => {
    const { chats, getMyChatPartners } = useChatStore.getState();
    if (chats.length === 0) await getMyChatPartners();
    const foundUser = useChatStore.getState().chats.find((chat) => chat._id === id);
    if (foundUser) setSelectedUser(foundUser);
  };

  return (
    <div className="relative w-full h-full flex">

      {/* LEFT SIDEBAR */}
      <div
        className={`
          ${selectedUser ? "hidden md:flex" : "flex"}
          w-full md:w-85 lg:w-95 shrink-0 flex-col
          border-r
        `}
        style={{
          background: "#111b21",
          borderColor: "#2a3942",
        }}
      >
        {/* Profile header area */}
        <div style={{ background: "#1f2c34", borderBottom: "1px solid #2a3942" }}>
          <ProfileHeader />
        </div>

        {/* Search + Tab switch */}
        <div style={{ background: "#111b21" }}>
          <ActiveTabSwitch />
        </div>

        {/* Chat / Contact list */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#111b21" }}>
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT — Chat area */}
      <div
        className={`
          ${selectedUser ? "flex" : "hidden md:flex"}
          flex-1 flex-col min-w-0
        `}
        style={{ background: "#0b141a" }}
      >
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;