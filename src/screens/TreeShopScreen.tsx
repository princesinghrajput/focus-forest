import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Surface, Button, Badge, Portal, Modal, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useApp } from '../context/AppContext';
import { TreeType, StoreItem } from '../types';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { TreeIcon } from '../components/TreeIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Define static animation objects
const treeAnimations = {
  basic: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Basic Tree",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Tree",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        }
      }
    ]
  },
  cherry: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Cherry Tree",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Tree",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        }
      }
    ]
  },
  pine: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Pine Tree",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Tree",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        }
      }
    ]
  },
  maple: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Maple Tree",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Tree",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        }
      }
    ]
  },
  magic: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Magic Tree",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Tree",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        }
      }
    ]
  }
};

// Static unlock animation
const unlockSuccessAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Unlock Success",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Check Mark",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] }
      }
    }
  ]
};

const TREE_ITEMS: StoreItem[] = [
  {
    id: '1',
    type: TreeType.BASIC,
    name: 'Oak Sapling',
    description: 'A sturdy oak tree that grows tall and strong. Perfect for beginners.',
    price: 100,
    unlockLevel: 1,
    isUnlocked: true,
    animation: treeAnimations.basic,
    bonusXP: 1.0,
    rarity: 'Common',
  },
  {
    id: '2',
    type: TreeType.CHERRY,
    name: 'Cherry Blossom',
    description: 'Beautiful pink blossoms that provide extra coins during spring.',
    price: 250,
    unlockLevel: 5,
    isUnlocked: false,
    animation: treeAnimations.cherry,
    bonusXP: 1.2,
    rarity: 'Rare',
    seasonalBonus: 'Spring: +25% coins',
  },
  {
    id: '3',
    type: TreeType.PINE,
    name: 'Winter Pine',
    description: 'Evergreen pine that provides bonus XP during winter months.',
    price: 400,
    unlockLevel: 10,
    isUnlocked: false,
    animation: treeAnimations.pine,
    bonusXP: 1.5,
    rarity: 'Epic',
    seasonalBonus: 'Winter: +30% XP',
  },
  {
    id: '4',
    type: TreeType.MAPLE,
    name: 'Golden Maple',
    description: 'Majestic maple that changes colors with seasons. Rare find!',
    price: 600,
    unlockLevel: 15,
    isUnlocked: false,
    animation: treeAnimations.maple,
    bonusXP: 1.8,
    rarity: 'Legendary',
    seasonalBonus: 'Autumn: +40% coins & XP',
  },
  {
    id: '5',
    type: TreeType.MAGIC,
    name: 'Mystical Willow',
    description: 'Ancient magical tree that enhances focus powers. Very rare!',
    price: 1000,
    unlockLevel: 20,
    isUnlocked: false,
    animation: treeAnimations.magic,
    bonusXP: 2.0,
    rarity: 'Mythical',
    specialPower: 'Doubles focus time rewards',
  },
];

export default function TreeShopScreen() {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const { userProfile } = state;
  const [selectedTree, setSelectedTree] = useState<StoreItem | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseAnimation] = useState(new Animated.Value(0));
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const handlePurchase = (tree: StoreItem) => {
    if (userProfile.coins >= tree.price) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: {
          coins: userProfile.coins - tree.price,
          trees: {
            ...userProfile.trees,
            unlockedTypes: [...userProfile.trees.unlockedTypes, tree.type],
          },
        },
      });

      setShowUnlockAnimation(true);
      setTimeout(() => setShowUnlockAnimation(false), 3000);
    }
  };

  const getRarityColor = (rarity: StoreItem['rarity']) => {
    switch (rarity) {
      case 'Common': return '#808080';
      case 'Rare': return '#4CAF50';
      case 'Epic': return '#2196F3';
      case 'Legendary': return '#FFC107';
      case 'Mythical': return '#9C27B0';
      default: return '#808080';
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color="#FFD700" />
            <Text style={styles.statText}>{userProfile.coins}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.statText}>Level {userProfile.level}</Text>
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.scrollView}>
        {TREE_ITEMS.map((tree) => (
          <Surface key={tree.id} style={[styles.treeCard, 
            !tree.isUnlocked && userProfile.level < tree.unlockLevel && styles.lockedCard
          ]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.treeInfo}>
                <View style={styles.treeIconContainer}>
                  <TreeIcon type={tree.type} size={wp('15%')} />
                  <LottieView
                    source={tree.animation}
                    autoPlay
                    loop
                    style={[styles.lottieView, styles.animationOverlay]}
                  />
                </View>
                <View style={styles.treeDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.treeName}>{tree.name}</Text>
                    <Badge 
                      style={[styles.rarityBadge, { backgroundColor: getRarityColor(tree.rarity) }]}
                    >
                      {tree.rarity}
                    </Badge>
                  </View>
                  <Text style={styles.treeDescription}>{tree.description}</Text>
                  {tree.seasonalBonus && (
                    <View style={styles.bonusContainer}>
                      <MaterialCommunityIcons 
                        name="weather-sunny" 
                        size={16} 
                        color="#FF9800" 
                      />
                      <Text style={styles.bonusText}>{tree.seasonalBonus}</Text>
                    </View>
                  )}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons 
                        name="star" 
                        size={16} 
                        color="#FFC107" 
                      />
                      <Text style={styles.xpBonus}>+{(tree.bonusXP - 1) * 100}% XP</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons 
                        name="cash-multiple" 
                        size={16} 
                        color="#FFD700" 
                      />
                      <Text style={styles.priceText}>{tree.price}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {userProfile.level >= tree.unlockLevel ? (
                <Button
                  mode="contained"
                  style={[
                    styles.purchaseButton,
                    userProfile.coins < tree.price && styles.disabledButton
                  ]}
                  disabled={userProfile.coins < tree.price}
                  onPress={() => handlePurchase(tree)}
                  icon={userProfile.trees.unlockedTypes.includes(tree.type) ? 'check' : 'shopping'}
                >
                  {userProfile.trees.unlockedTypes.includes(tree.type)
                    ? 'Owned'
                    : `Purchase - ${tree.price} coins`}
                </Button>
              ) : (
                <View style={styles.lockContainer}>
                  <MaterialCommunityIcons name="lock" size={20} color="#9E9E9E" />
                  <Text style={styles.lockText}>
                    Unlocks at Level {tree.unlockLevel}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Surface>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={showUnlockAnimation}
          onDismiss={() => setShowUnlockAnimation(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <LottieView
            source={unlockSuccessAnimation}
            autoPlay
            loop={false}
            style={styles.unlockAnimation}
          />
          <Text style={styles.unlockText}>Tree Unlocked!</Text>
        </Modal>
      </Portal>
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
    elevation: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('4%'),
    padding: wp('4%'),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: wp('2%'),
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  scrollView: {
    padding: wp('4%'),
  },
  treeCard: {
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
    elevation: 2,
  },
  lockedCard: {
    opacity: 0.7,
  },
  treeInfo: {
    flexDirection: 'row',
  },
  treeAnimation: {
    width: wp('25%'),
    height: wp('25%'),
    marginRight: wp('4%'),
  },
  lottieView: {
    width: '100%',
    height: '100%',
  },
  treeDetails: {
    flex: 1,
  },
  treeName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    marginTop: hp('1%'),
  },
  treeDescription: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginTop: hp('1%'),
  },
  bonusText: {
    fontSize: wp('3.5%'),
    color: '#2196F3',
    marginTop: hp('0.5%'),
  },
  xpBonus: {
    fontSize: wp('3.5%'),
    color: '#4CAF50',
    marginTop: hp('0.5%'),
  },
  purchaseButton: {
    marginTop: hp('2%'),
  },
  disabledButton: {
    opacity: 0.5,
  },
  lockBadge: {
    alignSelf: 'center',
    marginTop: hp('2%'),
    backgroundColor: '#9E9E9E',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: wp('8%'),
    margin: wp('8%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
  },
  unlockAnimation: {
    width: wp('50%'),
    height: wp('50%'),
  },
  unlockText: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: hp('2%'),
  },
  lockText: {
    fontSize: wp('3.5%'),
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  cardGradient: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
  },
  treeIconContainer: {
    width: wp('25%'),
    height: wp('25%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
  },
  animationOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  priceText: {
    fontSize: wp('3.5%'),
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: wp('1%'),
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
}); 