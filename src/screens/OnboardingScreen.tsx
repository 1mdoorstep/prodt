import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@components/Button';
import { useThemeColors } from '@utils/theme';
import { RootStackParamList } from '@navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@store/auth-store';

const { width } = Dimensions.get('window');

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const colors = useThemeColors();
  const { setHasCompletedOnboarding } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Find Jobs Near You',
      description: 'Discover local job opportunities that match your skills',
      image: require('@assets/onboarding1.png'),
    },
    {
      id: 2,
      title: 'Get Hired Fast',
      description: 'Connect with employers and get hired quickly',
      image: require('@assets/onboarding2.png'),
    },
    {
      id: 3,
      title: 'Earn Money',
      description: 'Start earning by completing jobs in your area',
      image: require('@assets/onboarding3.png'),
    },
  ];

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleContinue = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setHasCompletedOnboarding(true);
      navigation.navigate('Auth', { screen: 'Login' });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.slide}>
        <Image
          source={slides[currentSlide].image}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {slides[currentSlide].title}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {slides[currentSlide].description}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentSlide ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="outline"
            style={styles.button}
          />
          <Button
            title={currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
            onPress={handleContinue}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
}); 