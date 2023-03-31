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
import {
  WhiteSpace,
  WingBlank,
  Card,
  Flex,
  PickerView,
} from '@ant-design/react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getUser, selectMsg, selectUserData} from '../utils/redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import WebView from 'react-native-webview';

let SERVER_URL = 'http://127.0.0.1:3000';
if (Platform.OS === 'android') {
  SERVER_URL = 'http://10.0.2.2:3000';
}

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
        source={{uri: SERVER_URL}}></WebView>
    </SafeAreaView>
  );
};

export default ShoppingScreen;
