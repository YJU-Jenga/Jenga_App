import React, {useEffect} from 'react';

import {
  Alert,
  Pressable,
  SafeAreaView,
  //ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Title from '../Title';
import {
  Card,
  DatePickerView,
  Flex,
  List,
  Modal,
  Provider,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, height} from '../../config/globalStyles';
import TextAreaItem from '@ant-design/react-native/lib/textarea-item';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserData} from '../../utils/redux/userSlice';
import {useState} from 'react';
import CalendarDatePicker from './CalendarDatePicker';
import DatePickerTitle from './DatePickerTitle';
import {DateTime} from 'luxon';
import {
  createCalendar,
  initCalendarErrorMessage,
  selectCalendarErrorMsg,
} from '../../utils/redux/calendarSlice';
import {Snackbar} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

interface ICalendarForm {
  userId: number;
  title: string;
  start: Date | string;
  end: Date | string;
  location: string;
  description: string;
}

const WriteCalendar = ({onClose, currDate, ui, mode, editItem}) => {
  const utcOffset = new Date().getTimezoneOffset() * -1;
  const [calendarForm, setCalendarForm] = useState<ICalendarForm>({
    userId: ui.id,
    title: '',
    // start: new Date(currDate).toISOString(),
    start: new Date(new Date(currDate).getTime() - utcOffset * 60000),
    end: new Date(new Date(currDate).getTime() - utcOffset * 60000),
    location: '',
    description: '',
  });

  const [completeReady, setCompleteReady] = useState(false);

  const [startInfo, setStartInfo] = useState<object>({
    date: new Date(currDate),
    time: {h: 0, m: 0},
  });
  const [endInfo, setEndInfo] = useState<object>({
    date: new Date(currDate),
    time: {h: 0, m: 0},
  });

  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [visibleStartDate, setVisibleStartDate] = useState<boolean>(false);
  const [visibleStartTime, setVisibleStartTime] = useState<boolean>(false);
  const [visibleEndDate, setVisibleEndDate] = useState<boolean>(false);
  const [visibleEndTime, setVisibleEndTime] = useState<boolean>(false);
  const [visibleRepeatModal, setVisibleRepeatModal] = useState<boolean>(false);

  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');

  const _userData = useSelector(selectUserData);
  const _errorMessage = useSelector(selectCalendarErrorMsg);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    setErrorMessage(_errorMessage);
    dispatch(initCalendarErrorMessage());
  }, [_errorMessage]);

  React.useEffect(() => {
    if (errorMessage !== '') {
      // Alert.alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  useEffect(() => {
    const date = new Date(startInfo.date);
    const h = startInfo.time.h;
    const m = startInfo.time.m;
    date.setUTCHours(h);
    date.setUTCMinutes(m);
    setCalendarForm({
      ...calendarForm,
      start: new Date(new Date(date).getTime() - utcOffset * 60000),
    });
  }, [startInfo]);

  useEffect(() => {
    const date = new Date(endInfo.date);
    const h = endInfo.time.h;
    const m = endInfo.time.m;
    date.setUTCHours(h);
    date.setUTCMinutes(m);
    setCalendarForm({
      ...calendarForm,
      end: new Date(new Date(date).getTime() - utcOffset * 60000),
    });
  }, [endInfo]);

  /**
   * 시작, 종료 캘린더 component를 visible해줌. 보이기를 원하는 것은 !state, 나머지는 false
   * @param {boolean} sd StartDate
   * @param {boolean} st StartTime
   * @param {boolean} ed EndDate
   * @param {boolean} et EndTime
   */
  const switchVisible = (sd, st, ed, et) => {
    setVisibleStartDate(sd);
    setVisibleStartTime(st);
    setVisibleEndDate(ed);
    setVisibleEndTime(et);
  };

  const onSubmitCalendarForm = () => {
    if (calendarForm.title === '') {
      setSnackbarContent('タイトルを入力してください');
      setVisibleSnackbar(true);
      return;
    }

    if (calendarForm.description === '') {
      setSnackbarContent('ラベルを入力してください');
      setVisibleSnackbar(true);
      return;
    }

    if (calendarForm.location === '') {
      setSnackbarContent('장소를 입력해주세요.');
      setVisibleSnackbar(true);
      return;
    }
    // isAllDay 체크 ->
    if (calendarForm.start < calendarForm.end) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let startDate = startInfo.date;
      let endDate = endInfo.date;
      let startTime = startInfo.time.h;
      let endTime = startInfo.time.m;
      if (isAllDay) {
        console.log(calendarForm.start);
        startDate = startInfo.date;
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = endInfo.date;
        endDate.setUTCHours(23, 59, 59, 999);
      } else {
        startDate = DateTime.fromJSDate(startInfo.date, {zone: timeZone}).set({
          hours: startInfo.time.h,
          minutes: startInfo.time.m,
        });

        endDate = DateTime.fromJSDate(endInfo.date, {zone: timeZone}).set({
          hours: endInfo.time.h,
          minutes: endInfo.time.m,
        });

        // console.log('캘린더 end');
        // startDate = startInfo.date;
        // endDate = endInfo.date;
        // endDate.setUTCHours();

        console.log(endTime);
        // startDate.setHours(startInfo.time.h, startInfo.time.m, 0, 0);

        const data = {
          ...calendarForm,
          userId: ui.id,
          utcOffset: new Date().getTimezoneOffset() * -1,
        };

        console.log(data);

        dispatch(createCalendar(data))
          .unwrap()
          .then(() => onClose());
      }
    } else {
      console.log(calendarForm.start);
      console.log(calendarForm.end);
      setSnackbarContent('올바른 날짜를 입력하세요');
      setVisibleSnackbar(true);
      return;
    }
  };

  return (
    <Provider locale={enUS}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          width: '100%',
        }}>
        <WhiteSpace size="lg" />
        <Flex justify="around" style={{marginBottom: height * 20}}>
          <Icon
            name="md-caret-back-outline"
            size={30}
            color={'#ff6e6e'}
            onPress={onClose}></Icon>
          <Text
            style={{
              fontSize: 24,
              color: 'black',
              fontFamily: 'TheJamsilOTF_Regular',
            }}>
            カレンダー作成
          </Text>
          <Pressable
            style={{
              paddingVertical: 5,
              paddingEnd: 10,
            }}
            onPress={onSubmitCalendarForm}>
            <Text
              style={{
                color: '#ff6e6e',
                fontSize: 18,
                fontWeight: '600',
                fontFamily: 'TheJamsilOTF_Regular',
              }}>
              保存
            </Text>
          </Pressable>
        </Flex>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: '100%',
          }}>
          <WingBlank>
            <View style={{paddingStart: 15, marginBottom: height * 15}}>
              <Flex style={{gap: 15, marginBottom: height * 10}}>
                <Icon name="heart" size={18} color={colors.iconPink} />
                <Text
                  style={{
                    fontSize: 21,
                    color: 'black',
                    fontFamily: 'TheJamsilOTF_Regular',
                    paddingVertical: 10,
                  }}>
                  情報
                </Text>
              </Flex>

              <TextInput
                onChangeText={e => {
                  setCalendarForm({...calendarForm, title: e});
                }}
                value={calendarForm?.title}
                placeholderTextColor={'#666'}
                style={styles.inputStyle}
                placeholder="タイトル"></TextInput>
              <TextInput
                onChangeText={e => {
                  setCalendarForm({...calendarForm, description: e});
                }}
                value={calendarForm?.description}
                placeholderTextColor={'#666'}
                style={styles.inputStyle}
                placeholder="ラベル"></TextInput>
              <TextInput
                onChangeText={e => {
                  setCalendarForm({...calendarForm, location: e});
                }}
                value={calendarForm?.location}
                placeholderTextColor={'#666'}
                style={styles.inputStyle}
                placeholder="場所"></TextInput>
            </View>
            <Flex
              justify="between"
              style={{marginVertical: height * 10, paddingStart: 15}}>
              <Flex style={{}}>
                <Icon name="heart" size={18} color={colors.iconPink} />
                <Text
                  style={{
                    fontSize: 21,
                    color: 'black',
                    fontFamily: 'TheJamsilOTF_Regular',
                    marginStart: 15,
                  }}>
                  一日中
                </Text>
              </Flex>

              <Switch
                onChange={() => {
                  setIsAllDay(!isAllDay);
                  switchVisible(false, false, false, false);
                }}
                value={isAllDay}></Switch>
            </Flex>
            <DatePickerTitle
              isAllDay={isAllDay}
              title="開始"
              date={calendarForm?.start}
              onPressDate={() =>
                switchVisible(!visibleStartDate, false, false, false)
              }
              onPressTime={() => {
                switchVisible(false, !visibleStartTime, false, false);
              }}
              //time={calendarForm.start}
            ></DatePickerTitle>
            {visibleStartDate && (
              <CalendarDatePicker
                onChange={e => {
                  console.log('start 날짜가 변함 ', e);
                  setStartInfo({...startInfo, date: e});
                }}
                currDate={calendarForm.start}
                mode="date"></CalendarDatePicker>
            )}
            {visibleStartTime && (
              <CalendarDatePicker
                onChange={e => {
                  setStartInfo({...startInfo, time: e});
                }}
                currDate={calendarForm.start}
                mode="time"></CalendarDatePicker>
            )}

            <DatePickerTitle
              title="終了"
              isAllDay={isAllDay}
              date={calendarForm?.end}
              onPressDate={() => {
                switchVisible(false, false, !visibleEndDate, false);
              }}
              onPressTime={() => {
                switchVisible(false, false, false, !visibleEndTime);
              }}></DatePickerTitle>

            {visibleEndDate && (
              <CalendarDatePicker
                onChange={e => {
                  setEndInfo({...endInfo, date: e});
                }}
                currDate={calendarForm.end}
                mode="date"></CalendarDatePicker>
            )}
            {visibleEndTime && (
              <CalendarDatePicker
                onChange={e => {
                  setEndInfo({...endInfo, time: e});
                }}
                currDate={calendarForm.end}
                mode="time"></CalendarDatePicker>
            )}

            {/* <Flex justify="between">
              <Text
                style={{
                  fontSize: 24,
                  color: 'black',
                  fontFamily: 'TheJamsilOTF_Regular',
                  marginStart: 15,
                }}>
                반복
              </Text>
              <Pressable onPress={() => setVisibleRepeatModal(true)}>
                <Text>버튼클릭</Text>
              </Pressable>
            </Flex> */}
          </WingBlank>
        </ScrollView>
      </View>
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => {
          setVisibleSnackbar(false);
          setSnackbarContent('');
        }}
        duration={2500}>
        {snackbarContent}
      </Snackbar>
    </Provider>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    fontSize: 20,
    fontFamily: 'TheJamsilOTF_Light',
    marginBottom: 10,
  },
});

export default WriteCalendar;
