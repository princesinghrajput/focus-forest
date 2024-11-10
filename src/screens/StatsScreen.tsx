import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useApp } from '../context/AppContext';
import { LEVEL_CONFIG } from '../context/AppContext';

export default function StatsScreen() {
  const { state } = useApp();
  const { stats, userProfile } = state;
  const theme = useTheme();

  const levelInfo = LEVEL_CONFIG.getLevelInfo(userProfile.experience);
  const progressToNextLevel = levelInfo.currentXP / levelInfo.requiredXP;

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: stats.weeklyData
    }]
  };

  const monthlyProgress = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      data: [
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 20),
      ]
    }]
  };

  const achievements = [
    { title: 'Early Bird', progress: 7, total: 10, icon: 'weather-sunny' },
    { title: 'Night Owl', progress: 5, total: 10, icon: 'weather-night' },
    { title: 'Weekend Warrior', progress: 3, total: 5, icon: 'sword' },
    { title: 'Tree Master', progress: 15, total: 50, icon: 'tree' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Level {userProfile.level}</Text>
          <ProgressBar
            progress={progressToNextLevel}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.xpText}>
            {levelInfo.currentXP} / {levelInfo.requiredXP} XP
          </Text>
        </View>
      </Surface>

      <Surface style={styles.statsCard}>
        <View style={styles.statsRow}>
          <StatItem
            icon="clock-outline"
            value={stats.totalMinutes}
            label="Minutes Focused"
            color="#4CAF50"
          />
          <StatItem
            icon="tree"
            value={stats.treesPlanted}
            label="Trees Planted"
            color="#2196F3"
          />
          <StatItem
            icon="fire"
            value={userProfile.streak}
            label="Day Streak"
            color="#FF9800"
          />
        </View>
      </Surface>

      <Surface style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Activity</Text>
        <LineChart
          data={weeklyData}
          width={Dimensions.get('window').width - wp('8%')}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Surface>

      <Surface style={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly Progress</Text>
        <BarChart
          data={monthlyProgress}
          width={Dimensions.get('window').width - wp('8%')}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </Surface>

      <Surface style={styles.achievementsCard}>
        <Text style={styles.chartTitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <View key={index} style={styles.achievement}>
            <MaterialCommunityIcons
              name={achievement.icon}
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <ProgressBar
                progress={achievement.progress / achievement.total}
                color={theme.colors.primary}
                style={styles.achievementProgress}
              />
              <Text style={styles.achievementText}>
                {achievement.progress}/{achievement.total}
              </Text>
            </View>
          </View>
        ))}
      </Surface>
    </ScrollView>
  );
}

function StatItem({ icon, value, label, color }) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: wp('4%'),
    backgroundColor: '#FFFFFF',
    margin: wp('4%'),
    borderRadius: wp('2%'),
    elevation: 2,
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  levelInfo: {
    marginTop: hp('1%'),
  },
  levelText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  progressBar: {
    height: hp('1.5%'),
    borderRadius: hp('0.75%'),
  },
  xpText: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginTop: hp('0.5%'),
    textAlign: 'right',
  },
  statsCard: {
    margin: wp('4%'),
    padding: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginTop: hp('0.5%'),
  },
  statLabel: {
    fontSize: wp('3%'),
    color: '#666666',
    marginTop: hp('0.5%'),
  },
  chartCard: {
    margin: wp('4%'),
    padding: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  chartTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  chart: {
    borderRadius: wp('2%'),
  },
  achievementsCard: {
    margin: wp('4%'),
    padding: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  achievementInfo: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  achievementTitle: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
  achievementProgress: {
    marginTop: hp('0.5%'),
    height: hp('1%'),
    borderRadius: hp('0.5%'),
  },
  achievementText: {
    fontSize: wp('3%'),
    color: '#666666',
    marginTop: hp('0.5%'),
    textAlign: 'right',
  },
}); 