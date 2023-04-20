import {DatePickerView, Text, WingBlank} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import Title from '../Title';
import {SafeAreaView} from 'react-native';
import {height} from '../../config/globalStyles';
import DatePicker from 'react-native-date-picker';
import {DateTime} from 'luxon';

const CalendarItem = ({mode, currDate, onChange}) => {
  const [startDate, setStartDate] = useState(new Date(currDate));

  const onChangeStartDate = e => {
    const dateTime = DateTime.fromJSDate(e);
    setStartDate(e);
    const h = dateTime.c.hour;
    const m = dateTime.c.minute;
    if (mode === 'time') {
      onChange({h, m});
    } else {
      onChange(e);
    }
    // if (mode == 'time') {
    //   const h = Number(e[0]);
    //   const m = Number(e[1]);

    //   setStartDate(new Date(2020, 1, 1, h, m));
    // } else {
    //   let y = Number(e[0]);
    //   console.log(y);
    //   let m = Number(e[1]);
    //   let d = Number(e[2]);
    //   if (y === 2030) {
    //     y = 2029;
    //     m = 11;
    //     d = 31;
    //   }
    //   setStartDate(new Date(y, m, d));
    //   onChange(new Date(y, m, d));
    //}

    //setStartObj({...startObj, year: y, month: m, date: d});
  };

  return (
    <SafeAreaView
      style={{
        marginTop: height * 20,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      {/* <DatePickerView
        nestedScrollEnabled
        onValueChange={onChangeStartDate}
        itemStyle={{
          borderRadius: 30,
          marginTop: 10,
        }}
        defaultDate={startDate}
        value={startDate}
        // minDate={minDate}
        mode={mode}></DatePickerView> */}
      <DatePicker
        mode={mode}
        onDateChange={onChangeStartDate}
        date={startDate}></DatePicker>
    </SafeAreaView>
  );
};
export default CalendarItem;
