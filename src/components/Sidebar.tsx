import React from 'react';
import { View, StyleSheet, ScrollView, Animated, TouchableOpacity, Platform } from 'react-native';
import { Drawer, Text, IconButton, Surface, Avatar, useTheme, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useApp } from '../context/AppContext';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { DefaultAvatar } from './DefaultAvatar';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

export default function Sidebar({ visible, onClose, navigation }: SidebarProps) {
  const { state } = useApp();
  const { userProfile } = state;
  const theme = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-wp('80%'))).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { user, signOut } = useAuth();

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 90,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -wp('80%'),
          useNativeDriver: true,
          damping: 20,
          stiffness: 90,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const menuItems = [
    { 
      icon: 'timer', 
      label: 'Focus Timer', 
      route: 'Home', 
      color: theme.colors.primary,
      description: 'Start your focus session'
    },
    { 
      icon: 'tree', 
      label: 'My Forest', 
      route: 'Forest', 
      color: '#4CAF50',
      description: 'View your growing forest'
    },
    { 
      icon: 'cellphone-lock', 
      label: 'App Restrictions', 
      route: 'AppRestrictions', 
      color: '#F44336',
      description: 'Manage restricted apps'
    },
    { 
      icon: 'chart-bar', 
      label: 'Statistics', 
      route: 'Stats', 
      color: '#2196F3',
      description: 'Track your progress'
    },
    { 
      icon: 'store', 
      label: 'Tree Shop', 
      route: 'TreeShop', 
      color: '#FF9800',
      description: 'Get new tree varieties'
    },
    { 
      icon: 'cog', 
      label: 'Settings', 
      route: 'Settings', 
      color: '#607D8B',
      description: 'Customize your experience'
    },
  ];

  const navigateToScreen = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(route);
    onClose();
  };

  const navigateToAuth = (isLogin: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Auth', { isLogin });
    onClose();
  };

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
    onClose();
  };

  if (!visible) return null;

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    backdrop: {
      flex: 1,
    },
    container: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: wp('80%'),
      elevation: 8,
      zIndex: 1001,
    },
    content: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderTopRightRadius: wp('5%'),
      borderBottomRightRadius: wp('5%'),
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: wp('2%'),
      position: 'absolute',
      right: 0,
      zIndex: 2,
    },
    closeButton: {
      margin: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    profileSection: {
      paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('3%'),
      paddingHorizontal: wp('4%'),
      paddingBottom: hp('2%'),
    },
    profileGradient: {
      borderRadius: wp('4%'),
      padding: wp('4%'),
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp('2%'),
    },
    userAvatar: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    userDetails: {
      marginLeft: wp('3%'),
      flex: 1,
    },
    userName: {
      fontSize: wp('5%'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: hp('0.5%'),
    },
    levelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingHorizontal: wp('2%'),
      paddingVertical: hp('0.5%'),
      borderRadius: wp('4%'),
      alignSelf: 'flex-start',
    },
    levelText: {
      color: '#FFFFFF',
      marginLeft: wp('1%'),
      fontSize: wp('3.5%'),
      fontWeight: '600',
    },
    statsContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: wp('3%'),
      padding: wp('3%'),
      marginTop: hp('1%'),
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: wp('4.5%'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: hp('0.5%'),
    },
    statLabel: {
      fontSize: wp('3%'),
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: hp('0.5%'),
    },
    statDivider: {
      width: StyleSheet.hairlineWidth,
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginHorizontal: wp('2%'),
    },
    menuSection: {
      flex: 1,
      paddingTop: hp('2%'),
    },
    menuItem: {
      borderRadius: wp('2%'),
      marginHorizontal: wp('2%'),
      marginVertical: hp('0.5%'),
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp('3%'),
    },
    menuItemLabel: {
      marginLeft: wp('3%'),
      fontSize: wp('4%'),
      fontWeight: '500',
    },
    divider: {
      marginVertical: hp('1%'),
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    authSection: {
      padding: wp('4%'),
      backgroundColor: '#F5F5F5',
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: wp('4%'),
      borderRadius: wp('3%'),
      marginBottom: hp('2%'),
      elevation: 2,
    },
    userInfo: {
      marginLeft: wp('3%'),
      flex: 1,
    },
    userEmail: {
      color: '#666666',
      fontSize: wp('3.5%'),
    },
    authButtons: {
      gap: hp('1%'),
    },
    signInButton: {
      marginBottom: hp('1%'),
    },
    signUpButton: {
      borderColor: theme.colors.primary,
      backgroundColor: 'transparent',
    },
    authText: {
      textAlign: 'center',
      color: '#666666',
      marginVertical: hp('1%'),
    },
    version: {
      fontSize: wp('3%'),
      color: '#666666',
      textAlign: 'center',
      marginTop: hp('1%'),
    },
    menuItemGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp('4%'),
      borderRadius: wp('3%'),
    },
    menuItemContent: {
      flex: 1,
      marginLeft: wp('3%'),
    },
    menuItemDescription: {
      fontSize: wp('3%'),
      color: '#666666',
      marginTop: hp('0.5%'),
    },
    premiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      paddingHorizontal: wp('2%'),
      paddingVertical: hp('0.5%'),
      borderRadius: wp('2%'),
      alignSelf: 'flex-start',
      marginTop: hp('0.5%'),
    },
    premiumText: {
      fontSize: wp('3%'),
      color: '#FFD700',
      marginLeft: wp('1%'),
      fontWeight: '600',
    },
    buttonContent: {
      height: hp('6%'),
    },
  });

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          StyleSheet.absoluteFill,
          { opacity: fadeAnim }
        ]}
      >
        <BlurView intensity={15} style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        </BlurView>
      </Animated.View>

      <Animated.View 
        style={[
          styles.container,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <Surface style={styles.content}>
          <View style={styles.header}>
            <IconButton
              icon="close"
              size={24}
              onPress={onClose}
              style={styles.closeButton}
              iconColor="#FFFFFF"
            />
          </View>

          <View style={styles.profileSection}>
            <LinearGradient
              colors={[theme.colors.primary, '#1B5E20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileGradient}
            >
              <View style={styles.profileHeader}>
                <DefaultAvatar
                  size={wp('15%')}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  color="#FFFFFF"
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{userProfile?.name || 'Forest Friend'}</Text>
                  <View style={styles.levelBadge}>
                    <MaterialCommunityIcons name="leaf" size={wp('4%')} color="#4CAF50" />
                    <Text style={styles.levelText}>Level {userProfile?.level || 1}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="tree" size={wp('6%')} color="#FFFFFF" />
                    <Text style={styles.statValue}>{userProfile?.trees?.planted || 0}</Text>
                    <Text style={styles.statLabel}>Trees</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="clock-outline" size={wp('6%')} color="#FFFFFF" />
                    <Text style={styles.statValue}>{userProfile?.totalFocusTime || 0}h</Text>
                    <Text style={styles.statLabel}>Focus Time</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="fire" size={wp('6%')} color="#FFFFFF" />
                    <Text style={styles.statValue}>{userProfile?.streak || 0}</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <ScrollView style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.route}
                style={styles.menuItem}
                onPress={() => navigateToScreen(item.route)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)']}
                  style={styles.menuItemGradient}
                >
                  <MaterialCommunityIcons 
                    name={item.icon as any}
                    size={wp('6%')}
                    color={item.color}
                  />
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name="chevron-right"
                    size={wp('6%')}
                    color="rgba(0,0,0,0.3)"
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.authSection}>
            {user ? (
              <>
                <Surface style={styles.userCard}>
                  <Avatar.Icon 
                    size={wp('12%')}
                    icon="account"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.premiumBadge}>
                      <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  </View>
                </Surface>
                <Button
                  mode="outlined"
                  onPress={handleSignOut}
                  icon="logout"
                  style={styles.signOutButton}
                  contentStyle={styles.buttonContent}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <View style={styles.authButtons}>
                <Button
                  mode="contained"
                  onPress={() => navigateToAuth(true)}
                  icon="login"
                  style={styles.signInButton}
                  contentStyle={styles.buttonContent}
                >
                  Sign In
                </Button>
                <Text style={styles.authText}>or</Text>
                <Button
                  mode="outlined"
                  onPress={() => navigateToAuth(false)}
                  icon="account-plus"
                  style={styles.signUpButton}
                  contentStyle={styles.buttonContent}
                >
                  Create Account
                </Button>
              </View>
            )}
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </Surface>
      </Animated.View>
    </View>
  );
} 