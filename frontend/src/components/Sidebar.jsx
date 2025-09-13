import React, { useDebugValue, useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { users, selectedUser, isUsersLoading, getUsers, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="w-full p-5 ">
        <div className="flex items-center gap-2">
          <Users className="size-6 sm:ml-5" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input type="checkbox"
            checked={showOnlineUsers}
            onChange={(e)=>setShowOnlineUsers(e.target.checked)}
            className="checkbox checkbox-sm"
            />
            <span className="text-sm"> Show online users only</span>
          </label>
          <span className="text-xs text-zinc-500">{onlineUsers.length-1} online</span>
        </div>

        <div className="overflow-y-auto w-full py-3 space-y-2">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 border-b border-zinc-600 rounded-lg w-full flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              } `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profileImage || "./user.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 ring-2 ring-zinc-900 rounded-full" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
