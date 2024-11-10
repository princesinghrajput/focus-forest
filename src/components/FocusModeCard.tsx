import React from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';

interface FocusModeCardProps {
  mode: {
    id: string;
    duration: number;
    label: string;
    description: string;
    icon: string;
    color: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export const FocusModeCard = ({ mode, isSelected, onSelect }: FocusModeCardProps) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          isSelected && { backgroundColor: mode.color },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={mode.icon as any}
          size={24}
          color={isSelected ? '#FFFFFF' : mode.color}
        />
        <View style={styles.content}>
          <Text style={[styles.label, isSelected && styles.selectedText]}>
            {mode.label}
          </Text>
          <Text style={[styles.description, isSelected && styles.selectedText]}>
            {mode.description}
          </Text>
        </View>
        <View style={styles.duration}>
          <Text style={[styles.durationText, isSelected && styles.selectedText]}>
            {mode.duration}m
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
  },
  content: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  label: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
  },
  duration: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
  },
}); 