import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const Profile = () => {
  const { isUpdatingProfile, updateProfile, authUser } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profileImage: base64Image });
    };
  };

  return (
    <div className="pt-15 h-screen">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-3">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Profile</h2>
            <p className="mt-2 text-base">Update your profile information</p>
          </div>
          {/* avatar section */}
          <div className="flex items-center flex-col gap-3">
            <div className="relative">
              <img
                src={selectedImage || authUser?.profileImage || "/user.png"}
                alt="profile"
                className="size-24 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  className="hidden"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the icon to update your profile picture"}
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.name}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className=" bg-base-300 rounded-xl p-4">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-2 text-sm text-zinc-400">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
