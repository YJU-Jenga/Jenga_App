import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

export type DetailsScreenRouteProp = RouteProp<
  HomeStackNavigatorParamList,
  'Login'
>;

export type BottomTabNavigatorParamList = {
  스케쥴: HomeStackNavigatorParamList;
  책과음악: undefined;
  녹음: undefined;
  활동: undefined;
  설정: undefined;
};

export type HomeStackNavigatorParamList = {
  Home: any;
  // Details: {
  //   name: string;
  //   birthYear: string;
  // };
  Login: any;
};

import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
// rest of the import statements remains same

export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackNavigatorParamList, 'Login'>,
  BottomTabNavigationProp<BottomTabNavigatorParamList, '활동'>
>;

// rest of the code remains the same
