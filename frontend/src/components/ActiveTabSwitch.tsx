import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex " >
      <button
        onClick={() => setActiveTab("chats")}
        className="flex-1 py-5 text-sm font-medium transition-colors relative"
        style={{
          color: activeTab === "chats" ? "#00a884" : "#8696a0",
        }}
      >
        Chats
        {activeTab === "chats" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#00a884" }} />
        )}
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className="flex-1 py-3 text-sm font-medium transition-colors relative"
        style={{
          color: activeTab === "contacts" ? "#00a884" : "#8696a0",
        }}
      >
        Contacts
        {activeTab === "contacts" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#00a884" }} />
        )}
      </button>
    </div>
  );
}

export default ActiveTabSwitch;