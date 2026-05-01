import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  const onClickHandler = (chat: any) => {
    setSelectedUser(chat);
    navigate(`/chat/${chat._id}`);
  };

  return (
    <div>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onClickHandler(chat)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
          // style={{ borderBottom: "1px solid #1f2c34" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#2a3942")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div className="relative shrink-0">
            <img
              src={chat.profile_image_url || "/avatar.png"}
              alt={chat.user_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {onlineUsers.includes(chat._id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111b21]"
                style={{ background: "#00a884" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#e9edef] font-medium text-[15px] truncate">{chat.user_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatsList;