import React from 'react';
import { View, Platform, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { TabItem } from './TabItem';
import type { CustomBottomTabProps, TabIconProps } from './types';
import { ICON_MAPPING } from './constants';

export const CustomBottomTab: React.FC<CustomBottomTabProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <BlurView intensity={80} style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Skip rendering hidden tabs
          if (options.tabBarStyle?.display === 'none') {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              options={options}
            />
          );
        })}
      </View>
    </BlurView>
  );
}; 