import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DefaultAvatarProps {
  size: number;
  color?: string;
  backgroundColor?: string;
}

export const DefaultAvatar = ({ size, color = '#FFFFFF', backgroundColor = 'rgba(255, 255, 255, 0.2)' }: DefaultAvatarProps) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MaterialCommunityIcons name="account" size={size * 0.6} color={color} />
    </View>
  );
}; 