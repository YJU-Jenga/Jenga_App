import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  BackHandler,
  Pressable,
} from 'react-native';
import {
  Provider,
  Card,
  Toast,
  Flex,
  WhiteSpace,
  WingBlank,
  DatePickerView,
  List,
  Switch,
  SwipeAction,
  InputItem,
  Button,
  Checkbox,
} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import {ActionComponent, RepeatComponent} from './AlarmDetailScreen';
import {useAppDispatch, useAppSelector} from '../../hooks';
import DatePicker from 'react-native-date-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {height} from '../config/globalStyles';
import DeleteButton from '../components/DeleteButton';
import {Snackbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  changeMusicFile,
  changeMusicName,
  createAlarm,
  deleteAlarm,
  getAllAlarm,
  selectAlarmData,
  selectAlarmMusicFile,
  selectAlarmMusicName,
  updateAlarm,
} from '../utils/redux/alarmSlice';
import {
  getAllMusic,
  getOneMusic,
  selectMusicData,
} from '../utils/redux/musicSlice';
import {IAlarmData} from '../interfaces/alarm';

const AlarmModalScreen = ({ui}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [valuehours, setValuehours] = React.useState(new Date());
  const [visibleRepeatModal, setVisibleRepeatModal] = React.useState(false);
  const [visibleSoundsModal, setVisibleSoundsModal] = React.useState(false);
  const [displayRepeat, setDisplayRepeat] = React.useState();
  //const [repeatInformation, setRepeatInformation] = React.useState();
  const [repeatInfo, setRepeatInfo] = React.useState([]);
  const [sentence, setSentence] = React.useState('');
  const [name, setName] = useState<string>('');
  const [isMusicReady, setisMusicReady] = useState<boolean>(false);

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');

  const mode = route.params?.type === 'EDIT' ? '予約修正' : '予約作成';

  const dispatch = useAppDispatch();
  const _alarms = useAppSelector(selectAlarmData);
  const _musicFile = useAppSelector(selectAlarmMusicFile);
  const _musicName = useAppSelector(selectAlarmMusicName);
  const _musicData = useAppSelector(selectMusicData);
  // const _currSound = route.params?.data.file;
  //const _currRepeat = route.params?.data.repeat;

  const _currSound = route.params?.type === 'EDIT' ? route.params.file : '';

  const [submitRepeat, setSubmitRepeat] = useState(
    route.params?.type === 'EDIT' ? route.params?.data.repeat : '0000000',
  );

  //const _currSound = useSelector(selectSoundInfo);
  // const _currRepeat = useSelector(selectRepeatInfo);

  useEffect(() => {
    if (route.params?.type === 'CREATE') {
      //dispatch(initScheduleState());
      dispatch(changeMusicFile(''));
      dispatch(changeMusicName(''));
    } else if (route.params?.type === 'EDIT') {
      //dispatch(initEditScheduleState(route.params.data));
      const hours = parseInt(route.params.data.time_id.substring(0, 2));
      const minutes = parseInt(route.params.data.time_id.substring(2));
      const utcDate = new Date(2001, 7 - 1, 6, hours, minutes);

      const localDate = new Date(
        utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
      );

      dispatch(changeMusicFile(route.params.data.file));

      dispatch(getAllMusic(ui.id));

      setName(route.params.data.name);
      setSentence(route.params.data.sentence);
      setValuehours(utcDate);
      let str = '';

      ['日', '月', '火', '水', '木', '金', '土'].forEach((day, i) => {
        str += submitRepeat[i] === '1' ? day + ' ' : '';
      });

      setDisplayRepeat(str);
    }
  }, []);

  useEffect(() => {
    if (
      route.params?.type === 'EDIT' &&
      Array.isArray(_musicData) &&
      _musicData.length === 0 &&
      Array.isArray(_musicData) &&
      _musicData !== undefined &&
      _musicData == ''
    ) {
      dispatch(changeMusicName(''));
    } else {
      console.log(typeof _musicData, '아아');
      try {
        _musicData?.forEach(
          (item: {file: string; name: string}, idx: number) => {
            if (item.file == route.params.data?.file) {
              dispatch(changeMusicName(item.name));
            }
          },
        );
      } catch (error) {
        console.log('에러요 ', _musicData);
        dispatch(changeMusicName(''));
      }
    }
  }, [_musicData]);

  const generateId = () => {
    console.log(valuehours.getHours());
    const hour = valuehours.getHours().toString().padStart(2, '0');
    const min = valuehours.getMinutes().toString().padStart(2, '0');
    const res = hour + min;
    return res;
  };

  const onSave = async () => {
    // const data = await AsyncStorage.getItem('schedules');
    // let loadedSchedules = await JSON.parse(data);

    const isDuplicated = checkDuplicationSchedule();
    console.log('isDuplicated 結果 : ', isDuplicated);
    if (route.params.type === 'CREATE') {
      if (isDuplicated) {
        setSnackbarVisible(true);
        setSnackbarContent('同じ時間に別のスケジュールが登録されています。');
        return;
      }

      dispatch(
        createAlarm({
          user_id: ui.id,
          time_id: generateId(),
          name: name,
          sentence: sentence,
          state: true,
          repeat: submitRepeat,
          file: _musicFile,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(getAllAlarm(ui.id));
        });
    } else if (route.params.type === 'EDIT') {
      if (isDuplicated) {
        setSnackbarVisible(true);
        setSnackbarContent('同じ時間に別のスケジュールが登録されています。');
        return;
      }
      // const timeInfo = new Date(
      //   valuehours.getTime() - valuehours.getTimezoneOffset() * 60000,
      // );
      dispatch(
        updateAlarm({
          time_id: generateId(),
          repeat: submitRepeat,
          user_id: ui.id,
          sentence: sentence,
          state: true,
          name: name,
          id: route.params.data.id,
          file: _musicFile,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(getAllAlarm(ui.id));
        });
    }

    navigation.navigate('alarm');
  };

  const onDelete = async () => {
    dispatch(deleteAlarm(route.params?.data.id))
      .unwrap()
      .then(() => {
        dispatch(getAllAlarm(ui.id));
      });

    navigation.navigate('alarm');
  };

  const checkDuplicationSchedule = () => {
    const id = generateId();

    const foundItem = _alarms.find(item => item.time_id === id);

    if (route.params.type === 'EDIT') {
      const editId = route.params.data.time_id;
      console.log(editId, id);
      if (id === editId) {
        return false;
      } else {
        if (foundItem) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  const onPressDay = (i: number) => {
    const arr = [...submitRepeat];
    if (arr[i] === '1') {
      arr[i] = '0';
    } else if (arr[i] === '0') {
      arr[i] = '1';
    }
    setSubmitRepeat(arr.join(''));
  };

  useEffect(() => {
    let str = '';
    ['日', '月', '火', '水', '木', '金', '土'].forEach((day, i) => {
      str += submitRepeat[i] === '1' ? day + ' ' : '';
    });
    setDisplayRepeat(str);
  }, [submitRepeat]);

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}>
        <SafeAreaView
          style={{
            height: '100%',
            display: 'flex',
          }}>
          <WhiteSpace size="lg" />
          <Flex justify="around" style={{marginBottom: height * 30}}>
            <Icon
              name="md-caret-back-outline"
              size={30}
              color={'#ff6e6e'}
              onPress={() => navigation.navigate('alarm')}></Icon>
            <Text
              style={{
                fontSize: 24,
                color: 'black',
                fontFamily: 'TheJamsilOTF_Regular',
              }}>
              {mode}
            </Text>
            <Text
              style={{
                color: '#ff6e6e',
                fontSize: 18,
                fontWeight: '600',
                fontFamily: 'TheJamsilOTF_Regular',
              }}
              onPress={onSave}>
              保存
            </Text>
          </Flex>
          <WingBlank size="lg">
            <WingBlank
              size="sm"
              style={{display: 'flex', justifyContent: 'center'}}>
              <DatePicker
                onDateChange={e => setValuehours(e)}
                mode="time"
                date={valuehours}></DatePicker>
            </WingBlank>

            <List>
              <InputItem
                value={name}
                onChange={v => setName(v)}
                style={{
                  fontFamily: 'TheJamsilOTF_Light',
                }}
                placeholder="タイトルを入力してください。">
                <Text
                  style={{
                    fontFamily: 'TheJamsilOTF_Regular',
                    color: 'black',
                    fontSize: 17,
                  }}>
                  タイトル
                </Text>
              </InputItem>
            </List>
            <List style={{borderTopWidth: 0}}>
              <InputItem
                value={sentence}
                onChange={v => setSentence(v)}
                style={{
                  fontFamily: 'TheJamsilOTF_Light',
                }}
                placeholder="子供に言いたいことを入力しなさい。">
                <Text
                  style={{
                    fontFamily: 'TheJamsilOTF_Regular',
                    color: 'black',
                    fontSize: 17,
                  }}>
                  TTS
                </Text>
              </InputItem>
            </List>
            <List style={{borderTopWidth: 0}}>
              <List.Item
                extra={
                  <Text
                    style={{fontFamily: 'TheJamsilOTF_Regular', color: 'gray'}}>
                    {displayRepeat}
                  </Text>
                }
                onPress={() => {
                  setVisibleRepeatModal(true);
                }}
                arrow="horizontal">
                <Text
                  style={{
                    color: 'black',
                    fontSize: 17,
                    fontFamily: 'TheJamsilOTF_Regular',
                  }}>
                  繰り返す
                </Text>
              </List.Item>
              <List.Item
                extra={
                  <Text style={{fontFamily: 'TheJamsilOTF_Regular'}}>
                    {_musicName}
                  </Text>
                }
                onPress={() => {
                  setVisibleSoundsModal(true);
                }}
                arrow="horizontal">
                <Text
                  style={{
                    fontFamily: 'TheJamsilOTF_Regular',
                    color: 'black',
                    fontSize: 17,
                  }}>
                  サウンド
                </Text>
              </List.Item>
            </List>
            <WhiteSpace size="xl" />
            {route.params?.type === 'EDIT' && (
              <DeleteButton onPress={onDelete}></DeleteButton>
            )}

            <WhiteSpace></WhiteSpace>
          </WingBlank>
        </SafeAreaView>

        <Modal
          presentationStyle="pageSheet"
          visible={visibleRepeatModal}
          animationType="slide"
          onRequestClose={() => {
            setVisibleRepeatModal(false);
          }}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <Flex
              justify="between"
              style={{marginHorizontal: 25, marginTop: 20, marginBottom: 20}}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '600',
                  color: 'black',
                  fontFamily: 'TheJamsilOTF_Regular',
                }}>
                反復
              </Text>
            </Flex>
            <WhiteSpace size="lg" />
            {[
              '日曜日',
              '月曜日',
              '火曜日',
              '水曜日',
              '木曜日',
              '金曜日',
              '土曜日',
            ].map((day, i) => {
              return (
                <List.Item
                  key={i}
                  onPress={() => {
                    onPressDay(i);
                  }}
                  thumb={
                    <Checkbox
                      checked={submitRepeat[i] === '1'}
                      onChange={() => {
                        //dispatch(updateAlarm({day, isChecked}));
                      }}></Checkbox>
                  }>
                  <Text
                    style={{
                      fontFamily: 'TheJamsilOTF_Regular',
                      color: 'black',
                    }}>
                    {day}毎に繰り返し
                  </Text>
                </List.Item>
              );
            })}
          </SafeAreaView>
        </Modal>

        <Modal
          presentationStyle="formSheet"
          visible={visibleSoundsModal}
          animationType="slide"
          onRequestClose={() => setVisibleSoundsModal(false)}>
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
                  ファイル
                </Text>
              </Flex>
            </WingBlank>
            <ActionComponent></ActionComponent>
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
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default AlarmModalScreen;
