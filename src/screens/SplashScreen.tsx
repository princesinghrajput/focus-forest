import React, { useEffect } from 'react';
import { View, StyleSheet, Animated as RNAnimated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const treeScale = new RNAnimated.Value(0);
  const textOpacity = new RNAnimated.Value(0);

  useEffect(() => {
    RNAnimated.sequence([
      RNAnimated.spring(treeScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 10,
        friction: 2,
      }),
      RNAnimated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#4CAF50', '#2E7D32']}
      style={styles.container}
    >
      <RNAnimated.View style={[styles.iconContainer, { transform: [{ scale: treeScale }] }]}>
        <MaterialCommunityIcons name="tree" size={120} color="#FFFFFF" />
      </RNAnimated.View>
      <RNAnimated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={styles.title}>Forest Focus</Text>
        <Text style={styles.subtitle}>Stay focused, grow your forest</Text>
      </RNAnimated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
}); 