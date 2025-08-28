import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, Clock, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { MessagingService } from '../services/messagingService';
import { supabase, isSupabaseReady, mockAuthUser } from '../lib/supabase';
import type { MessageThread, Message, Profile } from '../types';

interface ThreadWithDetails extends MessageThread {
  listing: any;
  buyer: Profile;
  seller: Profile;
  lastMessage?: Message;
  unreadCount?: number;
}

function MessagesPage() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [threads, setThreads] = useState<ThreadWithDetails[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!isSupabaseReady()) {
        setUser(mockAuthUser);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth?redirect=/messages');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        navigate('/auth?redirect=/messages');
      }
    };

    getCurrentUser();
  }, [navigate]);

  // Load threads
  useEffect(() => {
    const loadThreads = async () => {
      if (!user) return;

      try {
        const threadData = await MessagingService.getThreads(user.id);
        setThreads(threadData);
        
        // If threadId in URL, select that thread
        if (threadId) {
          const thread = threadData.find(t => t.id === threadId);
          if (thread) {
            setSelectedThread(thread);
          }
        }
      } catch (error) {
        console.error('Error loading threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThreads();
  }, [user, threadId]);

  // Load messages for selected thread
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedThread) return;

      try {
        const messageData = await MessagingService.getMessages(selectedThread.id);
        setMessages(messageData);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [selectedThread]);

  // Subscribe to new messages
  useEffect(() => {
    if (!selectedThread) return;

    const unsubscribe = MessagingService.subscribeToThread(
      selectedThread.id,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return unsubscribe;
  }, [selectedThread]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread || !user || isSending) return;

    setIsSending(true);
    try {
      const message = await MessagingService.sendMessage(
        selectedThread.id,
        user.id,
        newMessage.trim()
      );

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {!isSupabaseReady() && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-6xl mx-auto text-sm text-yellow-800">
            <strong>Development Mode:</strong> Using mock messaging data. 
            Configure Supabase for real messaging functionality.
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex h-[calc(100vh-80px)]">
          {/* Thread List */}
          <div className={`${selectedThread ? 'hidden md:block' : 'block'} w-full md:w-1/3 bg-white border-r`}>
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600 mt-1">
                {threads.length} conversation{threads.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="overflow-y-auto h-full">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-4" />
                  <p className="text-center">No messages yet</p>
                  <p className="text-sm text-center mt-1">
                    Messages from interested renters will appear here
                  </p>
                </div>
              ) : (
                threads.map((thread) => {
                  const otherUser = thread.buyer.id === user?.id ? thread.seller : thread.buyer;
                  const isSelected = selectedThread?.id === thread.id;
                  
                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setSelectedThread(thread);
                        navigate(`/messages/${thread.id}`);
                      }}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                        isSelected ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={otherUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.full_name || 'User')}&size=40`}
                          alt={otherUser.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {otherUser.full_name || 'Unknown User'}
                            </h3>
                            {thread.lastMessage && (
                              <span className="text-xs text-gray-500 ml-2">
                                {formatTime(thread.lastMessage.sent_at)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600 truncate">
                              {thread.listing?.title}
                            </span>
                          </div>
                          
                          {thread.lastMessage && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {thread.lastMessage.sender_id === user?.id ? 'You: ' : ''}
                              {thread.lastMessage.body}
                            </p>
                          )}
                        </div>
                        
                        {thread.unreadCount && thread.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                            {thread.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div className={`${selectedThread ? 'block' : 'hidden md:block'} flex-1 flex flex-col bg-white`}>
            {selectedThread ? (
              <>
                {/* Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedThread(null);
                        navigate('/messages');
                      }}
                      className="md:hidden p-1 hover:bg-gray-200 rounded"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <img
                      src={selectedThread.listing?.listing_photos?.[0]?.url || 'https://via.placeholder.com/40'}
                      alt={selectedThread.listing?.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900">
                        {selectedThread.listing?.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        with {(selectedThread.buyer.id === user?.id ? selectedThread.seller : selectedThread.buyer).full_name}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${selectedThread.listing?.price}/mo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.sender_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.body}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.sent_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;