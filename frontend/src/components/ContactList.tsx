import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const ContactList = () => {
  const {
    allContacts,
    selectedUser,
    isUsersLoading,
    messages,
    setSelectedUser,
    getAllContacts,
  } = useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar online`}>
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.user_name}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.user_name}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactList;
