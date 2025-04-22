import { create } from 'zustand';
import { apiClient } from '@/utils/api';
import { Notification } from '@/types';
import * as Notifications from 'expo-notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pushToken: string | null;
  
  // Actions
  registerForPushNotifications: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pushToken: null,

  registerForPushNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      // Register token with backend
      await apiClient.post('/users/push-token', { token });
      
      set({
        pushToken: token,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to register for push notifications',
        isLoading: false,
      });
    }
  },

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get<Notification[]>('/notifications');
      const unreadCount = response.data.filter(n => !n.read).length;
      
      set({
        notifications: response.data,
        unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.patch(`/notifications/${notificationId}/read`);
      
      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to mark notification as read',
        isLoading: false,
      });
    }
  },

  markAllAsRead: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.patch('/notifications/read-all');
      
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to mark all notifications as read',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
})); 