import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text, Portal, Modal, FAB, Snackbar, useTheme, Surface, TextInput, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { FocusSession, TreeType } from '../types';
import CircularTimer from '../components/CircularTimer';
import { useSharedValue, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DURATION_PRESETS = [
  { duration: 25, label: 'Pomodoro' },
  { duration: 45, label: 'Deep Work' },
  { duration: 60, label: 'Flow State' },
];

const MOODS = [
  { icon: 'emoticon-happy', label: 'Productive', color: '#4CAF50' },
  { icon: 'emoticon-neutral', label: 'Neutral', color: '#FFC107' },
  { icon: 'emoticon-sad', label: 'Distracted', color: '#F44336' },
];

const FOCUS_MODES = [
  { 
    id: 'pomodoro',
    duration: 25,
    label: 'Pomodoro',
    description: 'Classic focus technique',
    icon: 'timer-outline',
    color: '#4CAF50'
  },
  { 
    id: 'deep',
    duration: 45,
    label: 'Deep Work',
    description: 'Extended concentration',
    icon: 'brain',
    color: '#2196F3'
  },
  { 
    id: 'flow',
    duration: 60,
    label: 'Flow State',
    description: 'Maximum productivity',
    icon: 'lightning-bolt',
    color: '#9C27B0'
  }
];

export default function HomeScreen() {
  const theme = useTheme();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [isPaused, setIsPaused] = useState(false);
  const [taskLabel, setTaskLabel] = useState('');
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const { state, dispatch } = useApp();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { userProfile } = state;
  const progressAnimation = useSharedValue(0);
  const scaleAnimation = new Animated.Value(1);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // Timer animation
  useEffect(() => {
    if (isTimerRunning && !isPaused && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          const progress = ((selectedDuration * 60 - prev + 1) / (selectedDuration * 60));
          progressAnimation.value = withTiming(progress, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning, isPaused, timeRemaining]);

  const handleSessionComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const session: FocusSession = {
      id: Date.now().toString(),
      duration: selectedDuration,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completed: true,
      treeType: TreeType.BASIC,
      label: taskLabel,
    };
    
    const baseXP = selectedDuration * 2;
    const moodBonus = selectedMood === 'Productive' ? 1.2 : selectedMood === 'Neutral' ? 1 : 0.8;
    const finalXP = Math.round(baseXP * moodBonus);
    const baseCoins = selectedDuration;
    
    dispatch({ type: 'ADD_SESSION', payload: session });
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        experience: userProfile.experience + finalXP,
        coins: userProfile.coins + baseCoins,
        trees: {
          ...userProfile.trees,
          planted: userProfile.trees.planted + 1,
          alive: userProfile.trees.alive + 1,
        },
      },
    });

    setShowMoodModal(true);
    setSnackbarMessage(`🎉 Session complete! +${finalXP} XP`);
    setShowSnackbar(true);
    
    Animated.sequence([
      Animated.spring(scaleAnimation, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedDuration, taskLabel, selectedMood, userProfile]);

  const handleTimerControl = () => {
    if (!isTimerRunning && !taskLabel) {
      setShowLabelModal(true);
      return;
    }

    if (!isTimerRunning) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeRemaining(selectedDuration * 60);
      setIsTimerRunning(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsPaused(!isPaused);
    }
  };

  const renderFocusMode = (mode: typeof FOCUS_MODES[0]) => (
    <TouchableOpacity
      key={mode.id}
      style={[
        styles.focusModeCard,
        selectedDuration === mode.duration && styles.focusModeCardActive
      ]}
      onPress={() => {
        setSelectedDuration(mode.duration);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <MaterialCommunityIcons
        name={mode.icon as any}
        size={24}
        color={selectedDuration === mode.duration ? '#FFFFFF' : mode.color}
      />
      <View style={styles.focusModeInfo}>
        <Text style={[
          styles.focusModeLabel,
          selectedDuration === mode.duration && styles.focusModeLabelActive
        ]}>
          {mode.label}
        </Text>
        <Text style={[
          styles.focusModeDescription,
          selectedDuration === mode.duration && styles.focusModeDescriptionActive
        ]}>
          {mode.description}
        </Text>
      </View>
      <Text style={[
        styles.focusModeDuration,
        selectedDuration === mode.duration && styles.focusModeDurationActive
      ]}>
        {mode.duration}m
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.8,
    },
    content: {
      flex: 1,
      padding: wp('4%'),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp('2%'),
    },
    statsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: wp('4%'),
      padding: wp('4%'),
      marginBottom: hp('2%'),
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      color: '#FFFFFF',
      fontSize: wp('5%'),
      fontWeight: 'bold',
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: wp('3%'),
      marginTop: hp('0.5%'),
    },
    timerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    taskLabel: {
      color: '#FFFFFF',
      fontSize: wp('4.5%'),
      fontWeight: '600',
      textAlign: 'center',
      marginTop: hp('2%'),
    },
    presetContainer: {
      marginBottom: hp('4%'),
    },
    presetRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: hp('2%'),
    },
    presetButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: wp('4%'),
      padding: wp('3%'),
      alignItems: 'center',
      width: wp('28%'),
    },
    presetButtonActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    presetLabel: {
      color: '#FFFFFF',
      fontSize: wp('3.5%'),
      marginTop: hp('1%'),
    },
    controlButton: {
      backgroundColor: theme.colors.primary,
      width: wp('18%'),
      height: wp('18%'),
      borderRadius: wp('9%'),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      margin: wp('8%'),
      padding: wp('6%'),
      borderRadius: wp('4%'),
    },
    modalTitle: {
      fontSize: wp('5%'),
      fontWeight: 'bold',
      marginBottom: hp('2%'),
      textAlign: 'center',
    },
    input: {
      marginBottom: hp('2%'),
    },
    moodRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: hp('2%'),
    },
    moodButton: {
      alignItems: 'center',
    },
    moodIcon: {
      marginBottom: hp('1%'),
    },
    moodLabel: {
      fontSize: wp('3%'),
      color: '#666666',
    },
    notesButton: {
      position: 'absolute',
      right: wp('4%'),
      bottom: hp('12%'),
    },
    snackbar: {
      backgroundColor: theme.colors.primary,
    },
    quickStats: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: wp('4%'),
      marginTop: hp('2%'),
    },
    statBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('1%'),
      borderRadius: wp('4%'),
      gap: wp('2%'),
    },
    statText: {
      color: '#FFFFFF',
      fontSize: wp('3.5%'),
      fontWeight: '600',
    },
    focusModesContainer: {
      marginTop: hp('4%'),
    },
    sectionTitle: {
      color: '#FFFFFF',
      fontSize: wp('4%'),
      fontWeight: '600',
      marginBottom: hp('2%'),
      marginLeft: wp('2%'),
    },
    focusModeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: wp('4%'),
      borderRadius: wp('3%'),
      marginBottom: hp('2%'),
    },
    focusModeCardActive: {
      backgroundColor: '#4CAF50',
    },
    focusModeInfo: {
      flex: 1,
      marginLeft: wp('3%'),
    },
    focusModeLabel: {
      color: '#FFFFFF',
      fontSize: wp('4%'),
      fontWeight: '600',
    },
    focusModeLabelActive: {
      color: '#FFFFFF',
    },
    focusModeDescription: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: wp('3%'),
      marginTop: hp('0.5%'),
    },
    focusModeDescriptionActive: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
    focusModeDuration: {
      color: '#FFFFFF',
      fontSize: wp('4%'),
      fontWeight: '600',
    },
    focusModeDurationActive: {
      color: '#FFFFFF',
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp('4%'),
      marginTop: hp('4%'),
    },
    mainButton: {
      backgroundColor: '#4CAF50',
      width: wp('18%'),
      height: wp('18%'),
    },
    stopButton: {
      backgroundColor: '#F44336',
    },
    notesButton: {
      backgroundColor: '#2196F3',
    },
    taskContainer: {
      marginTop: hp('2%'),
      alignItems: 'center',
    },
    taskNotes: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: wp('3.5%'),
      marginTop: hp('1%'),
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32']}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView intensity={20} style={styles.gradientOverlay} />

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statBadge}>
            <MaterialCommunityIcons name="tree" size={20} color="#4CAF50" />
            <Text style={styles.statText}>{userProfile.trees.planted}</Text>
          </View>
          <View style={styles.statBadge}>
            <MaterialCommunityIcons name="fire" size={20} color="#FF9800" />
            <Text style={styles.statText}>{userProfile.streak}d</Text>
          </View>
          <View style={styles.statBadge}>
            <MaterialCommunityIcons name="star" size={20} color="#FFC107" />
            <Text style={styles.statText}>Lvl {userProfile.level}</Text>
          </View>
        </View>

        {/* Timer Section */}
        <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnimation }] }]}>
          <CircularTimer
            progress={progressAnimation.value}
            duration={selectedDuration}
            timeRemaining={timeRemaining}
            isPaused={isPaused}
            isRunning={isTimerRunning}
            label={taskLabel}
          />
          {taskLabel && (
            <View style={styles.taskContainer}>
              <Text style={styles.taskLabel}>{taskLabel}</Text>
              {notes && <Text style={styles.taskNotes}>{notes}</Text>}
            </View>
          )}
        </Animated.View>

        {/* Focus Modes */}
        {!isTimerRunning && (
          <View style={styles.focusModesContainer}>
            <Text style={styles.sectionTitle}>Focus Modes</Text>
            {FOCUS_MODES.map(renderFocusMode)}
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {isTimerRunning && (
            <FAB
              icon="stop"
              style={[styles.controlButton, styles.stopButton]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setIsTimerRunning(false);
                setTimeRemaining(0);
              }}
              color="#FFFFFF"
            />
          )}
          <FAB
            icon={isTimerRunning ? (isPaused ? "play" : "pause") : "play"}
            style={[styles.controlButton, styles.mainButton]}
            onPress={handleTimerControl}
            color="#FFFFFF"
          />
          {isTimerRunning && (
            <FAB
              icon="note-text"
              style={[styles.controlButton, styles.notesButton]}
              onPress={() => setShowNotes(true)}
              color="#FFFFFF"
            />
          )}
        </View>
      </View>

      {/* Task Label Modal */}
      <Portal>
        <Modal
          visible={showLabelModal}
          onDismiss={() => setShowLabelModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>What are you focusing on?</Text>
          <TextInput
            mode="outlined"
            label="Task Label"
            value={taskLabel}
            onChangeText={setTaskLabel}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={() => {
              setShowLabelModal(false);
              handleTimerControl();
            }}
          >
            Start Focus Session
          </Button>
        </Modal>

        {/* Mood Selection Modal */}
        <Modal
          visible={showMoodModal}
          onDismiss={() => setShowMoodModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>How was your focus session?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={styles.moodButton}
                onPress={() => {
                  setSelectedMood(mood.label);
                  setShowMoodModal(false);
                }}
              >
                <MaterialCommunityIcons
                  name={mood.icon as any}
                  size={40}
                  color={mood.color}
                  style={styles.moodIcon}
                />
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        {/* Notes Modal */}
        <Modal
          visible={showNotes}
          onDismiss={() => setShowNotes(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Session Notes</Text>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about your focus session..."
            style={styles.input}
          />
          <Button mode="contained" onPress={() => setShowNotes(false)}>
            Save Notes
          </Button>
        </Modal>
      </Portal>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}