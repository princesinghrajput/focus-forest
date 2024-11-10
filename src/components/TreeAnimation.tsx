import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Circle, Group, Paint, Path, Skia } from '@shopify/react-native-skia';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSharedValue, withSpring } from 'react-native-reanimated';

interface TreeAnimationProps {
  progress: number;
  color: string;
}

export default function TreeAnimation({ progress, color }: TreeAnimationProps) {
  const size = wp('30%');
  const center = size / 2;

  const treePath = Skia.Path.Make();
  treePath.moveTo(center, size);
  treePath.lineTo(center, center);
  
  // Create branches based on progress
  const numBranches = Math.floor(progress * 6);
  for (let i = 0; i < numBranches; i++) {
    const angle = (Math.PI / 6) * i;
    const length = size * 0.3 * progress;
    treePath.moveTo(center, center - size * 0.2 * i);
    treePath.lineTo(
      center + Math.cos(angle) * length,
      center - Math.sin(angle) * length - size * 0.2 * i
    );
  }

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress);
  }, [progress]);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group>
        <Path
          path={treePath}
          style="stroke"
          strokeWidth={4}
          color={color}
        >
          <Paint style="stroke" strokeWidth={4} />
        </Path>
      </Group>
    </Canvas>
  );
} 