import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  interpolate 
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PlantedTree, TreeStage } from '../types';

interface IsometricForestProps {
  trees: PlantedTree[];
  gridSize?: number;
}

const TILE_SIZE = 60;
const TILE_HEIGHT = TILE_SIZE * 0.5;
const SCREEN_WIDTH = Dimensions.get('window').width;

const getIsometricPosition = (x: number, y: number) => {
  // Convert grid coordinates to isometric coordinates
  const isoX = (x - y) * (TILE_SIZE / 2);
  const isoY = (x + y) * (TILE_HEIGHT / 2);
  return { x: isoX, y: isoY };
};

const TreeTile: React.FC<{ tree: PlantedTree; position: { x: number; y: number } }> = ({ 
  tree, 
  position 
}) => {
  const treeStyle = useAnimatedStyle(() => {
    const scale = withSpring(tree.stage === TreeStage.SEED ? 0.6 : 1);
    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { scale },
      ],
    };
  });

  const getTreeIcon = () => {
    switch (tree.stage) {
      case TreeStage.SEED:
        return 'seed';
      case TreeStage.SAPLING:
        return 'sprout';
      case TreeStage.GROWING:
        return 'tree-outline';
      case TreeStage.MATURE:
        return 'tree';
      default:
        return 'tree-outline';
    }
  };

  const getTreeColor = () => {
    switch (tree.stage) {
      case TreeStage.SEED:
        return '#795548';
      case TreeStage.SAPLING:
        return '#81C784';
      case TreeStage.GROWING:
        return '#4CAF50';
      case TreeStage.MATURE:
        return '#2E7D32';
      default:
        return '#A5D6A7';
    }
  };

  return (
    <Animated.View style={[styles.treeTile, treeStyle]}>
      <MaterialCommunityIcons
        name={getTreeIcon()}
        size={TILE_SIZE * 0.8}
        color={getTreeColor()}
      />
    </Animated.View>
  );
};

const IsometricForest: React.FC<IsometricForestProps> = ({ 
  trees, 
  gridSize = 5 
}) => {
  const centerOffset = {
    x: SCREEN_WIDTH / 2 - TILE_SIZE / 2,
    y: TILE_HEIGHT * 2,
  };

  return (
    <View style={styles.container}>
      {trees.map((tree) => {
        const { x, y } = getIsometricPosition(tree.position.x, tree.position.y);
        return (
          <TreeTile
            key={tree.id}
            tree={tree}
            position={{
              x: x + centerOffset.x,
              y: y + centerOffset.y,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: TILE_SIZE * 8,
    width: '100%',
  },
  treeTile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IsometricForest; 