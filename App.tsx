import React from 'react';

import RootNavigator, {
  LoginNavigator,
  AppNavigator,
  Example,
} from './src/navigation';
import {store} from './store';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
const getToken = async () => {
  try {
    //AsyncStorage.clear();

    const token = await AsyncStorage.getItem('refresh-token');

    if (token) {
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
          // console.log(JSON.stringify(jwt_decode(token)));
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

//console.log(isSignIn);

// let isSignIn: boolean = checkToken().then(val => (isSignIn = val));
// console.log('결과', isSignIn);
export default function App() {
  const [isSignIn, setIsSignIn] = React.useState(false);
  React.useEffect(() => {
    let test = checkToken().then(val => setIsSignIn(val));
  }, []);

  React.useEffect(() => {
    console.log('안녕', isSignIn);
  }, [isSignIn]);

  return (
    <Provider store={store}>
      {/* {!isSignIn ? <LoginNavigator /> : <AppNavigator />} */}
      <Example />
    </Provider>
  );
}
