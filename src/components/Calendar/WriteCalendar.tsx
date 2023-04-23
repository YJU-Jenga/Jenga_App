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
  const [calendarForm, setCalendarForm] = useState<ICalendarForm>({
    userId: ui.id,
    title: '',
    // start: new Date(currDate).toISOString(),
    start: DateTime.fromISO(new Date(currDate).toISOString(), {
      zone: 'Asia/Seoul',
    }),
    end: DateTime.fromISO(new Date(currDate).toISOString(), {
      zone: 'Asia/Seoul',
    }),
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

  useEffect(() => {
    if (mode === 'EDIT') {
      console.log(editItem.title);
      setCalendarForm(prevCalendarForm => ({
        ...prevCalendarForm,
        userId: editItem.userId,
        title: editItem.title,
        start: editItem.start,
        end: editItem.end,
        location: editItem.location,
        description: editItem.description,
      }));

      setStartInfo({date: new Date(editItem.start), time: {h: 0, m: 0}});
      setEndInfo({date: new Date(editItem.end), time: {h: 0, m: 0}});

      console.log('끝');
    }
  }, [mode]);

  useEffect(() => {
    console.log('호출끝', calendarForm);
  }, [setCalendarForm]);

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

  useEffect(() => {
    console.log('캘린더폼 렌더링 ', calendarForm);
  }, [calendarForm]);

  const onSubmitCalendarForm = () => {
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
        //console.log(calendarForm.start);
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
        userId: ui.id,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };

      dispatch(createCalendar(data))
        .unwrap()
        .then(() => onClose());
    } else {
      setSnackbarContent('올바른 날짜를 입력하세요');
      setVisibleSnackbar(true);
      return;
    }
  };

  useEffect(() => {
    const date = startInfo.date;
    const y = date.getFullYear();

    const m = date.getMonth();
    const d = date.getDate();
    const hours = startInfo.time?.h ? startInfo.time.h : 0;
    const minutes = startInfo.time?.m ? startInfo.time.m : 0;

    setCalendarForm({
      ...calendarForm,
      // start: DateTime.fromISO(new Date(y, m, d, hours, minutes).toISOString(), {
      //   zone: 'Asia/Seoul',
      // }),
      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
      ).toISOString(),
    });
  }, [startInfo]);

  useEffect(() => {
    const date = endInfo.date;
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const hours = endInfo.time?.h ? endInfo.time.h : 0;
    const minutes = endInfo.time?.m ? endInfo.time.m : 0;

    setCalendarForm({
      ...calendarForm,
      // end: DateTime.fromISO(new Date(y, m, d, hours, minutes).toISOString(), {
      //   zone: 'Asia/Seoul',
      // }),
      end: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
      ).toISOString(),
    });
  }, [endInfo]);

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
            {mode === 'CREATE' ? '일정 생성' : '일정 편집'}
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
              저장
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
              }}
              //time={calendarForm.start}
            ></DatePickerTitle>
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
    marginBottom: 10,
  },
});

export default WriteCalendar;
