import {DatePickerView, Flex, Text, WingBlank} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, height, width} from '../../config/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const DatePickerTitle = ({onPressDate, onPressTime, title, date, isAllDay}) => {
  const [formatDate, setFormatDate] = useState();
  const [formatTime, setFormatTime] = useState();

  const format = () => {
    const data = new Date(date);

    setFormatDate(generateDate(data));
    setFormatTime(generateTime(data));
  };

  const generateDate = (date: Date) => {
    const yyyy = date?.getFullYear().toString();
    const mm = (date?.getMonth() + 1).toString().padStart(2, '0');
    const dd =
      date?.getDate() <= 10
        ? '0' + date?.getDate()
        : date?.getDate().toString();
    return `${yyyy}/${mm}/${dd}`;
  };

  const generateTime = (date: Date) => {
    const h =
      date?.getHours() < 10
        ? '0' + date?.getHours()
        : date?.getHours().toString();
    const m =
      date?.getMinutes() < 10 ? '0' + date?.getMinutes() : date?.getMinutes();
    return `${h}:${m}`;
  };

  useEffect(() => {
    format();
  }, []);

  useEffect(() => {
    format();
  }, [date]);

  return (
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
          {title}
        </Text>
      </Flex>

      <View style={{display: 'flex', flexDirection: 'row', gap: width * 10}}>
        <Pressable style={styles.datePickerContainer} onPress={onPressDate}>
          <Text style={styles.datePickerText}>{formatDate}</Text>
        </Pressable>
        {!isAllDay && (
          <Pressable style={styles.datePickerContainer} onPress={onPressTime}>
            <Text style={styles.datePickerText}>{formatTime}</Text>
          </Pressable>
        )}
      </View>
    </Flex>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
  },
  datePickerText: {
    color: '#fff',
    fontFamily: 'TheJamsilOTF_Regular',
  },
});

export default DatePickerTitle;
