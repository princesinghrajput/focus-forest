import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, Card, IconButton, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useApp } from '../context/AppContext';
import { TreeType } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ForestScreen() {
  const { state } = useApp();
  const { sessions } = state;

  const groupTreesByDate = () => {
    const grouped: { [key: string]: typeof sessions } = {};
    sessions.forEach(session => {
      const date = new Date(session.startTime).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });
    return grouped;
  };

  const getTotalMinutesForDate = (trees: typeof sessions) => {
    return trees.reduce((acc, tree) => acc + tree.duration, 0);
  };

  const getTreeIcon = (treeType: string) => {
    switch (treeType) {
      case TreeType.CHERRY:
        return 'tree';
      case TreeType.PINE:
        return 'pine-tree';
      case TreeType.OAK:
        return 'tree';
      case TreeType.MAPLE:
        return 'tree';
      default:
        return 'pine-tree';
    }
  };

  const getTreeColor = (treeType: string) => {
    switch (treeType) {
      case TreeType.CHERRY:
        return '#C2185B';
      case TreeType.PINE:
        return '#1B5E20';
      case TreeType.OAK:
        return '#4CAF50';
      case TreeType.MAPLE:
        return '#FF5722';
      default:
        return '#2E7D32';
    }
  };

  const groupedTrees = groupTreesByDate();

  return (
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Surface style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Trees Planted</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
              </Text>
              <Text style={styles.statLabel}>Total Focus</Text>
            </View>
          </View>
        </Surface>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(groupedTrees).map(([date, trees]) => (
          <Card key={date} style={styles.dateGroup}>
            <Card.Title
              title={new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              right={(props) => (
                <Badge {...props} size={25} style={styles.minuteBadge}>
                  {getTotalMinutesForDate(trees)}m
                </Badge>
              )}
            />
            <Card.Content>
              <View style={styles.treeGrid}>
                {trees.map(tree => (
                  <View key={tree.id} style={styles.treeContainer}>
                    <Surface style={[styles.treeCard, { borderColor: getTreeColor(tree.treeType) }]}>
                      <MaterialCommunityIcons 
                        name={getTreeIcon(tree.treeType)}
                        size={40}
                        color={getTreeColor(tree.treeType)}
                      />
                      <Text style={styles.treeDuration}>{tree.duration}m</Text>
                      {tree.label && (
                        <Text style={styles.treeLabel} numberOfLines={1}>
                          {tree.label}
                        </Text>
                      )}
                    </Surface>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: wp('4%'),
    paddingTop: hp('2%'),
  },
  statsCard: {
    padding: wp('4%'),
    borderRadius: wp('4%'),
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginTop: hp('0.5%'),
  },
  statDivider: {
    width: 1,
    height: hp('4%'),
    backgroundColor: '#E0E0E0',
  },
  scrollView: {
    flex: 1,
    padding: wp('4%'),
  },
  dateGroup: {
    marginBottom: hp('2%'),
    elevation: 2,
  },
  minuteBadge: {
    backgroundColor: '#4CAF50',
    marginRight: wp('4%'),
  },
  treeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp('1%'),
  },
  treeContainer: {
    width: '33.33%',
    padding: wp('1%'),
  },
  treeCard: {
    padding: wp('2%'),
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  treeDuration: {
    fontSize: wp('3%'),
    color: '#666666',
    marginTop: hp('0.5%'),
  },
  treeLabel: {
    fontSize: wp('2.8%'),
    color: '#666666',
    marginTop: hp('0.5%'),
    textAlign: 'center',
  },
}); 