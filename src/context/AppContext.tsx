import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, TreeType, UserProfile, LevelInfo } from '../types';

// Level progression configuration
export const LEVEL_CONFIG = {
  BASE_XP: 100,
  XP_MULTIPLIER: 1.5,
  MAX_LEVEL: 50,
  getRequiredXP: (level: number) => Math.floor(100 * Math.pow(1.5, level - 1)),
  getLevelInfo: (totalXP: number): LevelInfo => {
    let level = 1;
    let requiredXP = 100;
    let accumulatedXP = 0;

    while (totalXP >= accumulatedXP + requiredXP && level < 50) {
      accumulatedXP += requiredXP;
      level++;
      requiredXP = Math.floor(100 * Math.pow(1.5, level - 1));
    }

    return {
      level,
      currentXP: totalXP - accumulatedXP,
      requiredXP,
      totalXP,
      rewards: {
        coins: level * 50,
        trees: getLevelTreeRewards(level),
      },
    };
  },
};

// Tree unlocking based on levels
function getLevelTreeRewards(level: number): TreeType[] {
  const rewards: TreeType[] = [];
  if (level >= 1) rewards.push(TreeType.BASIC);
  if (level >= 5) rewards.push(TreeType.CHERRY);
  if (level >= 10) rewards.push(TreeType.PINE);
  if (level >= 15) rewards.push(TreeType.OAK);
  if (level >= 20) rewards.push(TreeType.MAPLE);
  return rewards;
}

export const initialState: AppState = {
  sessions: [],
  stats: {
    totalMinutes: 0,
    treesPlanted: 0,
    averageSession: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
  },
  settings: {
    notifications: true,
    soundEnabled: true,
    darkMode: false,
    vibration: true,
  },
  userProfile: {
    id: '1',
    name: 'User',
    level: 1,
    experience: 0,
    coins: 0,
    trees: {
      planted: 0,
      alive: 0,
      dead: 0,
      unlockedTypes: [TreeType.BASIC],
    },
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    achievements: [],
    dailyGoal: 25,
  },
  restrictedApps: [],
};

type Action =
  | { type: 'ADD_SESSION'; payload: FocusSession }
  | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_EXPERIENCE'; payload: number }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'UPDATE_RESTRICTED_APPS'; payload: string[] };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };

    case 'ADD_EXPERIENCE': {
      const currentXP = state.userProfile.experience + action.payload;
      const levelInfo = LEVEL_CONFIG.getLevelInfo(currentXP);
      
      // Check if level up occurred
      const levelUp = levelInfo.level > state.userProfile.level;
      
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          level: levelInfo.level,
          experience: currentXP,
          coins: levelUp ? state.userProfile.coins + levelInfo.rewards.coins : state.userProfile.coins,
          trees: {
            ...state.userProfile.trees,
            unlockedTypes: levelInfo.rewards.trees,
          },
        },
      };
    }

    case 'LOAD_STATE':
      return action.payload;

    case 'UPDATE_RESTRICTED_APPS':
      return {
        ...state,
        restrictedApps: action.payload,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async (state: AppState) => {
    try {
      await AsyncStorage.setItem('appState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext); 