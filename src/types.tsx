import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs/lib/typescript/src/types';

export type DetailsScreenRouteProp = RouteProp<
  HomeStackNavigatorParamList,
  'Details'
>;

export type BottomTabNavigatorParamList = {
    HomeStack: HomeStackNavigatorParamList;
    Feed: undefined;
    Settings: undefined;
  };

export type HomeStackNavigatorParamList = {
    Home: undefined;
    Details: {
      name: string;
      birthYear: string;
    };
  };


import type { CompositeNavigationProp, RouteProp, } from '@react-navigation/native';
  // rest of the import statements remains same
  
  export type HomeScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackNavigatorParamList, 'Details'>,
    BottomTabNavigationProp<BottomTabNavigatorParamList, 'Feed'>
  >;
  
  // rest of the code remains the same