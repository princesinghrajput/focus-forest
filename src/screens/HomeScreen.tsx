import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Text, Portal, Modal, FAB, Snackbar, useTheme, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useApp } from '../context/AppContext';
import { FocusSession, TreeType } from '../types';
import { CircularTimer } from '../components/CircularTimer';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import { SOUND_FILES, SoundId } from '../constants/sounds';

const INTENSITY_LEVELS = [
  { id: 'low', label: 'Gentle', color: '#81C784', multiplier: 1 },
  { id: 'medium', label: 'Focused', color: '#4CAF50', multiplier: 1.5 },
  { id: 'high', label: 'Intense', color: '#388E3C', multiplier: 2 },
];

const AMBIENT_SOUNDS = [
  { id: 'rain' as SoundId, icon: 'weather-rainy', label: 'Rain' },
  { id: 'forest' as SoundId, icon: 'tree', label: 'Forest' },
  { id: 'cafe' as SoundId, icon: 'coffee', label: 'Café' },
  { id: 'fire' as SoundId, icon: 'fire', label: 'Fire' },
];

const FOCUS_MODES = [
  { 
    id: 'pomodoro',
    duration: 25,
    label: 'Pomodoro Focus',
    description: 'Perfect for short, intense work sessions',
    icon: 'timer-outline',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E8E'],
    benefits: 'Boosts productivity',
    intensity: 'Moderate',
    pattern: 'Work 25min, Break 5min'
  },
  { 
    id: 'deep',
    duration: 45,
    label: 'Deep Work',
    description: 'For complex tasks requiring full concentration',
    icon: 'brain',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#6EE7E7'],
    benefits: 'Enhanced focus',
    intensity: 'High',
    pattern: 'Sustained focus period'
  },
  { 
    id: 'flow',
    duration: 60,
    label: 'Flow State',
    description: 'Achieve peak performance and creativity',
    icon: 'lightning-bolt',
    color: '#9D50BB',
    gradient: ['#9D50BB', '#B47FD9'],
    benefits: 'Maximum output',
    intensity: 'Intense',
    pattern: 'Uninterrupted creation'
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
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { state, dispatch } = useApp();
  const { userProfile } = state;
  const progressAnimation = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const scaleAnimation = useSharedValue(1);
  const lottieRef = useRef<LottieView>(null);
  const [intensityLevel, setIntensityLevel] = useState(INTENSITY_LEVELS[1]);
  const [activeSound, setActiveSound] = useState<SoundId | null>(null);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const soundRef = useRef<Audio.Sound>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          const progress = ((selectedDuration * 60 - prev + 1) / (selectedDuration * 60));
          progressAnimation.value = withTiming(progress, {
            duration: 1000,
            easing: Easing.linear,
          });
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused, timeRemaining]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const toggleAmbientSound = async (soundId: SoundId) => {
    try {
      if (activeSound === soundId) {
        await soundRef.current?.stopAsync();
        setActiveSound(null);
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
          SOUND_FILES[soundId],
          { isLooping: true, volume: soundVolume }
        );
        soundRef.current = sound;
        await sound.playAsync();
        setActiveSound(soundId);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  useEffect(() => {
    if (isTimerRunning && !isPaused) {
      pulseAnim.value = withRepeat(
        withSpring(1.05, { damping: 2, stiffness: 80 }),
        -1,
        true
      );
    } else {
      pulseAnim.value = withSpring(1);
    }
  }, [isTimerRunning, isPaused]);

  const handleSessionComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const session: FocusSession = {
      id: Date.now().toString(),
      startTime: new Date(Date.now() - selectedDuration * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
      duration: selectedDuration,
      treeType: TreeType.BASIC,
      completed: true,
      label: taskLabel,
      notes: notes,
    };

    dispatch({ type: 'ADD_SESSION', payload: session });
    
    const xpEarned = Math.floor(selectedDuration * 2);
    const coinsEarned = Math.floor(selectedDuration);
    
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        ...userProfile,
        experience: userProfile.experience + xpEarned,
        coins: userProfile.coins + coinsEarned,
      },
    });

    setSnackbarMessage(`🎉 Session complete! +${xpEarned} XP`);
    setShowSnackbar(true);
    lottieRef.current?.play();

    const lastSession = state.sessions[state.sessions.length - 1];
    const now = new Date();
    const lastSessionDate = lastSession ? new Date(lastSession.endTime) : null;
    
    if (lastSessionDate && 
        now.getDate() === lastSessionDate.getDate() + 1) {
      setCurrentStreak(prev => prev + 1);
    } else if (!lastSessionDate || 
               now.getDate() !== lastSessionDate.getDate()) {
      setCurrentStreak(1);
    }

    const baseXP = selectedDuration * intensityLevel.multiplier;
    const streakBonus = currentStreak > 1 ? currentStreak * 0.1 : 0;
    const finalXP = Math.floor(baseXP * (1 + streakBonus));

    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        ...userProfile,
        experience: userProfile.experience + finalXP,
        coins: userProfile.coins + Math.floor(finalXP / 2),
        streak: currentStreak,
      },
    });

    setSnackbarMessage(`🎉 Great focus! +${finalXP} XP (${currentStreak} day streak!)`);
    setShowSnackbar(true);
    lottieRef.current?.play();

    scaleAnimation.value = withSpring(1.2, {}, () => {
      scaleAnimation.value = withSpring(1);
    });

    setTaskLabel('');
    setNotes('');
    setTimeRemaining(0);
    setIsTimerRunning(false);
    progressAnimation.value = 0;
    
    if (activeSound) {
      soundRef.current?.stopAsync();
      setActiveSound(null);
    }
  }, [selectedDuration, taskLabel, notes, intensityLevel, currentStreak]);

  const handleTimerControl = useCallback(() => {
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
  }, [isTimerRunning, taskLabel, selectedDuration, isPaused]);

  const renderFocusMode = (mode: typeof FOCUS_MODES[0]) => (
    <TouchableOpacity
      key={mode.id}
      style={[styles.focusModeCard]}
      onPress={() => {
        setSelectedDuration(mode.duration);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <LinearGradient
        colors={selectedDuration === mode.duration 
          ? mode.gradient 
          : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.focusModeGradient,
          selectedDuration === mode.duration && styles.focusModeGradientActive
        ]}
      >
        <View style={styles.focusModeContent}>
          {/* Icon and Title Row */}
          <View style={styles.focusModeHeader}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: selectedDuration === mode.duration 
                  ? 'rgba(255,255,255,0.2)' 
                  : mode.color + '15' 
              }
            ]}>
              <MaterialCommunityIcons
                name={mode.icon as any}
                size={28}
                color={selectedDuration === mode.duration ? '#FFFFFF' : mode.color}
              />
            </View>
            <View style={styles.headerTexts}>
              <Text style={[
                styles.focusModeLabel,
                selectedDuration === mode.duration && styles.focusModeLabelActive
              ]}>
                {mode.label}
              </Text>
              <View style={styles.durationBadge}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={selectedDuration === mode.duration ? '#FFFFFF' : mode.color}
                />
                <Text style={[
                  styles.focusModeDuration,
                  selectedDuration === mode.duration && styles.focusModeDurationActive
                ]}>
                  {mode.duration}min
                </Text>
              </View>
            </View>
          </View>

          {/* Description and Meta Info */}
          <View style={styles.focusModeDetails}>
            <Text style={[
              styles.focusModeDescription,
              selectedDuration === mode.duration && styles.focusModeDescriptionActive
            ]}>
              {mode.description}
            </Text>
            
            {/* Benefits and Intensity */}
            <View style={styles.metaRow}>
              <View style={[
                styles.metaItem,
                selectedDuration === mode.duration && styles.metaItemActive
              ]}>
                <MaterialCommunityIcons
                  name="star"
                  size={16}
                  color={selectedDuration === mode.duration ? '#FFFFFF' : mode.color}
                />
                <Text style={[
                  styles.metaText,
                  selectedDuration === mode.duration && styles.metaTextActive
                ]}>
                  {mode.benefits}
                </Text>
              </View>
              <View style={[
                styles.metaItem,
                selectedDuration === mode.duration && styles.metaItemActive
              ]}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={16}
                  color={selectedDuration === mode.duration ? '#FFFFFF' : mode.color}
                />
                <Text style={[
                  styles.metaText,
                  selectedDuration === mode.duration && styles.metaTextActive
                ]}>
                  {mode.intensity}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderIntensitySelector = () => (
    <View style={styles.intensityContainer}>
      {INTENSITY_LEVELS.map(level => (
        <TouchableOpacity
          key={level.id}
          style={[
            styles.intensityButton,
            intensityLevel.id === level.id && { backgroundColor: level.color }
          ]}
          onPress={() => {
            setIntensityLevel(level);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={[
            styles.intensityLabel,
            intensityLevel.id === level.id && styles.intensityLabelActive
          ]}>
            {level.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  const handleStopTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsTimerRunning(false);
    setTimeRemaining(0);
    setTaskLabel('');
    setNotes('');
    if (activeSound) {
      soundRef.current?.stopAsync();
      setActiveSound(null);
    }
    progressAnimation.value = 0;
    pulseAnim.value = 1;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A2980', '#26D0CE']}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView intensity={20} style={styles.gradientOverlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Stats Header */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="tree" size={24} color="#4ECDC4" />
              <Text style={styles.statValue}>{userProfile.trees.planted}</Text>
              <Text style={styles.statLabel}>Trees</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBadge}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer Section */}
          <View style={styles.timerSection}>
            <Animated.View style={[styles.timerContainer, pulseStyle]}>
              <CircularTimer
                progress={progressAnimation}
                timeRemaining={timeRemaining}
                duration={selectedDuration}
                isPaused={isPaused}
                isRunning={isTimerRunning}
                label={taskLabel || 'Ready to focus?'}
                colors={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  progress: isTimerRunning ? '#4ECDC4' : '#FF6B6B',
                  text: '#FFFFFF',
                  subtext: 'rgba(255, 255, 255, 0.7)'
                }}
              />
            </Animated.View>
          </View>

          {/* Focus Modes */}
          {!isTimerRunning && (
            <View style={styles.focusModesContainer}>
              <Text style={styles.sectionTitle}>Choose Focus Mode</Text>
              {FOCUS_MODES.map(renderFocusMode)}
            </View>
          )}

          {/* Timer Controls */}
          {isTimerRunning && (
            <View style={styles.timerControlsContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.controlsWrapper}
              >
                <View style={styles.controlsRow}>
                  <FAB
                    icon="stop"
                    style={[styles.controlButton, styles.stopButton]}
                    onPress={handleStopTimer}
                    color="#FFFFFF"
                  />
                  <FAB
                    icon={isPaused ? "play" : "pause"}
                    style={[styles.controlButton, styles.mainButton]}
                    onPress={handleTimerControl}
                    color="#FFFFFF"
                  />
                  <FAB
                    icon={activeSound ? "volume-high" : "volume-off"}
                    style={[styles.controlButton, styles.soundButton]}
                    onPress={() => setShowSoundModal(true)}
                    color="#FFFFFF"
                  />
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Add extra padding at bottom for play button */}
          {!isTimerRunning && <View style={styles.bottomPadding} />}
        </ScrollView>

        {/* Fixed Play Button at Bottom */}
        {!isTimerRunning && (
          <View style={styles.playButtonContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.playButtonWrapper}
            >
              <FAB
                icon="play"
                style={styles.playButton}
                onPress={handleTimerControl}
                color="#FFFFFF"
                label="Start Focus Session"
                uppercase={false}
              />
            </LinearGradient>
          </View>
        )}
      </SafeAreaView>

      {/* Ambient Sound Modal */}
      <Portal>
        <Modal
          visible={showSoundModal}
          onDismiss={() => setShowSoundModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Ambient Sounds</Text>
          <View style={styles.soundGrid}>
            {AMBIENT_SOUNDS.map(sound => (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.soundButton,
                  activeSound === sound.id && styles.soundButtonActive
                ]}
                onPress={() => toggleAmbientSound(sound.id)}
              >
                <MaterialCommunityIcons
                  name={sound.icon as any}
                  size={24}
                  color={activeSound === sound.id ? '#FFFFFF' : '#666666'}
                />
                <Text style={styles.soundLabel}>{sound.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </Portal>

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
      </Portal>

      {/* Notes Modal */}
      <Portal>
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
            style={styles.notesInput}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowNotes(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setShowNotes(false);
                if (notes.trim()) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={styles.modalButton}
            >
              Save Notes
            </Button>
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  statsContainer: {
    marginTop: hp('2%'),
    marginHorizontal: wp('4%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    zIndex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBadge: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginTop: hp('1%'),
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: wp('3%'),
  },
  statDivider: {
    width: 1,
    height: hp('6%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainContent: {
    flex: 1,
    marginTop: hp('4%'),
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  focusModesContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
  focusModeCard: {
    marginBottom: hp('2%'),
    borderRadius: wp('5%'),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  focusModeGradient: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('5%'),
  },
  focusModeGradientActive: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  focusModeContent: {
    padding: wp('4%'),
    marginLeft: wp('4%'),
    marginTop: hp('1%'),
  },
  focusModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',

    marginLeft: wp('4%'),
  },
  iconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  headerTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  focusModeLabel: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp('0.8%'),
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('3%'),
    alignSelf: 'flex-start',
  },
  focusModeDuration: {
    fontSize: wp('3.2%'),
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: wp('1%'),
    fontWeight: '600',
  },
  focusModeDetails: {
    paddingTop: hp('1.5%'),
  },
  focusModeDescription: {
    fontSize: wp('3.5%'),
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: hp('2%'),
    lineHeight: wp('4.8%'),
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('2%'),
    marginBottom: hp('1%'),
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('3%'),
    height: hp('4%'),
  },
  metaItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  metaText: {
    fontSize: wp('3%'),
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: wp('1.5%'),
    fontWeight: '500',
  },
  focusModeLabelActive: {
    color: '#FFFFFF',
  },
  focusModeDurationActive: {
    color: '#FFFFFF',
  },
  focusModeDescriptionActive: {
    color: '#FFFFFF',
  },
  metaTextActive: {
    color: '#FFFFFF',
  },
  cardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
  },
  focusModeInfo: {
    marginLeft: wp('4%'),
    flex: 1,
  },
  timerControlsContainer: {
    paddingHorizontal: wp('4%'),
    marginTop: hp('4%'),
    marginBottom: hp('4%'),
  },
  controlsWrapper: {
    borderRadius: wp('8%'),
    padding: wp('3%'),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('6%'),
    paddingVertical: hp('1%'),
  },
  controlButton: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  mainButton: {
    backgroundColor: '#4ECDC4',
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  soundButton: {
    backgroundColor: '#9D50BB',
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  taskLabel: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    textAlign: 'center',
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
  snackbar: {
    backgroundColor: '#4CAF50',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp('3%'),
    marginBottom: hp('4%'),
  },
  intensityButton: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('4%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  intensityLabel: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  intensityLabelActive: {
    color: '#FFFFFF',
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: wp('4%'),
    marginTop: hp('2%'),
  },
  soundButton: {
    alignItems: 'center',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    width: wp('20%'),
  },
  soundButtonActive: {
    backgroundColor: '#4CAF50',
  },
  soundLabel: {
    marginTop: hp('1%'),
    fontSize: wp('3%'),
    color: '#666666',
  },
  bottomSection: {
    flex: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    paddingTop: hp('2%'),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp('20%'), // Extra padding for play button
  },
  timerSection: {
    paddingVertical: hp('4%'),
    alignItems: 'center',
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('4%'),
  },
  playButtonWrapper: {
    borderRadius: wp('8%'),
    padding: wp('2%'),
  },
  playButton: {
    width: '100%',
    height: hp('7%'),
    borderRadius: wp('8%'),
    backgroundColor: '#4CAF50',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  bottomPadding: {
    height: hp('10%'),
  },
  notesInput: {
    marginVertical: hp('2%'),
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    minHeight: hp('15%'),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: wp('2%'),
    marginTop: hp('2%'),
  },
  modalButton: {
    minWidth: wp('25%'),
  },
});