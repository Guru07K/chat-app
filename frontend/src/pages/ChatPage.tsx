import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();
  const { user_id } = useParams();

  useEffect(() => {
    if (user_id && !selectedUser) {
      loadUserFromUrl(user_id);
    }
  }, [user_id]);

  const loadUserFromUrl = async (id: string) => {
    const { chats, getMyChatPartners } = useChatStore.getState();

    if (chats.length === 0) {
      await getMyChatPartners();
    }

    const foundUser = useChatStore
      .getState()
      .chats.find((chat) => chat._id === id);

    if (foundUser) {
      setSelectedUser(foundUser);
    }
  };

  return (
    // <div className="relative w-full max-w-212.5 h-screen md:h-130 flex rounded-none md:rounded-2xl shadow-2xl shadow-black/40 border border-slate-700/40">
    <div className="relative w-full max-w-212.5 h-full md:h-130 flex rounded-none md:rounded-2xl shadow-2xl shadow-black/40 border border-slate-700/40">
      {" "}
      {/* LEFT SIDEBAR */}
      <div
        className={`
          ${selectedUser ? "hidden md:flex" : "flex"}
          w-full md:w-70 lg:w-64 shrink-0
          bg-slate-800/50 backdrop-blur-sm flex-col
          border-r border-slate-700/50
        `}
      >
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div
        className={`
          ${selectedUser ? "flex" : "hidden md:flex"}
          flex-1 flex-col bg-slate-900/50 backdrop-blur-sm min-w-0
        `}
      >
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;
