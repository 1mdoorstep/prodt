import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation, Chat } from '@/types/chat';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
}

interface ChatStore extends ChatState {
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
  startConversation: (participantId: string, participantName: string, participantAvatar?: string) => string;
  getMessages: (conversationId: string) => Message[];
  chats: Chat[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      isLoading: false,
      error: null,
      
      get chats() {
        return get().conversations.map(conv => ({
          id: conv.id,
          userId: conv.participantId,
          name: conv.participantName,
          avatar: conv.participantAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          lastMessage: conv.lastMessage?.text || 'Start a conversation',
          timestamp: conv.lastMessage?.timestamp || new Date(),
          unread: conv.unreadCount,
        }));
      },
      
      sendMessage: (conversationId, text) => {
        const { conversations, messages } = get();
        
        // Create new message
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: 'me', // Current user ID
          text,
          timestamp: new Date(),
          status: 'sent',
        };
        
        // Find conversation
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        
        if (conversationIndex === -1) {
          set({ error: 'Conversation not found' });
          return;
        }
        
        // Update conversation with last message
        const updatedConversations = [...conversations];
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          lastMessage: newMessage,
        };
        
        // Add message to messages list
        const conversationMessages = messages[conversationId] || [];
        const updatedMessages = {
          ...messages,
          [conversationId]: [...conversationMessages, newMessage],
        };
        
        set({
          conversations: updatedConversations,
          messages: updatedMessages,
        });
        
        // Simulate reply after 1-3 seconds
        setTimeout(() => {
          const { conversations, messages } = get();
          
          // Create reply message
          const replyMessage: Message = {
            id: Date.now().toString(),
            senderId: conversationId,
            text: 'Thanks for your message. I will get back to you soon.',
            timestamp: new Date(),
            status: 'delivered',
          };
          
          // Update conversation with last message and increment unread count
          const conversationIndex = conversations.findIndex(c => c.id === conversationId);
          
          if (conversationIndex === -1) return;
          
          const updatedConversations = [...conversations];
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            lastMessage: replyMessage,
            unreadCount: updatedConversations[conversationIndex].unreadCount + 1,
          };
          
          // Add reply to messages list
          const conversationMessages = messages[conversationId] || [];
          const updatedMessages = {
            ...messages,
            [conversationId]: [...conversationMessages, replyMessage],
          };
          
          set({
            conversations: updatedConversations,
            messages: updatedMessages,
          });
        }, 1000 + Math.random() * 2000);
      },
      
      markAsRead: (conversationId) => {
        const { conversations, messages } = get();
        
        // Find conversation
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        
        if (conversationIndex === -1) {
          set({ error: 'Conversation not found' });
          return;
        }
        
        // Update conversation unread count
        const updatedConversations = [...conversations];
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          unreadCount: 0,
        };
        
        // Update message status
        const conversationMessages = messages[conversationId] || [];
        const updatedConversationMessages = conversationMessages.map(msg => 
          msg.senderId !== 'me' && msg.status !== 'read'
            ? { ...msg, status: 'read' as const }
            : msg
        );
        
        set({
          conversations: updatedConversations,
          messages: {
            ...messages,
            [conversationId]: updatedConversationMessages,
          },
        });
      },
      
      startConversation: (participantId, participantName, participantAvatar) => {
        const { conversations } = get();
        
        // Check if conversation already exists
        const existingConversation = conversations.find(c => c.participantId === participantId);
        
        if (existingConversation) {
          return existingConversation.id;
        }
        
        // Create new conversation
        const newConversationId = Date.now().toString();
        const newConversation: Conversation = {
          id: newConversationId,
          participantId,
          participantName,
          participantAvatar,
          unreadCount: 0,
          isActive: true,
        };
        
        set({
          conversations: [...conversations, newConversation],
          messages: {
            ...get().messages,
            [newConversationId]: [],
          },
        });
        
        return newConversationId;
      },
      
      getMessages: (conversationId) => {
        return get().messages[conversationId] || [];
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
      }),
    }
  )
);