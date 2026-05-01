import { useState, useRef } from "react";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/AuthStore";

function ProfileHeader() {
  const { Logout, user, UpdateProfileImage } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setSelectedImg(data.secure_url);
    await UpdateProfileImage({ user_id: user._id, profile_image_url: data.secure_url });
  };

  return (
    <div className="flex items-center justify-between px-4 py-5 bg-slate-900/50">
      <div className="flex items-center gap-3">
        <button
          className="relative w-10 h-10 rounded-full overflow-hidden group shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={selectedImg || user.profile_image_url || "/avatar.png"}
            alt={user.user_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-[9px] font-medium">Edit</span>
          </div>
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <span className="text-[#e9edef] font-semibold text-[15px] truncate max-w-40">
          {user.user_name}
        </span>
      </div>

      <button
        onClick={Logout}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3a4a54] transition-colors"
      >
        <LogOut size={18} className="text-[#8696a0]" />
      </button>
    </div>
  );
}

export default ProfileHeader;