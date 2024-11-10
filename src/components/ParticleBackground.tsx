import React from 'react';
import { Canvas, Circle, Group, Paint, vec } from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import { useCallback, useEffect } from 'react';
import { useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const NUM_PARTICLES = 20;

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

export default function ParticleBackground() {
  const particles = useSharedValue<Particle[]>(
    Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }))
  );

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 10000 }),
      -1,
      true
    );
  }, []);

  const animatedParticles = useDerivedValue(() => {
    return particles.value.map(particle => ({
      ...particle,
      y: (particle.y + particle.speed) % SCREEN_HEIGHT,
      opacity: 0.3 + Math.sin(progress.value * Math.PI) * 0.2,
    }));
  }, [progress]);

  return (
    <Canvas style={{ position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      <Group>
        {animatedParticles.value.map((particle, index) => (
          <Circle
            key={index}
            cx={particle.x}
            cy={particle.y}
            r={particle.radius}
            color={`rgba(255, 255, 255, ${particle.opacity})`}
          >
            <Paint style="fill" />
          </Circle>
        ))}
      </Group>
    </Canvas>
  );
} 