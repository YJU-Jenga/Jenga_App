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
import SignUpScreen from '../screens/SignUpScreen';
import InfoScreen from '../screens/InfoScreen';
import ScheduleModalScreen from '../screens/ScheduleModalScreen';
import ShoppingScreen from '../screens/ShoppingScreen';

import {BottomTabNavigatorParamList} from '../types';
import Icon from 'react-native-vector-icons/Entypo';

import {
  refreshToken,
  selectAccessToken,
  selectMsg,
  selectToken,
} from '../utils/redux/authSlice';
import {getUser, selectUserData} from '../utils/redux/userSlice';
import {useSelector} from 'react-redux';

import {
  Alert,
  BackHandler,
  SafeAreaView,
  Text,
  ToastAndroid,
} from 'react-native';

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

const ScheduleNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="schedule"
        options={{headerShown: false}}
        component={ScheduleScreen}
      />
      <Stack.Screen
        name="scheduleModal"
        options={{headerShown: false, presentation: 'modal'}}
        component={ScheduleModalScreen}></Stack.Screen>
      {/* <Stack.Screen
        name="scheduleDetail"
        options={{headerShown: false, presentation: 'formSheet'}}
        component={ScheduleDetailScreen}
      /> */}
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
        // initialRouteName="책과음악"
        screenOptions={({route}) => ({
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#ff6e6e',
          tabBarInactiveTintColor: '#f5abab',
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let iconColor = focused ? '#ff6e6e' : '#f5abab';
            switch (route.name) {
              case '책과음악':
                iconName = 'folder-music';
                break;
              case '스케쥴':
                iconName = 'calendar';
                break;
              case '녹음':
                iconName = 'modern-mic';
                break;
              case '쇼핑':
                iconName = 'shop';
                break;
              case '설정':
                iconName = 'sound-mix';
                break;
            }

            return <Icon name={iconName} size={25} color={iconColor} />;
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
          component={ScheduleNavigator}
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
          name="쇼핑"
          component={ShoppingScreen}
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

export const MainNavigator = () => {
  const [isSignIn, setIsSignIn] = React.useState<boolean | null>(null);
  const [token, setToken] = React.useState();

  const _msg = useSelector(selectMsg);
  const _accessToken = useSelector(selectAccessToken);

  const dispatch = useDispatch();

  const Result = () => {
    if (isSignIn === true) {
      return <AppNavigator />;
    } else if (isSignIn === false) {
      return <LoginNavigator />;
    } else {
      return <SafeAreaView></SafeAreaView>;
    }
  };
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
        dispatch(refreshToken());
        // .unwrap()
        // .then((unwrapResult: any) => {
        //   dispatch(getUser(accessToken));
        // })
        // .catch((rejectedValueOrSerializedError: any) => {
        //   // handle error here
        //   console.log(rejectedValueOrSerializedError);
        // });
        // dispatch(getUser(accessToken));
      }
    };
    funcRefresh();
  }, []);

  React.useEffect(() => {
    const backAction = () => {
      ToastAndroid.show(
        '뒤로 가기 버튼을 한 번 더 누르시면 종료됩니다.',
        ToastAndroid.SHORT,
      );
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return <>{isSignIn ? <AppNavigator /> : <LoginNavigator />}</>;
  // return <Result></Result>;
};
