import React from 'react';

import RootNavigator, {
  LoginNavigator,
  AppNavigator,
  Example,
} from './src/navigation';
import {store} from './store';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token !== null) {
      return token;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
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
