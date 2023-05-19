import React, {useCallback, useRef} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Title from '../components/Title';
import {
  Checkbox,
  Flex,
  InputItem,
  List,
  WingBlank,
} from '@ant-design/react-native';
import DefaultButton from '../components/DefaultButton';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppDispatch, useAppSelector} from '../../hooks';
import {logout} from '../utils/redux/authSlice';
import {getUser, selectUserData} from '../utils/redux/userSlice';
import {
  deleteDevice,
  getSyncedDeviceData,
  selectDeviceData,
  syncDevice,
} from '../utils/redux/deviceSlice';

import Font from 'react-native-vector-icons/AntDesign';
import {Modal} from 'react-native';
import {colors, height, width} from '../config/globalStyles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const Item = List.Item;

function SettingsScreen({ui}) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const _userData = useAppSelector(selectUserData);
  const _deviceData = useAppSelector(selectDeviceData);
  const [userData, setUserData] = React.useState<object>();
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [macAddress, setMacAddress] =
    React.useState<string>('e4:5f:01:74:a7:45');

  const macAddrRef = useRef();

  React.useEffect(() => {
    setUserData(_userData);
  }, [_userData]);

  const Logout = () => {
    dispatch(logout());
  };

  const onSyncDevice = useCallback(
    e => {
      console.log('ggg ', macAddress);
      dispatch(syncDevice({userId: ui.id, macAddress: macAddress}))
        .unwrap()
        .then(() => {
          setVisibleModal(false);
          loadSyncedDeviceData();
        });
      // macAddrRef.current!.value,
    },
    [macAddrRef],
  );

  const onDeleteDevice = device => {
    dispatch(
      deleteDevice({
        deviceId: device.id,
        macAddress: device.macAddress,
        name: device.name,
      }),
    )
      .unwrap()
      .then(() => loadSyncedDeviceData());
  };

  const loadSyncedDeviceData = React.useCallback(() => {
    dispatch(getSyncedDeviceData(ui.id));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getSyncedDeviceData(ui.id));
    }, []),
  );

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
          {userData && <Text style={{color: 'black'}}>{userData?.name}</Text>}
        </Item>
        <DefaultButton title="로그아웃" onPress={Logout}></DefaultButton>
      </List>
      <List renderHeader={'Doll'}>
        <Item
          onPress={() => {
            setVisibleModal(true);
          }}
          arrow="horizontal">
          <Text style={{color: 'black', fontFamily: 'TheJamsilOTF_Light'}}>
            인형 연동하기
          </Text>
        </Item>
        {_deviceData.length >= 1 ? (
          _deviceData.map((device, index) => (
            <Item key={index}>
              <Flex justify="between">
                <Text
                  style={{color: 'black', fontFamily: 'TheJamsilOTF_Light'}}>
                  {device.name}
                </Text>
                <Icon
                  onPress={() => onDeleteDevice(device)}
                  color={colors.red}
                  size={16}
                  name="delete"></Icon>
              </Flex>
            </Item>
          ))
        ) : (
          <></>
        )}
      </List>
      <Pressable
        onPress={() => navigation.navigate('shoppingView')}
        style={{
          padding: 20,
          backgroundColor: '#f29999',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 30,
          margin: 20,
        }}>
        <Text style={{color: 'white', fontSize: 18}}>쇼핑하러가기</Text>
      </Pressable>
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
                인형 연동하기
              </Text>
            </Flex>

            <View
              style={{marginHorizontal: 10, marginTop: 20, marginBottom: 20}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.iconPink,
                  fontFamily: 'TheJamsilOTF_Regular',
                  marginTop: 4,
                  marginBottom: height * 20,
                }}>
                기기 주소 입력
              </Text>

              <InputItem
                onChange={e => {
                  setMacAddress(e);
                  console.log(e);
                }}
                value={macAddress}
                placeholder="기기 주소를 입력해주세요">
                <Icon name="smileo" size={20} color="#555" />
              </InputItem>
            </View>

            <View
              style={{
                marginHorizontal: 10,
                marginTop: 20,
                marginBottom: height * 40,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.red,
                  fontFamily: 'TheJamsilOTF_Regular',
                  marginTop: 4,
                  marginBottom: height * 20,
                }}>
                주의할 점
              </Text>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'TheJamsilOTF_Light',
                  }}>
                  인형을 먹으면 안 돼요
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text style={{fontSize: 16, fontFamily: 'TheJamsilOTF_Light'}}>
                  고온의 장소나 물이 있는 곳에 두지마세요
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'TheJamsilOTF_Light',
                    flexWrap: 'wrap',
                  }}>
                  구매 후 1년간 무상으로 AS를 제공합니다
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text style={{fontSize: 16, fontFamily: 'TheJamsilOTF_Light'}}>
                  터질 수도 있으니 조심하세요
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text style={{fontSize: 16, fontFamily: 'TheJamsilOTF_Light'}}>
                  부부싸움 할 때 던지지 마세요
                </Text>
              </Flex>
            </View>
            <Flex
              justify="center"
              direction="column"
              style={{gap: height * 10, marginBottom: height * 20}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'TheJamsilOTF_Regular',
                  color: 'black',
                }}>
                상기 사항을 잘 숙지했으면
              </Text>
              <Icon name="arrowdown" size={20} color={colors.iconPink} />
            </Flex>

            <DefaultButton
              onPress={e => onSyncDevice(e)}
              title="기기 등록하기"
              type="default"></DefaultButton>
          </WingBlank>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default SettingsScreen;
