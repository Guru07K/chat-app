import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/AuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import { ChevronDown } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    isMessageLoading,
    getMyMessagesByUserId,
    SubscribeEvent,
    UnSubscribeEvent,
  } = useChatStore();

  const { user } = useAuthStore();
  const msg_end_ref = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMyMessagesByUserId(selectedUser._id);
    }
  }, [getMyMessagesByUserId, selectedUser]);

  useEffect(() => {
    msg_end_ref.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    SubscribeEvent();
    return () => UnSubscribeEvent();
  }, [SubscribeEvent, UnSubscribeEvent]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const handleDelete = (id: string) => {
    console.log("Delete:", id);
  };

  const handleEdit = (msg: any) => {
    console.log("Edit:", msg);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0 bg-linear-to-b from-slate-900 to-slate-800">
        {messages.length > 0 && !isMessageLoading ? (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMe = msg.sender_id === user._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {/* <div
                    className="relative group max-w-[70%]"
                    style={{ overflow: "visible" }}
                  > */}
                  <div
                    className="relative group max-w-[75%] sm:max-w-[70%]"
                    style={{ overflow: "visible" }}
                  >
                    <div
                      className={`relative px-4 py-2 pr-8 rounded-2xl wrap-break-word ${
                        isMe
                          ? "bg-cyan-600 text-white rounded-br-sm"
                          : "bg-slate-700 text-white rounded-bl-sm"
                      }`}
                    >
                      {isMe && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === msg._id ? null : msg._id,
                            );
                          }}
                          className="absolute top-1 right-1 p-1.5 rounded-full
                                     opacity-0 group-hover:opacity-60 hover:opacity-100
                                     hover:bg-black/20 transition"
                        >
                          <ChevronDown size={20} />
                        </button>
                      )}

                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg mb-2 max-h-48 w-full object-cover"
                        />
                      )}

                      {msg.text && <p className="text-sm">{msg.text}</p>}

                      <p className="text-[10px] mt-1 opacity-70 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>

                    {openMenuId === msg._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mb-1 w-32 bg-slate-800 border border-slate-700 rounded-md shadow-xl z-999"
                      >
                        <button
                          onClick={() => {
                            handleEdit(msg);
                            setOpenMenuId(null);
                          }}
                          className="block w-full text-left px-3 py-2 hover:bg-slate-700 text-sm rounded-t-md"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(msg._id);
                            setOpenMenuId(null);
                          }}
                          className="block w-full text-left px-3 py-2 hover:bg-red-600 text-sm rounded-b-md"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={msg_end_ref}></div>
          </div>
        ) : isMessageLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
