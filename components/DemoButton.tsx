import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  PlayCircle, 
  X, 
  ChevronRight, 
  Zap, 
  Users, 
  Briefcase, 
  MessageSquare, 
  User, 
  Plus 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDemoStore, DemoStep } from '@/store/demo-store';
import { Button } from './Button';

// Helper functions moved outside components to be accessible to both
function getStepIcon(step: DemoStep) {
  switch (step) {
    case 'welcome':
      return <Zap size={24} color={colors.primary} />;
    case 'categories':
      return <Zap size={24} color={colors.primary} />;
    case 'workers':
      return <Users size={24} color={colors.primary} />;
    case 'jobs':
      return <Briefcase size={24} color={colors.primary} />;
    case 'chat':
      return <MessageSquare size={24} color={colors.primary} />;
    case 'profile':
      return <User size={24} color={colors.primary} />;
    case 'post-job':
      return <Plus size={24} color={colors.primary} />;
    case 'complete':
      return <Zap size={24} color={colors.primary} />;
  }
}

function getStepTitle(step: DemoStep) {
  switch (step) {
    case 'welcome':
      return "Welcome to Fyke";
    case 'categories':
      return "Browse Categories";
    case 'workers':
      return "Find Workers";
    case 'jobs':
      return "Explore Jobs";
    case 'chat':
      return "Chat with Workers";
    case 'profile':
      return "Manage Profile";
    case 'post-job':
      return "Post a Job";
    case 'complete':
      return "Demo Complete";
  }
}

function getStepDescription(step: DemoStep) {
  switch (step) {
    case 'welcome':
      return "Fyke connects you with skilled professionals for all your needs. Let's explore the app together!";
    case 'categories':
      return "Browse through different service categories to find the right professional for your needs.";
    case 'workers':
      return "Discover top-rated workers in your area. View their profiles, ratings, and availability.";
    case 'jobs':
      return "Browse available jobs or post your own. Filter by category, location, and more.";
    case 'chat':
      return "Communicate directly with workers to discuss job details, pricing, and scheduling.";
    case 'profile':
      return "Manage your profile, track your jobs, and update your preferences.";
    case 'post-job':
      return "Need something done? Post a job and get matched with qualified professionals.";
    case 'complete':
      return "You've completed the demo! You now know how to use Fyke to find skilled professionals or get hired for jobs.";
  }
}

interface DemoButtonProps {
  style?: any;
}

export const DemoButton: React.FC<DemoButtonProps> = ({ style }) => {
  const router = useRouter();
  const { 
    isDemoMode, 
    toggleDemoMode, 
    currentStep, 
    setCurrentStep, 
    completeStep 
  } = useDemoStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  
  const handleToggleDemo = () => {
    if (!isDemoMode) {
      setModalVisible(true);
    } else {
      toggleDemoMode();
    }
  };
  
  const startDemo = () => {
    toggleDemoMode();
    setModalVisible(false);
    
    // Animate the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Navigate to the first step
    navigateToStep('welcome');
  };
  
  const navigateToStep = (step: DemoStep) => {
    setCurrentStep(step);
    
    switch (step) {
      case 'welcome':
        router.push('/');
        break;
      case 'categories':
        router.push('/');
        break;
      case 'workers':
        router.push('/workers');
        break;
      case 'jobs':
        router.push('/jobs');
        break;
      case 'chat':
        router.push('/chats');
        break;
      case 'profile':
        router.push('/settings');
        break;
      case 'post-job':
        router.push('/post-job');
        break;
      case 'complete':
        router.push('/');
        break;
    }
  };
  
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });
  
  return (
    <>
      <Animated.View 
        style={[
          styles.container,
          style,
          { transform: [{ scale }] }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            isDemoMode && styles.activeButton
          ]}
          onPress={handleToggleDemo}
          activeOpacity={0.8}
        >
          <PlayCircle size={24} color={isDemoMode ? '#FFFFFF' : colors.primary} />
          <Text style={[
            styles.buttonText,
            isDemoMode && styles.activeButtonText
          ]}>
            {isDemoMode ? 'Exit Demo' : 'Demo Mode'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>App Demo</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Experience a guided tour of Fyke's key features. This demo will walk you through:
              </Text>
              
              <View style={styles.featuresList}>
                {(['welcome', 'categories', 'workers', 'jobs', 'chat', 'profile', 'post-job'] as DemoStep[]).map((step) => (
                  <View key={step} style={styles.featureItem}>
                    {getStepIcon(step)}
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>{getStepTitle(step)}</Text>
                      <Text style={styles.featureDescription}>{getStepDescription(step)}</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textLight} />
                  </View>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="Start Demo"
                onPress={startDemo}
                type="primary"
                size="large"
                style={styles.startButton}
              />
              <Button
                title="Maybe Later"
                onPress={() => setModalVisible(false)}
                type="text"
                size="medium"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {isDemoMode && (
        <DemoTooltip
          step={currentStep}
          onNext={() => completeStep(currentStep)}
          onSkip={() => toggleDemoMode()}
        />
      )}
    </>
  );
};

interface DemoTooltipProps {
  step: DemoStep;
  onNext: () => void;
  onSkip: () => void;
}

const DemoTooltip: React.FC<DemoTooltipProps> = ({ step, onNext, onSkip }) => {
  const [animation] = useState(new Animated.Value(0));
  
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step]);
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  return (
    <Animated.View 
      style={[
        styles.tooltipContainer,
        {
          transform: [{ translateY }],
          opacity
        }
      ]}
    >
      <View style={styles.tooltipContent}>
        <View style={styles.tooltipHeader}>
          <View style={styles.tooltipIconContainer}>
            {getStepIcon(step)}
          </View>
          <Text style={styles.tooltipTitle}>{getStepTitle(step)}</Text>
        </View>
        
        <Text style={styles.tooltipDescription}>
          {getStepDescription(step)}
        </Text>
        
        <View style={styles.tooltipFooter}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
          >
            <Text style={styles.skipButtonText}>Exit Demo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={onNext}
          >
            <Text style={styles.nextButtonText}>
              {step === 'complete' ? 'Finish' : 'Next'}
            </Text>
            {step !== 'complete' && (
              <ChevronRight size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: height * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.highlight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 8,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  tooltipContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tooltipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  tooltipDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  tooltipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textLight,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
});