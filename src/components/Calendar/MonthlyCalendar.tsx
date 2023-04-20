import React, {useState} from 'react';

import {Alert, StyleSheet} from 'react-native';
import {height} from '../../config/globalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserData} from '../../utils/redux/userSlice';
import {Calendar} from 'react-native-calendars';
import {
  SelectCalendarData,
  selectCalendarErrorMsg,
} from '../../utils/redux/calendarSlice';

const MonthlyCalendar = ({onMonthChange, onDayPress, currDate, data}) => {
  console.log(data);
  const _userData = useSelector(selectUserData);
  const [displayCalendar, setDisplayCalendar] = useState();
  const _errorMessage = useSelector(selectCalendarErrorMsg);
  const [errorMessage, setErrorMessage] = React.useState('');
  const _calendarData = useSelector(SelectCalendarData);
  const [calendarData, setCalendarData] = React.useState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (errorMessage !== '') {
      Alert.alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  React.useEffect(() => {
    setCalendarData(_calendarData);
  }, [_calendarData]);

  React.useEffect(() => {
    const obj = {userId: ui.id, dateString: new Date().toISOString()};
    dispatch(getMonthCalendar(obj));
  }, [ui]);

  console.log(currDate);
  React.useEffect(() => {
    //setCalendarData(_calendarData);

    if (data) {
      let obj = {};
      data.forEach(item => {
        // let key = item.start;
        const formattedDate = item.start.split('T')[0];

        obj[formattedDate] = item;
      });
      console.log(obj);
      setDisplayCalendar(obj);
    } else {
      setDisplayCalendar({});
    }

    //displayCalendar(calendarData);
  }, [data]);
  return (
    
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default MonthlyCalendar;
