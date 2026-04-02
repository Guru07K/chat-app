import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/AuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";

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

  useEffect(() => {
    getMyMessagesByUserId(selectedUser._id);
  }, [getMyMessagesByUserId, selectedUser]);

  useEffect(() => {
    if (msg_end_ref.current) {
      msg_end_ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    SubscribeEvent();

    return () => UnSubscribeEvent();
  }, [messages, SubscribeEvent, UnSubscribeEvent]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessageLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.sender_id === user._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.sender_id === user._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            {<div ref={msg_end_ref}></div>}
          </div>
        ) : isMessageLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
};

export default ChatContainer;
