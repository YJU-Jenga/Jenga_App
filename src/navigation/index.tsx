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
import ShoppingScreen from '../screens/ShoppingScreen';
import ShoppingDetailScreen from '../screens/ShoppingDetailScreen';
import SignUpScreen from '../screens/SignUpScreen';
import InfoScreen from '../screens/InfoScreen';

import {BottomTabNavigatorParamList} from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  refreshToken,
  selectAccessToken,
  selectMsg,
  selectToken,
} from '../utils/redux/authSlice';
import {getUser, selectUserData} from '../utils/redux/userSlice';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import jwtDecode from 'jwt-decode';
import {unwrapResult} from '@reduxjs/toolkit';
import OrderScreen from '../screens/OrderScreen';
import {SafeAreaView, Text} from 'react-native';

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

const ShoppingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="shopping"
        options={{headerShown: false}}
        component={ShoppingScreen}
      />
      <Stack.Screen
        name="shoppingDetail"
        options={{headerShown: true, title: ''}}
        component={ShoppingDetailScreen}
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
  // 인형 등록했으면 쇼핑, 등록하지 않았으면 스케쥴..?
  const _userData = useSelector(selectUserData);
  const [mode, setMode] = React.useState('USER');
  React.useEffect(() => {
    if (_userData?.permission === true) {
      setMode('ADMIN');
    } else {
      setMode('USER');
      // 인형 세팅 X이라면.. INITIAL 모드로!!
    }
  }, [_userData]);

  const AdminMode = () => {
    return (
      <SafeAreaView>
        <Text>저는 관리자입니다</Text>
      </SafeAreaView>
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="쇼핑"
        screenOptions={({route}) => ({
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'black',
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
        {/* <Tab.Screen
          name="쇼핑"
          component={ShoppingNavigator}
          options={{headerShown: false}}
        /> */}
        <Tab.Screen
          name="장바구니"
          component={OrderScreen}
          options={{headerShown: false}}></Tab.Screen>
        <Tab.Screen
          name="설정"
          component={SettingsNavigator}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// const getToken = async () => {
//   const dispatch = useDispatch();
//   try {
//     //AsyncStorage.clear();

//     const token = await AsyncStorage.getItem('refresh-token');

//     if (token) {
//       // dispatch(refreshToken(token));
//       // return true;
//       const refreshToken = axios
//         .post(
//           `http://127.0.0.1:5001/auth/refresh`,
//           {},
//           {
//             headers: {
//               authorization: 'Bearer ' + token,
//             },
//             withCredentials: true,
//           },
//         )
//         .then(res => {
//           AsyncStorage.setItem('access-token', res.data.access_token);
//           return token;
//         })
//         .catch(err => console.error(err));
//     } else {
//       return false;
//     }
//   } catch (e) {
//     console.error(e);
//     AsyncStorage.clear();
//   }
// };

// const checkToken = async () => {
//   const ch = await getToken();
//   //console.log(ch);
//   if (ch) {
//     return true;
//   } else {
//     //console.log(ch);
//     return false;
//   }
// };

export const MainNavigator = () => {
  const [isSignIn, setIsSignIn] = React.useState(false);
  const [token, setToken] = React.useState();

  const _msg = useSelector(selectMsg);
  const _accessToken = useSelector(selectAccessToken);

  const dispatch = useDispatch();

  React.useEffect(() => {
    switch (_msg) {
      case 'SUCCESS_REGISTER':
      case 'SUCCESS_LOGIN':
      case 'SUCCESS_REFRESH_TOKEN':
        setIsSignIn(true);
        break;
      case 'FAILED_REGISTER':
      case 'FAILED_LOGIN':
      case 'SUCCESS_LOGOUT':
      case 'FAILED_REFRESH_TOKEN':
        setIsSignIn(false);
        break;
    }
  }, [_msg]);

  React.useEffect(() => {
    const funcRefresh = async () => {
      const token = await AsyncStorage.getItem('refresh-token');
      const accessToken = await AsyncStorage.getItem('access-token');

      if (token) {
        dispatch(refreshToken())
          .unwrap()
          .then((unwrapResult: any) => {
            dispatch(getUser(accessToken));
          })
          .catch((rejectedValueOrSerializedError: any) => {
            // handle error here
            console.log(rejectedValueOrSerializedError);
          });
        // dispatch(getUser(accessToken));
      }
    };
    funcRefresh();
  }, []);

  return <>{isSignIn ? <AppNavigator /> : <LoginNavigator />}</>;
};
