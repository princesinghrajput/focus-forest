import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import { TreeType } from '../types';
import Animated, { useAnimatedProps, withRepeat, withTiming, useSharedValue, withSequence } from 'react-native-reanimated';

interface TreeIconProps {
  type: TreeType;
  size?: number;
  color?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const TreeIcon = ({ type, size = 40, color = '#2E7D32' }: TreeIconProps) => {
  const scaleValue = useSharedValue(1);

  const animatedProps = useAnimatedProps(() => ({
    r: 4 * scaleValue.value,
  }));

  const icons = {
    [TreeType.BASIC]: (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient id="treeGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#43A047" stopOpacity="1" />
            <Stop offset="1" stopColor="#2E7D32" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="trunkGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#795548" stopOpacity="1" />
            <Stop offset="1" stopColor="#5D4037" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d="M12 2L3 12h4v8h10v-8h4L12 2z"
          fill="url(#treeGradient)"
        />
        <Path
          d="M11 12h2v8h-2z"
          fill="url(#trunkGradient)"
        />
      </Svg>
    ),
    [TreeType.CHERRY]: (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <RadialGradient id="cherryBlossomGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFCDD2" stopOpacity="1" />
            <Stop offset="1" stopColor="#F06292" stopOpacity="1" />
          </RadialGradient>
          <LinearGradient id="cherryTrunkGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#795548" stopOpacity="1" />
            <Stop offset="1" stopColor="#4E342E" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d="M12 2L3 12h4v8h10v-8h4L12 2z"
          fill="url(#cherryBlossomGradient)"
        />
        <Circle cx="8" cy="8" r="2" fill="#FF80AB" />
        <Circle cx="16" cy="8" r="2" fill="#FF80AB" />
        <Circle cx="12" cy="6" r="1.5" fill="#FF80AB" />
        <Path
          d="M11 12h2v8h-2z"
          fill="url(#cherryTrunkGradient)"
        />
      </Svg>
    ),
    [TreeType.PINE]: (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient id="pineGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2E7D32" stopOpacity="1" />
            <Stop offset="1" stopColor="#1B5E20" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d="M12 2L7 8l2 .5L6 12l2 .5L4 17h16l-4-4.5 2-.5-3-3.5 2-.5L12 2z"
          fill="url(#pineGradient)"
        />
        <Path
          d="M11 17h2v5h-2z"
          fill="#5D4037"
        />
      </Svg>
    ),
    [TreeType.MAPLE]: (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient id="mapleGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF5722" stopOpacity="1" />
            <Stop offset="1" stopColor="#D84315" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <G>
          <Path
            d="M12 2L8 7l4 1-3 4 4 1-3 4h8l-3-4 4-1-3-4 4-1-4-5z"
            fill="url(#mapleGradient)"
          />
          <Path
            d="M11 17h2v5h-2z"
            fill="#5D4037"
          />
        </G>
      </Svg>
    ),
    [TreeType.MAGIC]: (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <RadialGradient id="magicGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#E1BEE7" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#9C27B0" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="sparkle" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFC107" stopOpacity="1" />
            <Stop offset="1" stopColor="#FFD700" stopOpacity="0.6" />
          </RadialGradient>
        </Defs>
        <G>
          <Path
            d="M12 2L3 12h4v8h10v-8h4L12 2z"
            fill="url(#magicGlow)"
          />
          <AnimatedCircle
            cx="12"
            cy="10"
            animatedProps={animatedProps}
            fill="url(#sparkle)"
          />
          <Path
            d="M12 6l1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2-2-1 2-1-1-2 2 1 1-2z"
            fill="#FFC107"
            fillOpacity={0.8}
          />
        </G>
      </Svg>
    ),
  };

  return icons[type] || icons[TreeType.BASIC];
}; 