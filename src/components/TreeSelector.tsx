import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TreeType } from '../types';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface TreeOption {
  type: TreeType;
  name: string;
  icon: string;
  color: string;
  requiredLevel: number;
  price: number;
  description: string;
}

const TREES: TreeOption[] = [
  {
    type: TreeType.BASIC,
    name: 'Oak Tree',
    icon: 'tree',
    color: '#2E7D32',
    requiredLevel: 1,
    price: 0,
    description: 'A sturdy oak tree, perfect for beginners',
  },
  {
    type: TreeType.CHERRY,
    name: 'Cherry Blossom',
    icon: 'tree',
    color: '#C2185B',
    requiredLevel: 3,
    price: 100,
    description: 'Beautiful pink blossoms that bring peace',
  },
  {
    type: TreeType.PINE,
    name: 'Pine Tree',
    icon: 'pine-tree',
    color: '#1B5E20',
    requiredLevel: 5,
    price: 200,
    description: 'Evergreen pine that stands tall',
  },
  {
    type: TreeType.MAPLE,
    name: 'Maple Tree',
    icon: 'tree',
    color: '#D84315',
    requiredLevel: 7,
    price: 300,
    description: 'Vibrant maple with colorful leaves',
  },
];

interface TreeSelectorProps {
  selectedTree: TreeType;
  onSelectTree: (tree: TreeType) => void;
  userLevel: number;
  coins: number;
  disabled?: boolean;
}

export default function TreeSelector({
  selectedTree,
  onSelectTree,
  userLevel,
  coins,
  disabled = false,
}: TreeSelectorProps) {
  const isTreeUnlocked = (tree: TreeOption) => {
    return userLevel >= tree.requiredLevel && coins >= tree.price;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(disabled ? 0.95 : 1) }],
    opacity: withSpring(disabled ? 0.7 : 1),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>Select Your Tree</Text>
      <View style={styles.treeGrid}>
        {TREES.map((tree) => {
          const isUnlocked = isTreeUnlocked(tree);
          const isSelected = selectedTree === tree.type;

          return (
            <TouchableOpacity
              key={tree.type}
              style={[
                styles.treeCard,
                isSelected && styles.treeCardSelected,
                !isUnlocked && styles.treeCardLocked,
              ]}
              onPress={() => isUnlocked && !disabled && onSelectTree(tree.type)}
              disabled={!isUnlocked || disabled}
            >
              <MaterialCommunityIcons
                name={tree.icon as any}
                size={wp('10%')}
                color={isUnlocked ? tree.color : '#9E9E9E'}
              />
              <Text style={[
                styles.treeName,
                !isUnlocked && styles.treeNameLocked
              ]}>
                {tree.name}
              </Text>
              {!isUnlocked && (
                <View style={styles.lockInfo}>
                  <MaterialCommunityIcons
                    name="lock"
                    size={wp('4%')}
                    color="#9E9E9E"
                  />
                  <Text style={styles.lockText}>
                    {userLevel < tree.requiredLevel 
                      ? `Level ${tree.requiredLevel}`
                      : `${tree.price} coins`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp('4%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  treeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: wp('3%'),
  },
  treeCard: {
    width: wp('28%'),
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: wp('4%'),
    padding: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  treeCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  treeName: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  treeNameLocked: {
    color: '#9E9E9E',
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    gap: wp('1%'),
  },
  lockText: {
    fontSize: wp('3%'),
    color: '#9E9E9E',
  },
}); 