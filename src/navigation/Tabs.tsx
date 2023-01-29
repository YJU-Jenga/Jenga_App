import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BottomTabNavigatorParamList } from '../types';
import HomeStackNavigator from './HomeStack';
import FeedScreen from '../screens/FeedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookScreen from '../screens/BookScreen';
import MusicScreen from '../screens/MusicScreen';
import LogsScreen from '../screens/LogsScreen';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="홈"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="책과음악" component={BookScreen} />
      <Tab.Screen name="활동" component={LogsScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;