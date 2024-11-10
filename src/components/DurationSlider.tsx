import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface DurationSliderProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  presets: number[];
  disabled?: boolean;
}

export default function DurationSlider({
  duration,
  onDurationChange,
  presets,
  disabled = false,
}: DurationSliderProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(disabled ? 0.95 : 1) }],
    opacity: withSpring(disabled ? 0.7 : 1),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.presets}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.presetButton,
              duration === preset && styles.presetButtonActive,
            ]}
            onPress={() => onDurationChange(preset)}
            disabled={disabled}
          >
            <Text style={[
              styles.presetText,
              duration === preset && styles.presetTextActive,
            ]}>
              {preset}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp('4%'),
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  presetButton: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: wp('5%'),
    minWidth: wp('15%'),
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#4CAF50',
  },
  presetText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
  },
  presetTextActive: {
    fontWeight: 'bold',
  },
}); 