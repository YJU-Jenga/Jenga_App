import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  Button,
  Modal,
  Platform,
} from 'react-native';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import WebView from 'react-native-webview';
import {web_address} from '../config/address';

const ShoppingScreen = () => {
  /** webview 로딩 완료시 */
  // const handleEndLoading = e => {
  //   /** rn에서 웹뷰로 정보를 보내는 메소드 */
  //   webviewRef.postMessage('로딩 완료시 webview로 정보를 보내는 곳');
  // };
  // React.useEffect(() => {
  //   // setProduct(route.params);
  //   setStockList(setValue(route.params.stock));
  // }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <WebView
        // onLoadEnd={handleEndLoading}
        // onMessage={handleOnMessage}
        // ref={handleSetRef}
        source={{uri: web_address}}></WebView>
    </SafeAreaView>
  );
};

export default ShoppingScreen;
