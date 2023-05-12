import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import {
  Provider,
  Flex,
  WingBlank,
  List,
  SwipeAction,
  Button,
  Switch,
} from '@ant-design/react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Title from '../components/Title';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Pressable} from 'react-native';
import FloatingButton from '../components/FloatingButton';
import {colors, height} from '../config/globalStyles';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  createAlarm,
  getAllAlarm,
  selectAlarmData,
  updateAlarm,
} from '../utils/redux/alarmSlice';

const AlarmScreen = ({ui}) => {
  const [scheduleList, setScheduleList] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const _alarmData = useSelector(selectAlarmData);

  useEffect(() => {
    let sortedData = [..._alarmData].sort(orderFunction);
    setScheduleList(sortedData);
  }, [_alarmData]);

  const onLoadSchedules = React.useCallback(async () => {
    dispatch(getAllAlarm(ui.id));
    //const orderedScheduleList = JSON.parse(data).sort(orderFunction);
    //setDisplayScheduleList(orderedScheduleList)
  }, []);

  const orderFunction = (a, b) => {
    const num1 =
      new Date(a.time).getHours() * 3600 + new Date(a.time).getMinutes() * 60;

    const num2 =
      new Date(b.time).getHours() * 3600 + new Date(b.time).getMinutes() * 60;

    return num1 > num2 ? 1 : -1;
  };

  const onChangeSwitch = React.useCallback(async data => {
    dispatch(updateAlarm({...data, state: !data.state}));
    await onLoadSchedules();
  }, []);

  const onSwipeDelete = React.useCallback(async data => {
    const filteredSchedules = scheduleList.filter(item => item.id !== data.id);
    await AsyncStorage.setItem('schedules', JSON.stringify(filteredSchedules));
    await onLoadSchedules();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onLoadSchedules = async () => {
        try {
          dispatch(getAllAlarm(ui.id));
        } catch (error) {
          console.log(error);
        }
      };
      onLoadSchedules();
      return () => {};
    }, [ui]),
  );

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          backgroundColor: 'white',
        }}>
        <Title
          title="Alarm"
          // onPress={() => navigation.navigate('calendar')}
        ></Title>

        <WingBlank style={{}}>
          <ScrollView
            contentContainerStyle={{paddingBottom: '30%'}}
            style={{minHeight: '100%'}}>
            {!(
              (Array.isArray(scheduleList) && scheduleList.length === 0)
              // ||
              // !scheduleList
            ) ? (
              _alarmData.map((item, i) => {
                let repeat = ['일', '월', '화', '수', '목', '금', '토'];
                let currRepeat = '';
                // const repeatData = item.repeat
                //   .split('')
                //   .map((isChecked, index) => {
                //     if (isChecked === '1') {
                //       currRepeat = currRepeat.concat(repeat[index] + ' ');
                //       return repeat[index];
                //     }
                //     return null;
                //   })
                //   .filter(day => day !== null);

                const h = item.time_id.slice(0, 2);
                const m = item.time_id.slice(2, 4);

                const name = item.name;

                return (
                  <SwipeAction
                    key={i}
                    right={[
                      {
                        text: 'X',
                        onPress: () => onSwipeDelete(item),
                        backgroundColor: 'red',
                        color: 'white',
                      },
                    ]}>
                    <View key={i}>
                      <List.Item
                        extra={
                          <Pressable onPress={e => onChangeSwitch(item)}>
                            {item.state === true ? (
                              <Icon
                                size={25}
                                color={colors.iconPink}
                                name="heart"></Icon>
                            ) : (
                              <Icon
                                size={25}
                                color={colors.iconPink}
                                name="heart-o"></Icon>
                            )}
                          </Pressable>
                        }>
                        <Pressable
                          onPress={() =>
                            navigation.navigate('alarmModal', {
                              type: 'EDIT',
                              data: item,
                            })
                          }
                          style={{
                            paddingVertical: height * 30,
                            display: 'flex',
                          }}>
                          <View
                            style={{
                              backgroundColor: 'white',
                              display: 'flex',
                              // flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontSize: 32,
                                color: '#444',
                                fontFamily: 'IMcreSoojinOTF',
                              }}>
                              {h} {`:`} {m}
                            </Text>
                            <Flex style={{gap: 5}}>
                              {(repeat.length > 0 || item.sentence) && (
                                <Icon
                                  style={{marginEnd: 2}}
                                  color={colors.iconPink}
                                  name="quote-left"></Icon>
                              )}

                              {/* {repeat.length > 0 && (
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: '#333',
                                    marginTop: 5,
                                    fontFamily: 'TheJamsilOTF_Regular',
                                    marginBottom: 3,
                                  }}>
                                  {currRepeat}
                                  {'  '}
                                </Text>
                              )} */}
                              {item.name && (
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: '#333',
                                    marginTop: 5,
                                    fontFamily: 'TheJamsilOTF_Regular',
                                    marginBottom: 3,
                                  }}>
                                  {name}
                                </Text>
                              )}
                            </Flex>
                          </View>
                        </Pressable>
                      </List.Item>
                    </View>
                  </SwipeAction>
                );
              })
            ) : (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: height * 150,
                    fontSize: 21,
                    color: '#555',
                    marginVertical: 'auto',
                  }}>
                  추가해주세요
                </Text>
              </View>
            )}
          </ScrollView>
        </WingBlank>
        <FloatingButton
          onPress={() => {
            //dispatch(createAlarm(ui.id));
            navigation.navigate('alarmModal', {
              type: 'CREATE',
              //data: item,
            });
            //setVisibleModal(true);
          }}></FloatingButton>
      </SafeAreaView>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    fontFamily: '',
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
});

export default AlarmScreen;
