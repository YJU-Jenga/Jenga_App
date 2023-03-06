import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {BottomTabNavigatorParamList} from '../types';
import HomeStackNavigator from './HomeStack';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ListenScreen from '../screens/ListenScreen';
import MusicScreen from '../screens/MusicScreen';
import RecordScreen from '../screens/RecordScreen';
import LogsScreen from '../screens/LogsScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="책과음악" component={ListenScreen} />
      {/* <Tab.Screen name="스케쥴" component={HomeStackNavigator} /> */}
      <Tab.Screen name="스케쥴" component={ScheduleScreen} />
      <Tab.Screen
        name="녹음"
        component={RecordScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name="활동" component={LogsScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
