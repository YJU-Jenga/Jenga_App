import {DatePickerView, Text, WingBlank} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import Title from '../Title';
import {SafeAreaView} from 'react-native';
import {height} from '../../config/globalStyles';
import DatePicker from 'react-native-date-picker';
import {DateTime} from 'luxon';

const CalendarItem = ({mode, currDate, onChange}) => {
  const utcOffset = new Date().getTimezoneOffset() * -1;
  const [startDate, setStartDate] = useState(
    //new Date(new Date(currDate).getTime() - utcOffset * 60000),
    new Date(currDate),
  );

  const onChangeStartDate = e => {
    const dateTime = DateTime.fromJSDate(e);
    setStartDate(new Date(dateTime));
    const yyyy = e.getUTCFullYear();
    const mm = e.getUTCMonth() + 1;
    const dd = e.getUTCDate();
    const h = dateTime.c.hour;
    const m = dateTime.c.minute;
    if (mode === 'time') {
      onChange({h, m});
    } else {
      onChange(dateTime);
    }
  };

  return (
    <SafeAreaView
      style={{
        marginTop: height * 20,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <DatePicker
        mode={mode}
        onDateChange={onChangeStartDate}
        date={startDate}></DatePicker>
    </SafeAreaView>
  );
};
export default CalendarItem;
