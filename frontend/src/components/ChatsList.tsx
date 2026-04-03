import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/AuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
            <div className={`avatar`}>
              <div className="size-12 rounded-full">
                <img
                  src={chat.profile_image_url || "/avatar.png"}
                  alt={chat.user_name}
                />
              </div>

              {onlineUsers.includes(chat._id) ? (
                <div
                  aria-label="success"
                  className="status status-success"
                ></div>
              ) : (
                <span className="status"></span>
              )}
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {chat.user_name}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
