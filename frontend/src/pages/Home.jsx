import React from "react";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import ChatSelected from "../components/ChatSelected";

const Home = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200 ">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 w-full max-w-6xl shadow-cl rounded-lg flex h-[calc(100vh-6rem)]">
          <div className="w-full flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
