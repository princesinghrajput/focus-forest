import { useEffect } from 'react';
import { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export const useTabAnimation = (isFocused: boolean) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: withSpring(isFocused ? 1.1 : 1, {
        damping: 15,
        stiffness: 150,
      }),
    }],
  }));

  return { animatedStyle };
}; 