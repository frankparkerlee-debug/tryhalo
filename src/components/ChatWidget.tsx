"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import HaloLogo from "./HaloLogo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm the Halo concierge. I can help you find the right program, answer questions about pricing, or tell you how it all works. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, pathname }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I'm having a moment. Try again or check out tryhalo.co for more info.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: "What programs do you offer?", icon: "💊" },
    { label: "How much does it cost?", icon: "💰" },
    { label: "How does it work?", icon: "🔬" },
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isOpen
            ? "bg-[#2D2D2D] rotate-0"
            : "bg-[#1C1C1E] hover:bg-[#2D2D2D] hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] hover:scale-105"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 visible"
            : "scale-95 opacity-0 invisible"
        }`}
      >
        {/* Header */}
        <div className="bg-[#141414] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HaloLogo size="sm" variant="dark" showText={false} />
            <div>
              <p className="text-white font-semibold text-sm">Halo Concierge</p>
              <p className="text-white/30 text-xs">Typically replies instantly</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Messages */}
        <div className="bg-[#1a1a1a] h-[360px] overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1C1C1E] text-white rounded-br-md"
                    : "bg-white/[0.06] text-white/80 rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick actions — show only if 1 message */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2 pt-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setInput(action.label);
                    setTimeout(() => {
                      const userMsg: Message = { role: "user", content: action.label };
                      setMessages((prev) => [...prev, userMsg]);
                      setInput("");
                      setIsLoading(true);
                      fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ messages: [...messages, userMsg], pathname }),
                      })
                        .then((r) => r.json())
                        .then((data) =>
                          setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
                        )
                        .catch(() =>
                          setMessages((prev) => [
                            ...prev,
                            { role: "assistant", content: "Sorry, something went wrong. Try again!" },
                          ])
                        )
                        .finally(() => setIsLoading(false));
                    }, 0);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:bg-white/[0.08] hover:text-white/80 hover:border-white/[0.15] transition-all duration-200 flex items-center gap-2"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-40" />
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-[#141414] px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 bg-white/[0.06] rounded-full px-4 py-2 border border-white/[0.08] focus-within:border-white/30 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                input.trim() && !isLoading
                  ? "bg-white text-[#1C1C1E] hover:bg-white/90"
                  : "bg-white/[0.06] text-white/20"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/15 mt-2">
            AI concierge · Not medical advice
          </p>
        </div>
      </div>
    </>
  );
}
