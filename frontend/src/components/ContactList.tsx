import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/AuthStore";

const ContactList = () => {
  const { allContacts, setSelectedUser, getAllContacts } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  return (
    <div>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => setSelectedUser(contact)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
          // style={{ borderBottom: "1px solid #1f2c34" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#2a3942")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div className="relative shrink-0">
            <img
              src={contact.profile_image_url || "/avatar.png"}
              alt={contact.user_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {onlineUsers.includes(contact._id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111b21]"
                style={{ background: "#00a884" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#e9edef] font-medium text-[15px] truncate">{contact.user_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;