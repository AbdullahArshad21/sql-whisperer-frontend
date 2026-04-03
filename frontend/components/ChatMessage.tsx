"use client";

import { User } from "lucide-react";
import React from "react";

interface ChatMessageProps {
  role: "user" | "ai";
  children: React.ReactNode;
}

export default function ChatMessage({ role, children }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full py-6 ${isUser ? "justify-end bg-transparent" : "justify-start bg-gray-50 dark:bg-gray-800/20"}`}>
      <div className={`flex max-w-4xl w-full mx-auto px-4 gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${isUser ? "bg-gray-800" : "bg-primary"}`}>
            {isUser ? <User size={18} /> : <span className="font-bold text-sm">SW</span>}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`flex flex-col space-y-2 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {isUser ? "You" : "SQL Whisperer"}
          </div>
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed font-sans w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
