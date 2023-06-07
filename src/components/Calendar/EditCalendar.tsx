import React, {useEffect} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
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

import {useSelector, useDispatch} from 'react-redux';
import {useState} from 'react';
import CalendarDatePicker from './CalendarDatePicker';
import DatePickerTitle from './DatePickerTitle';
import {DateTime} from 'luxon';
import {
  createCalendar,
  deleteCalendar,
  initCalendarErrorMessage,
  selectCalendarErrorMsg,
  updateCalendar,
} from '../../utils/redux/calendarSlice';
import {Snackbar} from 'react-native-paper';
import DeleteButton from '../DeleteButton';
const EditCalendar = ({editItem, ui, onClose}) => {
  const utcOffset = new Date().getTimezoneOffset() * -1;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [calendarForm, setCalendarForm] = useState<ICalendarForm>({
    id: editItem.id,
    userId: ui.id,
    title: editItem.title,
    start: new Date(new Date(editItem.start).getTime() - utcOffset * 60000),
    end: new Date(new Date(editItem.end).getTime() - utcOffset * 60000),
    location: editItem.location,
    description: editItem.description,
  });

  const [startInfo, setStartInfo] = useState<object>({
    date: new Date(editItem.start),
    time: {
      h: new Date(editItem.start).getUTCHours(),
      m: new Date(editItem.start).getUTCMinutes(),
    },
  });

  const [endInfo, setEndInfo] = useState<object>({
    date: new Date(editItem.end),
    time: {
      h: new Date(editItem.end).getUTCHours(),
      m: new Date(editItem.end).getUTCMinutes(),
    },
  });
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [visibleStartDate, setVisibleStartDate] = useState<boolean>(false);
  const [visibleStartTime, setVisibleStartTime] = useState<boolean>(false);
  const [visibleEndDate, setVisibleEndDate] = useState<boolean>(false);
  const [visibleEndTime, setVisibleEndTime] = useState<boolean>(false);
  const [visibleRepeatModal, setVisibleRepeatModal] = useState<boolean>(false);

  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<string>('');

  const dispatch = useDispatch();

  const switchVisible = (sd, st, ed, et) => {
    setVisibleStartDate(sd);
    setVisibleStartTime(st);
    setVisibleEndDate(ed);
    setVisibleEndTime(et);
  };

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

  const onUpdateCalendar = () => {
    if (calendarForm.title === '') {
      setSnackbarContent('제목을 입력해주세요.');
      setVisibleSnackbar(true);
      return;
    }

    if (calendarForm.description === '') {
      setSnackbarContent('설명을 입력해주세요.');
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
      let startDate;
      let endDate;
      let startTime;
      let endTime;
      if (isAllDay) {
        console.log(calendarForm.start);
        startDate = startInfo.date;
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = endInfo.date;
        endDate.setUTCHours(23, 59, 59, 999);
      } else {
        const startDate = new Date(startInfo.date);

        // Date 객체에 시간 값 설정
        startDate.setHours(startInfo.time.h, startInfo.time.m);

        console.log(startDate);

        console.log('이제끝니');
        console.log(startInfo);
        console.log(startDate);
        // startDate.setHours(startInfo.time.h, startInfo.time.m, 0, 0);
        endDate = DateTime.fromJSDate(endInfo.date, {zone: timeZone}).set({
          hours: endInfo.time.h,
          minutes: endInfo.time.m,
        });

        // endDate.setHours(endInfo.time.h, endInfo.time.m, 0, 0);
        if (startDate >= endDate) {
          setSnackbarContent('종료 시간을 늦춰주세요');
          setVisibleSnackbar(true);
          return;
        }
      }
      console.log('dmddodododoo');
      console.log(startDate);
      console.log(endDate);

      console.log('슈드낫비엠띠');
      const data = {
        ...calendarForm,
        userId: ui.id,
        utcOffset: new Date().getTimezoneOffset() * -1,
      };

      //return;

      dispatch(updateCalendar(data))
        .unwrap()
        .then(() => onClose());
    } else {
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
            일정 편집
          </Text>
          <Pressable
            style={{
              paddingVertical: 5,
              paddingEnd: 10,
            }}
            onPress={onUpdateCalendar}>
            <Text
              style={{
                color: '#ff6e6e',
                fontSize: 18,
                fontWeight: '600',
                fontFamily: 'TheJamsilOTF_Regular',
              }}>
              편집
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
                    fontSize: 24,
                    color: 'black',
                    fontFamily: 'TheJamsilOTF_Regular',
                    paddingVertical: 10,
                  }}>
                  일정 정보
                </Text>
              </Flex>
              <TextInput
                onChangeText={e => {
                  setCalendarForm({...calendarForm, title: e});
                }}
                value={calendarForm?.title}
                placeholderTextColor={'#666'}
                style={styles.inputStyle}
                placeholder="제목"></TextInput>
              <TextInput
                onChangeText={e => {
                  setCalendarForm({...calendarForm, description: e});
                }}
                value={calendarForm?.description}
                placeholderTextColor={'#666'}
                style={styles.inputStyle}
                placeholder="설명"></TextInput>
              <TextInput
                onChangeText={e => {
                  setCalendarForm({...calendarForm, location: e});
                }}
                value={calendarForm?.location}
                placeholderTextColor={'#666'}
                style={styles.inputStyle}
                placeholder="장소"></TextInput>
            </View>

            <Flex
              justify="between"
              style={{marginVertical: height * 10, paddingStart: 15}}>
              <Flex style={{}}>
                <Icon name="heart" size={18} color={colors.iconPink} />
                <Text
                  style={{
                    fontSize: 24,
                    color: 'black',
                    fontFamily: 'TheJamsilOTF_Regular',
                    marginStart: 15,
                  }}>
                  하루종일
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
              title="시작"
              date={calendarForm?.start}
              onPressDate={() =>
                switchVisible(!visibleStartDate, false, false, false)
              }
              onPressTime={() => {
                switchVisible(false, !visibleStartTime, false, false);
              }}></DatePickerTitle>
            {visibleStartDate && (
              <CalendarDatePicker
                onChange={e => {
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
              title="종료"
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
                  console.log(e);
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
            <DeleteButton
              onPress={() =>
                dispatch(deleteCalendar(editItem.id))
                  .unwrap()
                  .then(() => onClose())
              }></DeleteButton>
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

export default EditCalendar;
