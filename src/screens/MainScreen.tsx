import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@constants/colors';

export const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: colors.text,
  },
}); 