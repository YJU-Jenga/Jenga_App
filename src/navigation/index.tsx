import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import BottomTabs from './Tabs';

// Screens
import LoginScreen from '../screens/LoginScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookScreen from '../screens/BookScreen';
import RecordScreen from '../screens/RecordScreen';
import LogsScreen from '../screens/LogsScreen';
import SignUpScreen from '../screens/SignUpScreen';
import InfoScreen from '../screens/InfoScreen';

import {BottomTabNavigatorParamList} from '../types';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="Record"
        options={{headerShown: false}}
        component={RecordScreen}
      />
      <Stack.Screen
        name="login"
        options={{headerShown: false}}
        component={LoginScreen}
      />
      <Stack.Screen
        name="signUp"
        options={{headerShown: false}}
        component={SignUpScreen}
      />
    </Stack.Navigator>
  );
};

const SettingsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="setting"
        options={{headerShown: false}}
        component={SettingsScreen}
      />
      <Stack.Screen
        name="info"
        options={{headerShown: true, title: ''}}
        component={InfoScreen}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="녹음"
        screenOptions={{
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'black',
        }}>
        <Tab.Screen
          name="책과음악"
          component={BookScreen}
          options={{headerShown: false}}
        />
        {/* <Tab.Screen name="스케쥴" component={HomeStackNavigator} /> */}
        <Tab.Screen
          name="스케쥴"
          component={ScheduleScreen}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="녹음"
          component={MainNavigator}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="활동"
          component={LogsScreen}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="설정"
          component={SettingsNavigator}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
