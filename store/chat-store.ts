import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation, Chat } from '@/types/chat';
import { apiClient } from '@/utils/api';
import { io, Socket } from 'socket.io-client';
import env from '@config/env';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  socket: Socket | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connectSocket: () => void;
  disconnectSocket: () => void;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  socket: null,
  isLoading: false,
  error: null,

  connectSocket: () => {
    const socket = io(env.SOCKET_URL, {
      auth: {
        token: AsyncStorage.getItem('auth_token'),
      },
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('newMessage', (message: Message) => {
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessage: message,
                unreadCount: chat.id === state.currentChat?.id ? 0 : chat.unreadCount + 1,
              }
            : chat
        );

        const updatedMessages =
          state.currentChat?.id === message.chatId
            ? [...state.messages, message]
            : state.messages;

        return {
          chats: updatedChats,
          messages: updatedMessages,
        };
      });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchChats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<Chat[]>('/chats');
      set({
        chats: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch chats',
        isLoading: false,
      });
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`);
      const chat = get().chats.find((c) => c.id === chatId);
      
      set({
        currentChat: chat || null,
        messages: response.data,
        isLoading: false,
      });
      
      // Mark messages as read
      if (chat) {
        get().markAsRead(chatId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch messages',
        isLoading: false,
      });
    }
  },

  sendMessage: async (chatId: string, content: string) => {
    try {
      const { socket } = get();
      if (!socket) {
        throw new Error('Socket not connected');
      }

      const message = {
        chatId,
        content,
        timestamp: new Date(),
      };

      socket.emit('sendMessage', message);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send message',
      });
    }
  },

  markAsRead: async (chatId: string) => {
    try {
      await apiClient.patch(`/chats/${chatId}/read`);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to mark chat as read',
      });
    }
  },

  clearError: () => set({ error: null }),
}));