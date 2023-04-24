import React, {PureComponent, useEffect} from 'react';
import {Flex, List} from '@ant-design/react-native';
import {View} from 'react-native';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/globalStyles';
import {DateTime} from 'luxon';

const CalendarDailyItem = ({data, removeCalendar, updateCalendar}) => {
  const startDate = DateTime.fromISO(data.start).toFormat('MM/dd HH:mm');
  const endDate = DateTime.fromISO(data.end).toFormat('MM/dd HH:mm');

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

      {/* <Text
                  onPress={() => {
                    setVisibleModal(true);
                    setMode('EDIT');
                    setEditItem(item);
                  }}>
                  수정
                </Text> */}
    </List.Item>
  );
};
export default React.memo(CalendarDailyItem);