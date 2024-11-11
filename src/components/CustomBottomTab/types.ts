import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ViewStyle } from 'react-native';

export interface TabIconProps {
  name: string;
  focused: boolean;
}

export interface TabBarStyle extends ViewStyle {
  display?: 'none' | 'flex';
}

export interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][0];
  isFocused: boolean;
  onPress: () => void;
  options: {
    tabBarLabel?: string;
    tabBarStyle?: TabBarStyle;
    [key: string]: any;
  };
}

export type CustomBottomTabProps = BottomTabBarProps; 