import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Title from '../components/Title';
import {Flex, List, WingBlank} from '@ant-design/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../utils/redux/authSlice';
import DefaultButton from '../components/DefaultButton';
import {getUser, selectUserData} from '../utils/redux/userSlice';
import Font from 'react-native-vector-icons/AntDesign';
import {Modal} from 'react-native';
const Item = List.Item;
const Brief = Item.Brief;
function SettingsScreen({navigation}) {
  const dispatch = useDispatch();
  const _userData = useSelector(selectUserData);
  const [userData, setUserData] = React.useState<object>();
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const getUserInfo = async () => {
    const accessToken = await AsyncStorage.getItem('access-token');
    dispatch(getUser(accessToken));
  };

  React.useEffect(() => {
    getUserInfo();
  }, []);

  React.useEffect(() => {
    console.log(_userData);
    setUserData(_userData);
  }, [_userData]);

  const Logout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title title="Settings"></Title>
      <List renderHeader={'내 정보'}>
        <Item arrow="horizontal">
          {userData && <Text>{userData?.name}</Text>}
        </Item>
        <DefaultButton title="로그아웃" onPress={Logout}></DefaultButton>
      </List>
      <List renderHeader={'Doll'}>
        <Item
          onPress={() => {
            setVisibleModal(true);
          }}
          arrow="horizontal">
          <Text style={{color: 'black'}}>인형 추가하기</Text>
        </Item>
        <Item>
          <Text>미미</Text>
        </Item>
      </List>
      {/* <List renderHeader={'Setting'}>
        <Item>재녹음</Item>
      </List> */}

      <Modal
        presentationStyle="formSheet"
        visible={visibleModal}
        animationType="slide"
        onRequestClose={() => setVisibleModal(false)}>
        <SafeAreaView
          style={{
            height: '100%',
            display: 'flex',
          }}>
          <WingBlank size="lg">
            <Flex
              justify="between"
              style={{marginHorizontal: 10, marginTop: 20, marginBottom: 20}}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '600',
                  color: 'black',
                  fontFamily: 'TheJamsilOTF_Regular',
                }}>
                인형 추가하기
              </Text>
            </Flex>
            <Text>AI팀과 상의 후 추가하겠습니닷!</Text>
          </WingBlank>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default SettingsScreen;
