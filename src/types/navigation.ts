import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Forest: undefined;
  Stats: undefined;
  Settings: undefined;
  AppRestrictions: undefined;
  TreeShop: undefined;
  Auth: { isLogin?: boolean } | undefined;
};

export type NavigationProps = NavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>; 