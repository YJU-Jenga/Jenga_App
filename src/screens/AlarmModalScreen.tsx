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
} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import {ActionComponent, RepeatComponent} from './AlarmDetailScreen';
import {useDispatch, useSelector} from 'react-redux';
import {
  initEditScheduleState,
  initScheduleState,
  selectRepeatInfo,
  selectSoundInfo,
} from '../utils/redux/alarmSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {height} from '../config/globalStyles';
import DeleteButton from '../components/DeleteButton';
import {Snackbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

const AlarmModalScreen = ({ui}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [valuehours, setValuehours] = React.useState(new Date());
  const [visibleRepeatModal, setVisibleRepeatModal] = React.useState(false);
  const [visibleSoundsModal, setVisibleSoundsModal] = React.useState(false);
  //const [repeatInformation, setRepeatInformation] = React.useState();
  const [repeatInfo, setRepeatInfo] = React.useState([]);
  const [sentence, setSentence] = React.useState('');

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');

  const mode = route.params?.type === 'EDIT' ? '예약 편집' : '예약 생성';

  const dispatch = useDispatch();
  const _currSound = useSelector(selectSoundInfo);
  const _currRepeat = useSelector(selectRepeatInfo);

  useEffect(() => {
    if (route.params?.type === 'CREATE') {
      dispatch(initScheduleState());
    } else if (route.params?.type === 'EDIT') {
      dispatch(initEditScheduleState(route.params.data));
      setSentence(route.params.data.sentence);
      setValuehours(new Date(route.params.data.time));
    }
  }, []);

  useEffect(() => {
    let str = '';
    setRepeatInfo('없음');
    const data = _currRepeat
      .filter(el1 => el1.isChecked)
      .map(el2 => {
        str = str.concat(el2.day.slice(0, 1) + ' ');
        setRepeatInfo(str);
      });
  }, [visibleRepeatModal]);

  const onSave = async () => {
    const data = await AsyncStorage.getItem('schedules');
    let loadedSchedules = await JSON.parse(data);

    const isDuplicated = checkDuplicationSchedule(loadedSchedules);
    console.log('isDuplicated 결과 : ', isDuplicated);
    if (route.params.type === 'CREATE') {
      if (isDuplicated) {
        setSnackbarVisible(true);
        setSnackbarContent('같은 시간에 다른 일정이 등록되어 있습니다');
        return;
      }
      if (loadedSchedules) {
        console.log(loadedSchedules);
        await AsyncStorage.setItem(
          'schedules',
          JSON.stringify([
            {
              id: generateId(),
              repeat: _currRepeat,
              sentence: sentence,
              soundFile: _currSound,
              time: valuehours,
              isAlarmOn: true,
            },
            ...loadedSchedules,
          ]),
        );
      } else {
        await AsyncStorage.setItem(
          'schedules',
          JSON.stringify([
            {
              id: generateId(),
              repeat: _currRepeat,
              sentence,
              soundFile: _currSound,
              time: valuehours,
              isAlarmOn: true,
            },
          ]),
        );
      }
    } else if (route.params.type === 'EDIT') {
      if (isDuplicated) {
        setSnackbarVisible(true);
        setSnackbarContent('같은 시간에 다른 일정이 등록되어 있습니다');
        return;
      }
      const index = loadedSchedules.findIndex(
        item => item.id === route.params.data.id,
      );

      loadedSchedules[index].id = generateId();
      loadedSchedules[index].repeat = _currRepeat;
      loadedSchedules[index].sentence = sentence;
      loadedSchedules[index].soundFile = _currSound;
      loadedSchedules[index].time = valuehours;

      await AsyncStorage.setItem('schedules', JSON.stringify(loadedSchedules));
    }

    navigation.navigate('alarm');
  };

  const onDelete = async () => {
    const data = await AsyncStorage.getItem('schedules');
    let loadedSchedules = JSON.parse(data);
    const filteredSchedules = loadedSchedules.filter(
      item => item.id !== route.params.data.id,
    );
    await AsyncStorage.setItem('schedules', JSON.stringify(filteredSchedules));

    navigation.navigate('alarm');
  };

  const generateId = () => {
    console.log(valuehours.getHours());
    const hour = valuehours.getHours().toString();
    const min = valuehours.getMinutes().toString();
    const res = Number(hour + min);
    return res;
  };

  const checkDuplicationSchedule = scheduleList => {
    const id = generateId();
    if (route.params.type === 'EDIT') {
      const editId = route.params.data.id;
      console.log('안녕 : ', id, editId);
      if (id === editId) {
        return false;
      }
      return scheduleList.some(el => el.id === id);
    }
    if (
      (Array.isArray(scheduleList) && scheduleList.length === 0) ||
      !scheduleList
    ) {
      return false;
    } else {
      console.log('서케쥴은 ', scheduleList);
      return scheduleList.some(el => el.id === id);
    }
  };

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
              저장
            </Text>
          </Flex>
          <WingBlank size="lg">
            <DatePickerView
              style={{marginBottom: height * 10}}
              itemStyle={{fontFamily: 'TheJamsilOTF_Light'}}
              mode="time"
              value={valuehours}
              onChange={v => setValuehours(v)}
            />

            <List>
              <List.Item
                extra={
                  <Text
                    style={{fontFamily: 'TheJamsilOTF_Regular', color: 'gray'}}>
                    {repeatInfo}
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
                  반복
                </Text>
              </List.Item>
              <List.Item
                extra={
                  <Text style={{fontFamily: 'TheJamsilOTF_Regular'}}>
                    {_currSound?.name}
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
                  액션
                </Text>
              </List.Item>
              <InputItem
                value={sentence}
                onChange={v => setSentence(v)}
                style={{
                  fontFamily: 'TheJamsilOTF_Regular',
                }}
                placeholder="아이에게 할 말을 입력하세요">
                <Text
                  style={{
                    fontFamily: 'TheJamsilOTF_Regular',
                    color: 'black',
                    fontSize: 17,
                  }}>
                  명령어
                </Text>
              </InputItem>
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
            // setRepeatInformation(_currRepeat);
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
                반복
              </Text>
            </Flex>
            <WhiteSpace size="lg" />
            {_currRepeat.map((v, i) => {
              return <RepeatComponent key={i} index={i}></RepeatComponent>;
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
                  액션
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
