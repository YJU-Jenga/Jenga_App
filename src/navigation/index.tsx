import * as React from 'react';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '../../hooks';
import {useDispatch} from 'react-redux';

// Screens
import LoginScreen from '../screens/LoginScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ListenScreen from '../screens/ListenScreen';
import RecordScreen from '../screens/RecordScreen';
import LogsScreen from '../screens/LogsScreen';
import SignUpScreen from '../screens/SignUpScreen';
import InfoScreen from '../screens/InfoScreen';

import {BottomTabNavigatorParamList} from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {refreshToken, selectMsg, selectToken} from '../utils/redux/authSlice';
import {useSelector} from 'react-redux';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

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

export const LoginNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'login'}>
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
    </NavigationContainer>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="녹음"
        screenOptions={({route}) => ({
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'black',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({focused, color, size}) => {
            return <Icon name="delete-sweep" size={25} color="#aaa" />;
          },
        })}>
        <Tab.Screen
          name="책과음악"
          component={ListenScreen}
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
          component={RecordScreen}
          options={({route}) => ({
            headerShown: false,
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

const getToken = async () => {
  const dispatch = useDispatch();
  try {
    //AsyncStorage.clear();

    const token = await AsyncStorage.getItem('refresh-token');

    if (token) {
      // dispatch(refreshToken(token));
      // return true;
      const refreshToken = axios
        .post(
          `http://127.0.0.1:5001/auth/refresh`,
          {},
          {
            headers: {
              authorization: 'Bearer ' + token,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          AsyncStorage.setItem('access-token', res.data.access_token);
          console.log('REFRESH TOKEN: ', JSON.stringify(jwt_decode(token)));
          return token;
        })
        .catch(err => console.error(err));
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    AsyncStorage.clear();
  }
};

const checkToken = async () => {
  const ch = await getToken();
  //console.log(ch);
  if (ch) {
    return true;
  } else {
    //console.log(ch);
    return false;
  }
};

export const MainNavigator = () => {
  const [isSignIn, setIsSignIn] = React.useState(false);
  const [token, setToken] = React.useState();

  const _msg = useSelector(selectMsg);

  React.useEffect(() => {
    // checkToken().then(val => setIsSignIn(val));
    if (_msg === 'SUCCESS_REGISTER' || _msg === 'SUCCESS_LOGIN') {
      console.log(_msg);
      setIsSignIn(true);
    } else if (
      _msg === 'FAILED_REGISTER' ||
      _msg === 'FAILED_REGISTER' ||
      _msg === 'SUCCESS_LOGOUT'
    ) {
      setIsSignIn(false);
    }
  }, [_msg]);

  React.useEffect(() => {
    try {
      AsyncStorage.getItem('access-token').then(
        value =>
          // AsyncStorage returns a promise
          // Adding a callback to get the value
          setToken(value),
        // Setting the value in Text
      );
      if (token) {
        setIsSignIn(true);
      } else {
        setIsSignIn(false);
      }
    } catch {
      setIsSignIn(false);
    }
  }, []);

  React.useEffect(() => {
    if (token) {
      setIsSignIn(true);
    } else {
      setIsSignIn(false);
    }
  }, [token]);

  return <>{isSignIn ? <AppNavigator /> : <LoginNavigator />}</>;
};
