import React, {useEffect, useState} from 'react';

import {Pressable, StyleSheet, Text, DeviceEventEmitter} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserData} from '../../utils/redux/userSlice';
import {Agenda} from 'react-native-calendars';
import {
  SelectCalendarData,
  getMonthCalendar,
} from '../../utils/redux/calendarSlice';

const WeeklyCalendar = ({currDate, userId}) => {
  const dispatch = useDispatch();
  const _calendarData = useSelector(SelectCalendarData);
  const [calendarData, setCalendarData] = React.useState();
  const onMonthChange = time => {
    const y = time.year;
    // month 는 1빼줘야하는듯,,
    const m = time.month - 1;
    const d = time.day;
    const obj = {
      userId: userId,
      dateString: new Date(y, m, d).toISOString(),
    };
    dispatch(getMonthCalendar(obj));
  };

  useEffect(() => {
    const obj = {userId: userId, dateString: new Date().toISOString()};
    dispatch(getMonthCalendar(obj));
  }, [userId]);

  useEffect(() => {
    //setCalendarData(_calendarData);
    let obj = {};
    _calendarData.forEach(item => {
      // let key = item.start;
      const formattedDate = item.start.split('T')[0];

      obj[formattedDate] = item;
    });
    console.log(obj);
    setCalendarData(obj);
    //displayCalendar(calendarData);
  }, [_calendarData]);

  useEffect(() => {
    console.log(calendarData);
  }, [calendarData]);

  const _userData = useSelector(selectUserData);

  const renderItem = item => {
    console.log(item);
    return (
      <Pressable>
        <Text>안녕</Text>
      </Pressable>
    );
  };
  return (
    <>
      <Agenda
        //
        loadItemsForMonth={onMonthChange}
        items={calendarData}
        selected={'2023-04-18'}
        //refreshControl={null}
        showClosingKnob={true}
        //   showClosingKnob={false}
        refreshing={false}
        renderItem={renderItem}
        theme={{
          backgroundColor: 'white',
          calendarBackground: 'white',
        }}></Agenda>
    </>
  );
};
export default WeeklyCalendar;
