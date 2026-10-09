import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Conversation, Message } from '../../types';
import { MessageSquare, Send, Shield, AlertCircle } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const convs = ApiService.getConversations(user.user_id);
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConv(convs[0]);
        setMessages(ApiService.getMessages(convs[0].id));
      }
    }
  }, [user]);

  const handleSelectConv = (conv: Conversation) => {
    setActiveConv(conv);
    setMessages(ApiService.getMessages(conv.id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConv || !user) return;

    const newMsg = ApiService.sendMessage(activeConv.id, user.user_id, inputContent.trim());
    setMessages((prev) => [...prev, newMsg]);
    setInputContent('');

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] bg-[#151C2F] border border-[#232D48] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
      {/* Conversations Sidebar */}
      <div className="border-r border-[#232D48] bg-[#0B1020]/50 flex flex-col">
        <div className="p-4 border-b border-[#232D48]">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
            <span>Messages</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#232D48]/50">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No active conversations yet. Chat activates after a booking request.
            </div>
          ) : (
            conversations.map((c) => {
              const isSelected = activeConv?.id === c.id;
              const otherName = user?.role === 'customer' ? c.provider_name : c.customer_name;
              const otherAvatar = user?.role === 'customer' ? c.provider_avatar : c.customer_avatar;

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectConv(c)}
                  className={`w-full p-4 text-left flex items-start space-x-3 transition-colors ${
                    isSelected ? 'bg-[#1D2740] border-l-4 border-[#22D3EE]' : 'hover:bg-[#151C2F]'
                  }`}
                >
                  <img
                    src={otherAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={otherName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{otherName}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{c.last_message}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-2 flex flex-col bg-[#151C2F]">
        {activeConv ? (
          <>
            {/* Header with Safety Banner */}
            <div className="p-4 border-b border-[#232D48] flex items-center justify-between bg-[#0B1020]">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user?.role === 'customer'
                      ? activeConv.provider_avatar
                      : activeConv.customer_avatar
                  }
                  alt="Companion"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {user?.role === 'customer' ? activeConv.provider_name : activeConv.customer_name}
                  </h3>
                  <span className="text-[10px] text-[#A3E635] font-semibold">● Verified Chat</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[10px] font-bold">
                <Shield className="w-3 h-3" />
                <span>Non-Sexual Policy Enforced</span>
              </div>
            </div>

            {/* Non-Sexual Safety Reminder Pill */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-[11px] text-amber-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Reminder: Strictly keep all conversations respectful and non-sexual. Meetup location must be public.
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => {
                const isMe = m.sender_id === user?.user_id;

                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs space-y-1 ${
                        isMe
                          ? 'bg-[#22D3EE] text-slate-950 font-medium rounded-br-none'
                          : 'bg-[#0B1020] text-slate-200 border border-[#232D48] rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{m.content}</p>
                      <span className={`block text-[9px] text-right ${isMe ? 'text-slate-800' : 'text-slate-500'}`}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#232D48] bg-[#0B1020] flex items-center space-x-3">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Type a polite message..."
                className="flex-1 bg-[#151C2F] border border-[#232D48] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
