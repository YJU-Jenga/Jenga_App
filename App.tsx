import React, {useEffect} from 'react';

import RootNavigator, {
  AppNavigator,
  LoginNavigator,
  MainNavigator,
} from './src/navigation';
import {store} from './store';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {CookiesProvider} from 'react-cookie';
import * as Font from 'expo-font';
import {SafeAreaView, Text} from 'react-native';

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
        .then(async res => {
          await AsyncStorage.setItem('access-token', res.data.access_token);
          // console.log('REFRESH TOKEN: ', JSON.stringify(jwt_decode(token)));
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
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        //await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await Font.loadAsync(
          'antoutline',
          // eslint-disable-next-line
          require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
        );

        await Font.loadAsync(
          {
            antfill:
              // eslint-disable-next-line
              require('@ant-design/icons-react-native/fonts/antfill.ttf'),
          },
          // {Dovemayo_gothic: require('./src/assets/fonts/Dovemayo_gothic.ttf')},
          // require('./src/assets/fonts/TAEBAEK milkyway.ttf'),
        );

        // await Font.loadAsync({
        //   Dovemayo_gothic: require('./src/assets/fonts/Dovemayo_gothic.ttf'),
        // });

        await Font.loadAsync({
          Cafe24Ohsquare: require('./src/assets/fonts/Cafe24Ohsquare.ttf'),
        });

        await Font.loadAsync({
          TAEBAEK_milkyway: require('./src/assets/fonts/TAEBAEK-milkyway.otf'),
        });

        await Font.loadAsync({
          IMcreSoojinOTF: require('./src/assets/fonts/ImcreSoojinOTFRegular.otf'),
        });

        await Font.loadAsync({
          TheJamsilOTF_Regular: require('./src/assets/fonts/TheJamsilOTF3Regular.otf'),
        });

        await Font.loadAsync({
          TheJamsilOTF_Light: require('./src/assets/fonts/TheJamsilOTF2Light.otf'),
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  return (
    <Provider store={store}>
      <CookiesProvider>
        {appIsReady && <MainNavigator></MainNavigator>}
      </CookiesProvider>
    </Provider>
  );
}
