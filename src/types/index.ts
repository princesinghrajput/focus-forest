// Tree types and growth stages
export enum TreeType {
  BASIC = 'BASIC',
  CHERRY = 'CHERRY',
  PINE = 'PINE',
  OAK = 'OAK',
  MAPLE = 'MAPLE',
  MAGIC = 'MAGIC',
}

export enum TreeStage {
  SEED = 'SEED',
  SAPLING = 'SAPLING',
  GROWING = 'GROWING',
  MATURE = 'MATURE',
}

// Focus session types
export interface FocusSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  treeType: TreeType;
  completed: boolean;
  label?: string;
}

// User profile and stats
export interface UserStats {
  totalMinutes: number;
  treesPlanted: number;
  averageSession: number;
  weeklyData: number[];
}

// Settings
export interface UserSettings {
  notifications: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  vibration: boolean;
}

// Level information
export interface LevelInfo {
  level: number;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  rewards: {
    coins: number;
    trees: TreeType[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  level: number;
  experience: number;
  coins: number;
  trees: {
    planted: number;
    alive: number;
    dead: number;
    unlockedTypes: TreeType[];
  };
  streak: number;
  lastActiveDate: string;
  achievements: Achievement[];
  dailyGoal: number;
}

// Forest data
export interface Forest {
  id: string;
  userId: string;
  trees: PlantedTree[];
  lastPlanted: Date;
}

// Planted tree data
export interface PlantedTree {
  id: string;
  type: TreeType;
  plantedAt: Date;
  completedAt?: Date;
  stage: TreeStage;
  position: { x: number; y: number };
  earnedCoins: number;
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: number;
}

// Store items
export interface StoreItem {
  id: string;
  type: TreeType;
  name: string;
  description: string;
  price: number;
  unlockLevel: number;
  isUnlocked: boolean;
  animation: any; // For Lottie animation source
  bonusXP: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
  seasonalBonus?: string;
  specialPower?: string;
}

export interface AppState {
  sessions: FocusSession[];
  stats: UserStats;
  settings: UserSettings;
  userProfile: UserProfile;
  restrictedApps: string[];
} 