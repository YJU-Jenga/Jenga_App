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
import {height} from '../../config/globalStyles';

import {useSelector, useDispatch} from 'react-redux';
import {useState} from 'react';
import CalendarDatePicker from './CalendarDatePicker';
import DatePickerTitle from './DatePickerTitle';
import {DateTime} from 'luxon';
import {
  createCalendar,
  initCalendarErrorMessage,
  selectCalendarErrorMsg,
  updateCalendar,
} from '../../utils/redux/calendarSlice';
import {Snackbar} from 'react-native-paper';
const EditCalendar = ({editItem, ui, onClose}) => {
  const [calendarForm, setCalendarForm] = useState<ICalendarForm>({
    id: editItem.id,
    userId: ui.id,
    title: editItem.title,
    // start: new Date(currDate).toISOString(),
    start: DateTime.fromISO(new Date(editItem.start).toISOString(), {
      zone: 'Asia/Seoul',
    }),
    end: DateTime.fromISO(new Date(editItem.end).toISOString(), {
      zone: 'Asia/Seoul',
    }),
    location: editItem.location,
    description: editItem.description,
  });

  const [startInfo, setStartInfo] = useState<object>({
    date: new Date(editItem.start),
    time: {
      h: DateTime.fromJSDate(new Date(editItem.start)).c.hour,
      m: DateTime.fromJSDate(new Date(editItem.start)).c.minute,
    },
  });
  const [endInfo, setEndInfo] = useState<object>({
    date: new Date(editItem.end),
    time: {
      h: DateTime.fromJSDate(new Date(editItem.end)).c.hour,
      m: DateTime.fromJSDate(new Date(editItem.end)).c.minute,
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
  //   createdAt: '2023-04-19T07:44:18.527Z';
  //   description: '암루우우절';
  //   end: '2023-04-19T05:00:00.000Z';
  //   id: 2;
  //   location: '콘서트장';
  //   start: '2023-04-18T15:00:00.000Z';
  //   title: '암어써쳐루저';
  //   updatedAt: '2023-04-19T07:44:18.527Z';
  //   userId: 1;

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
    if (endInfo.date >= startInfo.date) {
      let startDate;
      let endDate;
      if (isAllDay) {
        console.log(calendarForm.start);
        startDate = startInfo.date;
        startDate.setHours(0, 0, 0, 0);
        endDate = endInfo.date;
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = startInfo.date;
        console.log(startInfo);
        console.log(endInfo);
        startDate.setHours(startInfo.time.h, startInfo.time.m, 0, 0);
        endDate = endInfo.date;
        endDate.setHours(endInfo.time.h, endInfo.time.m, 0, 0);
        if (startDate >= endDate) {
          setSnackbarContent('종료 시간을 늦춰주세요');
          setVisibleSnackbar(true);
          return;
        }
      }

      const data = {
        ...calendarForm,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };

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
          paddingTop: 12,
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
              <Text
                style={{
                  fontSize: 24,
                  color: 'black',
                  fontFamily: 'TheJamsilOTF_Regular',
                  paddingVertical: 10,
                }}>
                일정 정보
              </Text>
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

            <Flex justify="between" style={{marginVertical: height * 10}}>
              <Text
                style={{
                  fontSize: 24,
                  color: 'black',
                  fontFamily: 'TheJamsilOTF_Regular',
                  marginStart: 15,
                }}>
                하루종일
              </Text>
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
                  console.log(e);
                  setStartInfo({...startInfo, date: e});
                }}
                currDate={calendarForm.start}
                mode="date"></CalendarDatePicker>
            )}
            {visibleStartTime && (
              <CalendarDatePicker
                onChange={e => {
                  console.log(e);
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

    marginVertical: 10,
  },
});

export default EditCalendar;
