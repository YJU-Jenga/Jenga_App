import React from 'react';
import {SafeAreaView} from 'react-native';

import WebView from 'react-native-webview';
import {web_address} from '../config/address';

const ShoppingScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <WebView source={{uri: web_address}}></WebView>
    </SafeAreaView>
  );
};

export default ShoppingScreen;
