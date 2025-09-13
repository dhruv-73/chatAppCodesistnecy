import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatSelected = () => {
  const { messages, selectedUser, isMessagesLoading, getMessages,subscribeToMessages,unsubscribeFromMessages } =
    useChatStore();
    const messageEndRef = useRef(null)
  const { authUser } = useAuthStore();
  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages()

    return () => {
      unsubscribeFromMessages()
    }
  }, [selectedUser._id, getMessages,subscribeToMessages,unsubscribeFromMessages]);

 useEffect(() => {
   if(messageEndRef.current && messages){
     messageEndRef.current.scrollIntoView({behavior:"smooth"})
   }
 }, [messages])
 

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser?.profileImage || "/user.png"
                      : selectedUser?.profileImage || "/user.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex-col">
              {message.text && <p>{message.text}</p>}
              {message.image && (
                <img
                  src={message.image}
                  alt="message pic"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatSelected;
