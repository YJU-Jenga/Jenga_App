import * as React from 'react';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '../../hooks';
import {getUserInfo} from '../utils/redux/userSlice';

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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Alert} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const MainNavigator = ({route}) => {
  // Alert.alert(ref.current?.getCurrentRoute());

  console.log(
    'navigation/index/MainNavigator : Redux로 로그인 체크 ===> initialRouteName를 무엇으로 할 지..',
  );
  const name = 'record';
  return (
    <Stack.Navigator initialRouteName={name}>
      <Stack.Screen
        name="record"
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
  const dispatch = useAppDispatch();
  const ui = dispatch(getUserInfo('din'));

  console.log(useAppSelector(getUserInfo));

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="녹음"
        screenOptions={({route}) => ({
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'black',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({focused, color, size}) => {
            // let iconName;
            // if (route.name === '메인') {
            //   iconName = focused ? 'beer' : 'beer-outline';
            // } else if (route.name === '통계') {
            //   iconName = focused ? 'podium' : 'podium-outline';
            // } else if (route.name === '설정') {
            //   iconName = focused ? 'settings' : 'settings-outline';
            // }

            return <Icon name="delete-sweep" size={25} color="#aaa" />;
          },
        })}>
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
          options={({route}) => ({
            headerShown: false,

            // tabBarStyle: {display: 'none'},
          })}
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
