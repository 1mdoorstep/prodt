import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isUserMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUserMessage 
}) => {
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isUserMessage ? styles.userContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.bubble,
        isUserMessage ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUserMessage ? styles.userMessageText : styles.otherMessageText
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={[
        styles.timeText,
        isUserMessage ? styles.userTimeText : styles.otherTimeText
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.highlight,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: colors.text,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimeText: {
    color: colors.textLight,
    alignSelf: 'flex-end',
  },
  otherTimeText: {
    color: colors.textLight,
    alignSelf: 'flex-start',
  },
});