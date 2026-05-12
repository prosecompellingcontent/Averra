import { useState, useEffect, useRef } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import { supabase, subscribeToMessages, subscribeToTyping, sendTypingIndicator, markMessageAsRead } from "@/utils/supabase/client";
import { Send, Search, MoreVertical, Circle } from "lucide-react";

interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string;
  other_participant?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    is_online: boolean;
  };
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!user) return;

    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedConversation || !user) return;

    loadMessages(selectedConversation);

    // Subscribe to new messages
    const messagesChannel = subscribeToMessages(selectedConversation, (payload) => {
      if (payload.eventType === 'INSERT') {
        setMessages(prev => [...prev, payload.new]);

        // Mark as read if sent by other user
        if (payload.new.sender_id !== user.id) {
          markMessageAsRead(payload.new.id);
        }

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    // Subscribe to typing indicators
    const typingChannel = subscribeToTyping(selectedConversation, (payload) => {
      if (payload.new.user_id !== user.id) {
        setOtherUserTyping(payload.new.is_typing);
      }
    });

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [selectedConversation, user]);

  const loadConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_1:profiles!conversations_participant_1_id_fkey(id, username, full_name, avatar_url, is_online),
        participant_2:profiles!conversations_participant_2_id_fkey(id, username, full_name, avatar_url, is_online)
      `)
      .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    // Process conversations to get other participant
    const processedConversations = data.map(conv => {
      const otherParticipant = conv.participant_1_id === user.id
        ? conv.participant_2
        : conv.participant_1;

      return {
        ...conv,
        other_participant: otherParticipant,
      };
    });

    setConversations(processedConversations);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(username, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);

      // Mark all unread messages as read
      const unreadMessageIds = data
        .filter(msg => !msg.is_read && msg.sender_id !== user?.id)
        .map(msg => msg.id);

      if (unreadMessageIds.length > 0) {
        unreadMessageIds.forEach(id => markMessageAsRead(id));
      }

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        content: newMessage.trim(),
      });

    if (!error) {
      setNewMessage("");
      handleTyping(false);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (!selectedConversation || !user) return;

    setIsTyping(typing);
    sendTypingIndicator(selectedConversation, user.id, typing);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds
    if (typing) {
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 3000);
    }
  };

  const handleMessageInput = (value: string) => {
    setNewMessage(value);

    if (value.trim() && !isTyping) {
      handleTyping(true);
    } else if (!value.trim() && isTyping) {
      handleTyping(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return conv.other_participant?.username?.toLowerCase().includes(searchLower) ||
             conv.other_participant?.full_name?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  if (!user) return null;

  return (
    <MemberLayout>
      <div className="min-h-screen bg-[#fdf5f7]">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#c9969e]/10 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-[#251218]/5">
                <h2
                  className="text-2xl text-[#251218] mb-4"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Messages
                </h2>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-white/60 border border-[#251218]/10 rounded-lg focus:border-[#c9969e]/30 focus:outline-none transition-all"
                    style={{ fontFamily: "Lora, serif", color: "#251218" }}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-white/40 transition-colors border-b border-[#251218]/5 ${
                      selectedConversation === conv.id ? "bg-white/60" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white font-medium">
                        {conv.other_participant?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      {conv.other_participant?.is_online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className="font-medium text-[#251218] truncate"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          @{conv.other_participant?.username || "unknown"}
                        </p>
                        <span
                          className="text-xs text-[#251218]/50"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {new Date(conv.last_message_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className="text-sm text-[#251218]/60 truncate"
                        style={{ fontFamily: "Lora, serif" }}
                      >
                        {conv.last_message?.content || "Start a conversation"}
                      </p>
                    </div>
                  </button>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center">
                    <p
                      className="text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      No conversations yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Thread */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#c9969e]/10 overflow-hidden flex flex-col">
              {selectedConv ? (
                <>
                  {/* Thread Header */}
                  <div className="p-6 border-b border-[#251218]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white">
                          {selectedConv.other_participant?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        {selectedConv.other_participant?.is_online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <p
                          className="font-medium text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          @{selectedConv.other_participant?.username || "unknown"}
                        </p>
                        {selectedConv.other_participant?.is_online && (
                          <p
                            className="text-xs text-green-600"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            Online
                          </p>
                        )}
                      </div>
                    </div>

                    <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-[#251218]/40" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === user.id;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              isOwnMessage
                                ? "bg-gradient-to-r from-[#c9969e] to-[#251218] text-white"
                                : "bg-white/80 text-[#251218]"
                            }`}
                          >
                            <p
                              className="whitespace-pre-wrap"
                              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                            >
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? "text-white/70" : "text-[#251218]/50"
                              }`}
                              style={{ fontFamily: "Lora, serif" }}
                            >
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {isOwnMessage && message.is_read && " · Read"}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing Indicator */}
                    {otherUserTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/80 px-4 py-3 rounded-2xl">
                          <div className="flex gap-1">
                            <Circle className="w-2 h-2 fill-[#251218] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <Circle className="w-2 h-2 fill-[#251218] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <Circle className="w-2 h-2 fill-[#251218] animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-[#251218]/5">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                        style={{ fontFamily: "Lora, serif", color: "#251218" }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p
                      className="text-2xl text-[#251218]/60 mb-2"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Select a conversation
                    </p>
                    <p
                      className="text-[#251218]/40"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      Choose from your existing conversations or start a new one
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
