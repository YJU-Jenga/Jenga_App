import React from 'react';
import {Image, View} from 'react-native';
import {height, width} from '../config/globalStyles';
const SplashScreen = () => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: height * 100,
      }}>
      <Image
        style={{
          width: width * 350,
          height: width * 350,
          resizeMode: 'contain',
        }}
        source={require('./../assets/image/ichigo_logo_none_border.png')}></Image>
    </View>
  );
};

export default SplashScreen;
