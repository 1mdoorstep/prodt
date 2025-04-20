import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Phone, Video, Info, ChevronLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useChatStore } from '@/store/chat-store';
import { useDriverStore } from '@/store/driver-store';
import { useAuthStore } from '@/store/auth-store';
import { MessageBubble } from '@/components/MessageBubble';
import { Driver } from '@/types/driver';
import { Message } from '@/types/chat';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { drivers, isLoading: isLoadingDrivers } = useDriverStore();
  const { messages, sendMessage, isLoading: isLoadingMessages } = useChatStore();
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Find the driver based on the ID
  useEffect(() => {
    if (id && drivers.length > 0) {
      const foundDriver = drivers.find(d => d.id === id);
      if (foundDriver) {
        setDriver(foundDriver);
      }
    }
  }, [id, drivers]);
  
  // Filter messages for this chat
  useEffect(() => {
    if (id) {
      const filteredMessages = messages.filter(
        m => (m.senderId === id && m.receiverId === user?.id) || 
             (m.senderId === user?.id && m.receiverId === id)
      );
      
      // Sort messages by timestamp
      const sortedMessages = [...filteredMessages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setChatMessages(sortedMessages);
    }
  }, [id, messages, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 200);
    }
  }, [chatMessages]);
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !driver) return;
    
    try {
      await sendMessage({
        id: Date.now().toString(),
        conversationId: `${user.id}-${driver.id}`,
        senderId: user.id,
        receiverId: driver.id,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        status: 'sent'
      });
      
      setMessageText('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };
  
  const handleCallPress = () => {
    if (!driver) return;
    
    if (!driver.allowCalls) {
      Alert.alert(
        "Calls Disabled",
        "This professional has disabled calls. Please use chat instead."
      );
      return;
    }
    
    Alert.alert("Call", `Calling ${driver.name}...`);
  };
  
  const handleVideoCallPress = () => {
    Alert.alert("Video Call", "Video calling feature coming soon!");
  };
  
  const handleInfoPress = () => {
    if (!driver) return;
    router.push(`/driver/${driver.id}`);
  };
  
  if (isLoadingDrivers || isLoadingMessages || !driver) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: driver.name,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleCallPress}
                disabled={!driver.allowCalls}
              >
                <Phone 
                  size={20} 
                  color={driver.allowCalls ? colors.primary : colors.disabled} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleVideoCallPress}
              >
                <Video size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleInfoPress}
              >
                <Info size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isUserMessage={item.senderId === user?.id}
            />
          )}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.disabled,
  },
});