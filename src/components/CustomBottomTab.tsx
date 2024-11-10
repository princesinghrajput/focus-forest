import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TabBarIconProps {
  route: string;
  focused: boolean;
  color: string;
}

const TabBarIcon = ({ route, focused, color }: TabBarIconProps) => {
  const iconMap: { [key: string]: string } = {
    Home: 'home',
    Shop: 'store',
    Stats: 'chart-bar',
    Settings: 'cog',
  };

  return (
    <MaterialCommunityIcons
      name={iconMap[route] || 'help'}
      size={focused ? wp('6.5%') : wp('6%')}
      color={color}
    />
  );
};

export function CustomBottomTab({ state, descriptors, navigation }: any) {
  return (
    <BlurView intensity={30} style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [
                {
                  scale: withSpring(isFocused ? 1.1 : 1, {
                    damping: 15,
                    stiffness: 200,
                  }),
                },
              ],
            };
          });

          return (
            <AnimatedTouchable
              key={route.key}
              style={[styles.tabItem, animatedStyle]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <TabBarIcon
                  route={route.name}
                  focused={isFocused}
                  color={isFocused ? '#4CAF50' : '#757575'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#4CAF50' : '#757575' },
                  ]}
                >
                  {label}
                </Text>
                {isFocused && <View style={styles.activeIndicator} />}
              </View>
            </AnimatedTouchable>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? hp('3%') : hp('1%'),
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: hp('1.5%'),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: hp('-1.5%'),
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('0.75%'),
    backgroundColor: '#4CAF50',
  },
}); 