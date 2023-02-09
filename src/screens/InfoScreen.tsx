import React from 'react';
import {
  SafeAreaView,
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

const MyInfo = () => {
  return <Text>내 정보 컴포넌트~</Text>;
};

const DollInfo = () => {
  return <Text>인형 정보 컴포넌트~</Text>;
};

const InfoScreen = ({route}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <Text>{route.params.type}</Text>
      {route.params.type === 'myInfo' ? <MyInfo /> : <DollInfo />}
    </SafeAreaView>
  );
};

export default InfoScreen;
