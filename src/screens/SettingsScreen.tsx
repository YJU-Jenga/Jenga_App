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
import {Snackbar} from 'react-native-paper';

const Item = List.Item;

function SettingsScreen({ui}) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const _userData = useAppSelector(selectUserData);
  const _deviceData = useAppSelector(selectDeviceData);
  const [userData, setUserData] = React.useState<object>();
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = React.useState<string>('');
  const [macAddress, setMacAddress] = React.useState<string>('');

  const macAddrRef = useRef();

  React.useEffect(() => {
    setUserData(_userData);
    // setMacAddress('');
  }, [_userData]);

  const Logout = () => {
    dispatch(logout());
  };

  const onSyncDevice = e => {
    dispatch(syncDevice({userId: ui.id, macAddress: macAddress}))
      .unwrap()
      .then(() => {
        setVisibleModal(false);
        loadSyncedDeviceData();
        setSnackbarVisible(true);
        setSnackbarContent('人形が連動しました。');
        setMacAddress('');
      });
    // macAddrRef.current!.value,
  };

  const onDeleteDevice = device => {
    dispatch(
      deleteDevice({
        deviceId: device.id,
        macAddress: device.macAddress,
        name: device.name,
      }),
    )
      .unwrap()
      .then(() => {
        loadSyncedDeviceData();
        setSnackbarVisible(true);
        setSnackbarContent('人形との連動が解除されました。');
        setMacAddress('');
      });
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
      <List renderHeader={'私の情報'}>
        <Item arrow="horizontal">
          {userData && <Text style={{color: 'black'}}>{userData?.name}</Text>}
        </Item>
        <DefaultButton title="ログアウト" onPress={Logout}></DefaultButton>
      </List>
      <List renderHeader={'Doll'}>
        <Item
          onPress={() => {
            setVisibleModal(true);
          }}
          arrow="horizontal">
          <Text style={{color: 'black', fontFamily: 'TheJamsilOTF_Light'}}>
            人形連動
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
        <Text style={{color: 'white', fontSize: 18}}>買い物に行く</Text>
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
                人形連動
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
                デバイスMACアドレス入力
              </Text>

              <InputItem
                onChange={e => {
                  setMacAddress(e);
                  console.log(e);
                }}
                value={macAddress}
                placeholder="MACアドレスを入力してください">
                <Icon name="smileo" size={20} color="#555" />
              </InputItem>
            </View>

            <View
              style={{
                marginHorizontal: 6,
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
                注意すべき点
              </Text>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'TheJamsilOTF_Light',
                  }}>
                  人形を食べてはいけません
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text style={{fontSize: 16, fontFamily: 'TheJamsilOTF_Light'}}>
                  高温の場所や水のある場所に置かないでください
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
                  購入後1年間無償でASを提供します
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text style={{fontSize: 16, fontFamily: 'TheJamsilOTF_Light'}}>
                  爆発するかもしれないので気をつけてください
                </Text>
              </Flex>
              <Flex style={{gap: width * 15, marginBottom: height * 15}}>
                <Icon name="pushpino" size={20} color={colors.red} />
                <Text style={{fontSize: 16, fontFamily: 'TheJamsilOTF_Light'}}>
                  夫婦喧嘩をする時に投げないでください
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
                上記の事項をよく熟知したならば
              </Text>
              <Icon name="arrowdown" size={20} color={colors.iconPink} />
            </Flex>

            <DefaultButton
              onPress={e => onSyncDevice(e)}
              title="デバイス登録"
              type="default"></DefaultButton>
          </WingBlank>
        </SafeAreaView>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          setSnackbarContent('');
        }}
        duration={2500}>
        {snackbarContent}
      </Snackbar>
    </SafeAreaView>
  );
}

export default SettingsScreen;
