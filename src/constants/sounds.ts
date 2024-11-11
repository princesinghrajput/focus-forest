export const SOUND_FILES = {
  rain: require('../assets/sounds/rain.mp3'),
  forest: require('../assets/sounds/forest.mp3'),
  cafe: require('../assets/sounds/cafe.mp3'),
  fire: require('../assets/sounds/fire.mp3'),
} as const;

export type SoundId = keyof typeof SOUND_FILES; 