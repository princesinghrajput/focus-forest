import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LEVEL_CONFIG } from '../context/AppContext';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface LevelProgressProps {
  level: number;
  experience: number;
}

export default function LevelProgress({ level, experience }: LevelProgressProps) {
  const levelInfo = LEVEL_CONFIG.getLevelInfo(experience);
  const progress = levelInfo.currentXP / levelInfo.requiredXP;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <Surface style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.levelBadge}>
          <MaterialCommunityIcons name="star" size={wp('6%')} color="#FFD700" />
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color="#4CAF50"
            style={styles.progressBar}
          />
          <Text style={styles.xpText}>
            {levelInfo.currentXP} / {levelInfo.requiredXP} XP
          </Text>
        </View>

        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsText}>
            Next Level: +{levelInfo.rewards.coins} coins
          </Text>
          {levelInfo.rewards.trees.length > level && (
            <View style={styles.newTreeAlert}>
              <MaterialCommunityIcons name="tree" size={wp('4%')} color="#4CAF50" />
              <Text style={styles.newTreeText}>New Tree Unlocking Soon!</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: wp('4%'),
    borderRadius: wp('3%'),
    elevation: 4,
  },
  content: {
    padding: wp('4%'),
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  levelText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  progressContainer: {
    marginVertical: hp('1%'),
  },
  progressBar: {
    height: hp('1.5%'),
    borderRadius: hp('0.75%'),
  },
  xpText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('0.5%'),
  },
  rewardsContainer: {
    marginTop: hp('1%'),
  },
  rewardsText: {
    fontSize: wp('3.5%'),
    color: '#4CAF50',
  },
  newTreeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  newTreeText: {
    fontSize: wp('3.5%'),
    color: '#4CAF50',
    marginLeft: wp('1%'),
  },
}); 