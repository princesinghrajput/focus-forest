import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import { TabItemProps } from './types';
import { ICON_MAPPING } from './constants';
import { useTabAnimation } from './hooks';

export const TabItem: React.FC<TabItemProps> = ({
  route,
  isFocused,
  onPress,
  options,
}) => {
  const { animatedStyle } = useTabAnimation(isFocused);

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabItem}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <MaterialCommunityIcons
          name={ICON_MAPPING[route.name]}
          size={24}
          color={isFocused ? '#4CAF50' : '#757575'}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isFocused ? '#4CAF50' : '#757575' },
          ]}
        >
          {options.tabBarLabel || route.name}
        </Text>
        {isFocused && <View style={styles.activeIndicator} />}
      </Animated.View>
    </Pressable>
  );
}; 