import * as React from 'react';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '../../hooks';
import {getUserInfo, selectMsg} from '../utils/redux/authSlice';

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

import {selectToken} from '../utils/redux/authSlice';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

// const MainNavigator = ({route}) => {
//   // Alert.alert(ref.current?.getCurrentRoute());
//   return (
//     <Stack.Navigator initialRouteName={'record'}>
//       <Stack.Screen
//         name="record"
//         options={{headerShown: false}}
//         component={RecordScreen}
//       />
//       <Stack.Screen
//         name="login"
//         options={{headerShown: false}}
//         component={LoginScreen}
//       />
//       <Stack.Screen
//         name="signUp"
//         options={{headerShown: false}}
//         component={SignUpScreen}
//       />
//     </Stack.Navigator>
//   );
// };

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

export const MainNavigator = () => {
  const [isSignIn, setIsSignIn] = React.useState(false);
  const _msg = useSelector(selectMsg);
  // React.useEffect(() => {
  //   checkToken().then(val => setIsSignIn(val));
  // }, []);

  React.useEffect(() => {
    try {
      AsyncStorage.getItem('access-token').then(
        value =>
          // AsyncStorage returns a promise
          // Adding a callback to get the value
          console.log('로그인 쿠키 구하기', value),
        // Setting the value in Text
      );
      setIsSignIn(true);
    } catch {
      console.log('힝구~~~');
    }
  }, [_msg]);

  return <>{!isSignIn ? <LoginNavigator /> : <AppNavigator />}</>;
};

// const RootNavigator = () => {
//   const dispatch = useAppDispatch();
//   const ui = dispatch(getUserInfo('din'));

//   console.log(useAppSelector(getUserInfo));

//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         initialRouteName="녹음"
//         screenOptions={({route}) => ({
//           tabBarActiveTintColor: 'red',
//           tabBarInactiveTintColor: 'black',
//           // eslint-disable-next-line react/no-unstable-nested-components
//           tabBarIcon: ({focused, color, size}) => {
//             // let iconName;
//             // if (route.name === '메인') {
//             //   iconName = focused ? 'beer' : 'beer-outline';
//             // } else if (route.name === '통계') {
//             //   iconName = focused ? 'podium' : 'podium-outline';
//             // } else if (route.name === '설정') {
//             //   iconName = focused ? 'settings' : 'settings-outline';
//             // }

//             return <Icon name="delete-sweep" size={25} color="#aaa" />;
//           },
//         })}>
//         <Tab.Screen
//           name="책과음악"
//           component={BookScreen}
//           options={{headerShown: false}}
//         />
//         {/* <Tab.Screen name="스케쥴" component={HomeStackNavigator} /> */}
//         <Tab.Screen
//           name="스케쥴"
//           component={ScheduleScreen}
//           options={{headerShown: false}}
//         />
//         <Tab.Screen
//           name="녹음"
//           component={MainNavigator}
//           options={({route}) => ({
//             headerShown: false,

//             // tabBarStyle: {display: 'none'},
//           })}
//         />
//         <Tab.Screen
//           name="활동"
//           component={LogsScreen}
//           options={{headerShown: false}}
//         />
//         <Tab.Screen
//           name="설정"
//           component={SettingsNavigator}
//           options={{headerShown: false}}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default RootNavigator;
