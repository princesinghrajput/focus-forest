import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3LightTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import AppSplashScreen from './src/screens/SplashScreen';
import { RootStackParamList, NavigationProps } from './src/types/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import AppRestrictionsScreen from './src/screens/AppRestrictionsScreen';
import Sidebar from './src/components/Sidebar';
import HomeScreen from './src/screens/HomeScreen';
import ForestScreen from './src/screens/ForestScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TreeShopScreen from './src/screens/TreeShopScreen';
import AuthScreen from './src/screens/AuthScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

// Custom theme with forest-inspired colors
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',
    secondary: '#81C784',
    background: '#F1F8E9',
    surface: '#FFFFFF',
    accent: '#795548',
    text: '#263238',
  },
};

// Icon name type for MaterialCommunityIcons
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Type-safe icon mapping
const iconMap: Record<string, IconName> = {
  Home: 'timer',
  HomeOutline: 'timer-outline',
  Forest: 'tree',
  ForestOutline: 'tree-outline',
  Stats: 'chart-bar',
  StatsOutline: 'chart-box-outline',
  Settings: 'cog',
  SettingsOutline: 'cog-outline',
};

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MainContent() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused
              ? iconMap[route.name]
              : iconMap[`${route.name}Outline`];

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <IconButton
              icon={() => <MaterialCommunityIcons name="menu" size={24} color="#FFFFFF" />}
              onPress={() => setIsSidebarVisible(true)}
            />
          ),
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Focus Timer'
          }}
        />
        <Tab.Screen 
          name="Forest" 
          component={ForestScreen}
          options={{
            title: 'My Forest'
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            title: 'Statistics'
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings'
          }}
        />
        <Tab.Screen 
          name="AppRestrictions" 
          component={AppRestrictionsScreen}
          options={{
            title: 'App Restrictions',
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name="cellphone-lock"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="TreeShop" 
          component={TreeShopScreen}
          options={{
            title: 'Tree Shop',
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? 'store' : 'store-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{
            title: 'Authentication',
            tabBarButton: () => null, // This hides the tab bar button
            headerShown: false, // This hides the header for the Auth screen
          }}
        />
      </Tab.Navigator>
      <Sidebar
        visible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        navigation={navigation}
      />
    </>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    }
  }, [isReady]);

  if (!isReady || showSplash) {
    return <AppSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <AppProvider>
          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              <NavigationContainer>
                <MainContent />
              </NavigationContainer>
            </PaperProvider>
          </SafeAreaProvider>
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
