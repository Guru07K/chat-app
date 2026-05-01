import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/AuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import { ChevronDown } from "lucide-react";

// Tick icons
const SingleTick = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path d="M1 5.5L4.5 9L13 1" stroke="#8db3a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoubleTick = ({ blue }: { blue?: boolean }) => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
    <path d="M1 5.5L4.5 9L13 1" stroke={blue ? "#53bdeb" : "#8db3a0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 5.5L10.5 9L19 1" stroke={blue ? "#53bdeb" : "#8db3a0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatContainer = () => {
  const { messages, selectedUser, isMessageLoading, getMyMessagesByUserId, SubscribeEvent, UnSubscribeEvent } = useChatStore();

  const { user } = useAuthStore();
  const msg_end_ref = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMyMessagesByUserId(selectedUser._id);
    }
  }, [getMyMessagesByUserId, selectedUser]);

  useEffect(() => {
    msg_end_ref.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser?._id) return;
    const socket = useAuthStore.getState().socket;
    socket.emit("messageSeen", selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    SubscribeEvent();
    return () => UnSubscribeEvent();
  }, [selectedUser]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const handleDelete = (id: string) => console.log("Delete:", id);
  const handleEdit = (msg: any) => console.log("Edit:", msg);


  // Sort messages by date ascending first
  const sortedMessages = [...messages].sort(
    (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  // Group messages by date
  const groupedMessages: { date: string; dateKey: string; msgs: any[] }[] = [];
  const dateMap: Record<string, number> = {};
  sortedMessages.forEach((msg: any) => {
    const d = new Date(msg.createdAt);
    const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const dateLabel = d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (dateMap[dateKey] === undefined) {
      dateMap[dateKey] = groupedMessages.length;
      groupedMessages.push({ date: dateLabel, dateKey, msgs: [msg] });
    } else {
      groupedMessages[dateMap[dateKey]].msgs.push(msg);
    }
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ChatHeader />

      {/* Chat background — WhatsApp-style subtle pattern */}
      <div
        className="flex-1 overflow-y-auto min-h-0 pb-4"
        style={{
          background: "#0b141a",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.length > 0 && !isMessageLoading ? (
          <div className="px-4 py-3 space-y-1">
            {groupedMessages.map(({ date, dateKey, msgs }) => (
              <div key={dateKey}>
                {/* Date separator */}
                <div className="flex justify-center my-3">
                  <span className="text-[11px] text-[#8696a0] bg-[#1f2c34] px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>

                {msgs.map((msg: any) => {
                  const isMe = msg.sender_id === user._id || msg.sender_id?._id === user._id;
                  const time = new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="relative group max-w-[75%] sm:max-w-[65%]"
                        style={{ overflow: "visible" }}
                      >
                        {/* Bubble */}
                        <div
                          className="relative rounded-lg px-3 pt-2 pb-1 shadow-md"
                          style={{
                            background: isMe ? "#005c4b" : "#1f2c34",
                            borderRadius: isMe
                              ? "12px 12px 2px 12px"
                              : "12px 12px 12px 2px",
                          }}
                        >
                          {/* 3-dot menu button */}
                          {isMe && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === msg._id ? null : msg._id);
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/20 transition-opacity"
                            >
                              <ChevronDown size={14} className="text-white/60" />
                            </button>
                          )}

                          {/* Image */}
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Shared"
                              onClick={() => setSelectedImage(msg.image)}
                              className="rounded-md mb-1 max-h-52 w-full object-cover cursor-pointer"
                            />
                          )}

                          {/* Text + meta row */}
                          <div className="flex items-end gap-2 flex-wrap">
                            {msg.text && (
                              <p className="text-[14.2px] text-[#e9edef] leading-snug wrap-break-word flex-1 min-w-0 pr-1">
                                {msg.text}
                              </p>
                            )}

                            {/* Time + ticks — always inline at end */}
                            <div className="flex items-center gap-1 ml-auto shrink-0 self-end mb-px">
                              <span className="text-[11px] text-[#8696a0] whitespace-nowrap">
                                {time}
                              </span>
                              {isMe && (
                                <span className="flex items-center">
                                  {msg.status === "sent" && <SingleTick />}
                                  {msg.status === "delivered" && <DoubleTick />}
                                  {msg.status === "read" && <DoubleTick blue />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Dropdown menu */}
                        {openMenuId === msg._id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 w-32 bg-[#233138] border border-[#3a4a54] rounded-md shadow-2xl z-50"
                          >
                            <button
                              onClick={() => { handleEdit(msg); setOpenMenuId(null); }}
                              className="block w-full text-left px-3 py-2 hover:bg-[#2d3e46] text-sm text-[#e9edef] rounded-t-md transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => { handleDelete(msg._id); setOpenMenuId(null); }}
                              className="block w-full text-left px-3 py-2 hover:bg-red-900/60 text-sm text-[#e9edef] rounded-b-md transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={msg_end_ref} />
          </div>
        ) : isMessageLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        )}
      </div>

      {/* Input */}
      <div className="w-full bg-[#0b141a] px-3 py-2">
        <MessageInput />
      </div>

      {/* Image lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain p-4"
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;