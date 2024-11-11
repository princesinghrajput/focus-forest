import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import type { SharedValue } from 'react-native-reanimated';

interface CircularTimerProps {
  progress: SharedValue<number>;
  timeRemaining: number;
  duration?: number;
  isPaused: boolean;
  isRunning: boolean;
  label: string;
  size?: number;
  strokeWidth?: number;
  colors?: {
    background?: string;
    progress?: string;
    text?: string;
    subtext?: string;
  };
}

const DEFAULT_COLORS = {
  background: 'rgba(255, 255, 255, 0.2)',
  progress: '#4CAF50',
  text: '#FFFFFF',
  subtext: 'rgba(255, 255, 255, 0.7)',
};

export const CircularTimer: React.FC<CircularTimerProps> = ({
  progress,
  timeRemaining,
  duration = 25,
  isPaused,
  isRunning,
  label,
  size = wp('60%'),
  strokeWidth = 15,
  colors = DEFAULT_COLORS,
}) => {
  // Memoize calculations for better performance
  const { center, radius, circumference, progressPath } = useMemo(() => {
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    const path = Skia.Path.Make();
    path.addCircle(center, center, radius);
    
    return { center, radius, circumference, progressPath: path };
  }, [size, strokeWidth]);

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ width: size, height: size }}>
        <Group>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            color={colors.background}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress Circle */}
          <Path
            path={progressPath}
            color={colors.progress}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            start={0}
            end={progress}
          />
        </Group>
      </Canvas>
      
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {formatTime(timeRemaining)}
        </Text>
        {isRunning ? (
          <Text style={[styles.durationText, { color: colors.subtext }]}>
            {isPaused ? 'PAUSED' : `of ${duration}:00`}
          </Text>
        ) : (
          <Text style={[styles.durationText, { color: colors.subtext }]}>
            {`${duration} MIN`}
          </Text>
        )}
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: wp('12%'),
    fontWeight: 'bold',
    letterSpacing: wp('0.5%'),
  },
  durationText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    marginTop: wp('1%'),
    letterSpacing: wp('0.2%'),
  },
  label: {
    fontSize: wp('4%'),
    opacity: 0.8,
    marginTop: wp('3%'),
    fontWeight: '500',
  },
}); 