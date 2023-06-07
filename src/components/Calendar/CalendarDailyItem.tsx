import React, {PureComponent, useEffect} from 'react';
import {Flex, List} from '@ant-design/react-native';
import {View} from 'react-native';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/globalStyles';
const CalendarDailyItem = ({data, removeCalendar, updateCalendar}) => {
  const hour = new Date(data.strat).getHours();

  const generateDate = (date: Date) => {
    const mm = (date?.getUTCMonth() + 1).toString().padStart(2, '0');
    const dd =
      date?.getUTCDate() <= 10
        ? '0' + date?.getUTCDate()
        : date?.getUTCDate().toString();
    return `${mm}/${dd}`;
  };

  const generateTime = (date: Date) => {
    const h =
      date.getUTCHours() < 10
        ? '0' + date.getUTCHours()
        : date.getUTCHours().toString();
    const m =
      date.getUTCMinutes() < 10
        ? '0' + date.getUTCMinutes()
        : date.getUTCMinutes();
    return `${h}:${m}`;
  };

  const utcOffset = new Date().getTimezoneOffset() * -1;
  // const start = new Date(
  //   new Date(data.start).getTime() - utcOffset * 60000,
  // ).toString();
  // const end = new Date(
  //   new Date(data.end).getTime() - parseInt(utcOffset) * 60000,
  // ).toString();

  const startDate =
    generateDate(new Date(data.start)) +
    ' ' +
    generateTime(new Date(data.start));

  const endDate =
    generateDate(new Date(data.end)) + ' ' + generateTime(new Date(data.end));

  useEffect(() => {}, [data]);
  return (
    <List.Item onPress={updateCalendar}>
      <Flex>
        <Flex.Item>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'space-between',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 18,
                fontFamily: 'TheJamsilOTF_Regular',
                marginVertical: 5,
                color: 'black',
              }}>
              {data.title}
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              marginBottom: 5,
            }}>
            {/* <Icon name="alarm" size={16} color={colors.iconPink} /> */}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                color: '#888',
                fontFamily: 'TheJamsilOTF_Light',
                marginBottom: 5,
              }}>
              {startDate}
              {'   ~ '}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                color: '#888',
                fontFamily: 'TheJamsilOTF_Light',
                marginBottom: 5,
              }}>
              {endDate}
            </Text>
          </View>

          <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
            <Icon
              name="comment-processing-outline"
              size={18}
              color={colors.iconPink}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 18,
                marginEnd: 10,
                color: '#555',
                fontFamily: 'TheJamsilOTF_Light',
                marginBottom: 5,
              }}>
              {data.description}
            </Text>
          </View>

          <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
            <Icon name="map-marker" size={18} color={colors.iconPink} />
            <Text
              style={{
                fontSize: 18,
                color: '#555',
                fontFamily: 'TheJamsilOTF_Light',
                marginBottom: 5,
              }}>
              {data.location}
            </Text>
          </View>
        </Flex.Item>
        <Icon
          onPress={() => removeCalendar(data.id)}
          name="delete"
          size={30}
          color={colors.red}
        />
      </Flex>
    </List.Item>
  );
};
export default React.memo(CalendarDailyItem);
