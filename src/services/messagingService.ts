import { supabase, isSupabaseReady, mockAuthUser } from '../lib/supabase';
import type { MessageThread, Message, Listing, Profile } from '../types';

// Mock data for development
const MOCK_THREADS: (MessageThread & { 
  listing: Listing; 
  buyer: Profile; 
  seller: Profile; 
  messages: Message[];
  lastMessage?: Message;
  unreadCount?: number;
})[] = [
  {
    id: 'thread-1',
    listing_id: '1',
    buyer_id: 'buyer-1',
    seller_id: mockAuthUser.id,
    created_at: '2024-01-01T10:00:00Z',
    listing: {
      id: '1',
      user_id: mockAuthUser.id,
      title: 'Cozy Studio Near Harvard',
      price: 2400,
      room_type: 'entire',
      city: 'Cambridge',
      state: 'MA',
      created_at: '2024-01-01',
      listing_photos: [{
        id: '1',
        listing_id: '1',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        position: 0
      }]
    },
    buyer: {
      id: 'buyer-1',
      full_name: 'Sarah Johnson',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b39b3e6e?w=100',
      school_email: 'sarah.johnson@student.harvard.edu',
      created_at: '2024-01-01'
    },
    seller: {
      id: mockAuthUser.id,
      full_name: 'You (Developer)',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      school_email: mockAuthUser.email,
      created_at: '2024-01-01'
    },
    messages: [
      {
        id: 'msg-1',
        thread_id: 'thread-1',
        sender_id: 'buyer-1',
        body: 'Hi! I\'m interested in your studio apartment near Harvard. Is it still available for the spring semester?',
        sent_at: '2024-01-01T10:00:00Z'
      },
      {
        id: 'msg-2',
        thread_id: 'thread-1',
        sender_id: mockAuthUser.id,
        body: 'Yes, it\'s still available! The dates work perfectly for spring semester. Would you like to schedule a viewing?',
        sent_at: '2024-01-01T10:30:00Z'
      },
      {
        id: 'msg-3',
        thread_id: 'thread-1',
        sender_id: 'buyer-1',
        body: 'That would be great! I\'m free this weekend. What times work for you?',
        sent_at: '2024-01-01T11:00:00Z'
      }
    ],
    lastMessage: {
      id: 'msg-3',
      thread_id: 'thread-1',
      sender_id: 'buyer-1',
      body: 'That would be great! I\'m free this weekend. What times work for you?',
      sent_at: '2024-01-01T11:00:00Z'
    },
    unreadCount: 1
  }
];

export class MessagingService {
  static async getThreads(userId: string): Promise<(MessageThread & { 
    listing: Listing; 
    buyer: Profile; 
    seller: Profile; 
    lastMessage?: Message;
    unreadCount?: number;
  })[]> {
    if (!isSupabaseReady()) {
      // Return mock data for development
      return MOCK_THREADS;
    }

    try {
      const { data: threads, error } = await supabase
        .from('message_threads')
        .select(`
          *,
          listing:listings(*),
          buyer:profiles!buyer_id(*),
          seller:profiles!seller_id(*),
          messages:messages(*)
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process threads to include last message and unread count
      return threads.map(thread => ({
        ...thread,
        lastMessage: thread.messages?.[thread.messages.length - 1],
        unreadCount: thread.messages?.filter((msg: Message) => 
          msg.sender_id !== userId && !msg.read_at
        ).length || 0
      }));
    } catch (error) {
      console.error('Error fetching message threads:', error);
      return [];
    }
  }

  static async getOrCreateThread(
    listingId: string, 
    buyerId: string, 
    sellerId: string
  ): Promise<string> {
    if (!isSupabaseReady()) {
      // Return mock thread ID for development
      return 'mock-thread-' + Date.now();
    }

    try {
      // Check if thread already exists
      const { data: existingThread } = await supabase
        .from('message_threads')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', buyerId)
        .eq('seller_id', sellerId)
        .single();

      if (existingThread) {
        return existingThread.id;
      }

      // Create new thread
      const { data: newThread, error } = await supabase
        .from('message_threads')
        .insert({
          listing_id: listingId,
          buyer_id: buyerId,
          seller_id: sellerId
        })
        .select('id')
        .single();

      if (error) throw error;
      return newThread.id;
    } catch (error) {
      console.error('Error creating message thread:', error);
      throw error;
    }
  }

  static async sendMessage(
    threadId: string, 
    senderId: string, 
    body: string
  ): Promise<Message> {
    if (!isSupabaseReady()) {
      // Return mock message for development
      const mockMessage: Message = {
        id: 'mock-msg-' + Date.now(),
        thread_id: threadId,
        sender_id: senderId,
        body,
        sent_at: new Date().toISOString()
      };
      console.log('Mock message sent:', mockMessage);
      return mockMessage;
    }

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: senderId,
          body
        })
        .select()
        .single();

      if (error) throw error;
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async getMessages(threadId: string): Promise<Message[]> {
    if (!isSupabaseReady()) {
      // Return mock messages for development
      const thread = MOCK_THREADS.find(t => t.id === threadId);
      return thread?.messages || [];
    }

    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  static subscribeToThread(
    threadId: string, 
    callback: (message: Message) => void
  ) {
    if (!isSupabaseReady()) {
      // Mock subscription for development
      console.log('Mock subscription to thread:', threadId);
      return () => console.log('Mock unsubscribe from thread:', threadId);
    }

    const subscription = supabase
      .channel(`messages:thread:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}