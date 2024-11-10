import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface CircularTimerProps {
  progress: number;
  duration: number;
  timeRemaining: number;
  isPaused: boolean;
  isRunning: boolean;
  label: string;
}

export default function CircularTimer({
  progress,
  duration,
  timeRemaining,
  isPaused,
  isRunning,
  label,
}: CircularTimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const createArc = (cx: number, cy: number, r: number) => {
    const path = Skia.Path.Make();
    path.addCircle(cx, cy, r);
    return path;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isRunning && !isPaused ? 1.02 : 1 }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <Canvas style={styles.canvas}>
          <Group>
            <Circle 
              cx={wp('37.5')} 
              cy={wp('37.5')} 
              r={wp('35')}
              color="rgba(255, 255, 255, 0.1)"
            />
            <Path
              path={createArc(wp('37.5'), wp('37.5'), wp('35'))}
              color="#4CAF50"
              style="stroke"
              strokeWidth={wp('3')}
              strokeCap="round"
              start={0}
              end={progress}
            />
          </Group>
        </Canvas>
        
        <View style={styles.content}>
          <Text style={styles.timeText}>
            {formatTime(timeRemaining || duration * 60)}
          </Text>
          <Text style={styles.labelText}>
            {isRunning 
              ? (isPaused ? 'PAUSED' : label || 'FOCUS TIME') 
              : 'Drag to set timer'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp('75%'),
    height: wp('75%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: wp('75%'),
    height: wp('75%'),
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: wp('12%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelText: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: wp('2%'),
  },
}); 