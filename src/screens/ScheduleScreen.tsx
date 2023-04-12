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

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Pressable} from 'react-native';
import FloatingButton from '../components/FloatingButton';
import {height} from '../config/globalStyles';

const ScheduleScreen = ({route, navigation}) => {
  const [scheduleList, setScheduleList] = useState(null);
  const [displayScheduleList, setDisplayScheduleList] = useState([]);

  const onLoadSchedules = React.useCallback(async (clg?) => {
    console.log(clg);
    console.log('나 그만불러');
    //await AsyncStorage.removeItem('schedules');
    const data = JSON.parse(await AsyncStorage.getItem('schedules'));
    if (data) {
      let sortedData = data.sort(orderFunction);
      setScheduleList(sortedData);
      // setScheduleList(data);
      // let d = data.sort(orderFunction);
      // setDisplayScheduleList(d);
    }
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

  const onChangeSwitch = React.useCallback(
    async data => {
      console.log(data);
      let list = scheduleList;
      const index = scheduleList.findIndex(item => item.id === data.id);

      data.isScheduleOn = !data.isScheduleOn;

      list[index] = data;
      await AsyncStorage.setItem('schedules', JSON.stringify(list));
      await onLoadSchedules('왜이래');
    },
    [scheduleList],
  );

  const onSwipeDelete = React.useCallback(async data => {
    const filteredSchedules = scheduleList.filter(item => item.id !== data.id);
    await AsyncStorage.setItem('schedules', JSON.stringify(filteredSchedules));
    await onLoadSchedules('swipe');
  }, []);

  // useEffect(() => {
  //   const orderedScheduleList = scheduleList?.sort(orderFunction);
  //   setDisplayScheduleList(orderedScheduleList);
  // }, [scheduleList]);

  // const fetchGetSoundList = navigation.addListener('focus', () => {
  //   onLoadSchedules('fetchSoundList');
  // });

  // React.useEffect(() => {
  //   onLoadSchedules('useEffect');
  //   return () => fetchGetSoundList();
  // }, []);

  useEffect(() => {
    navigation.addListener(
      'focus',
      async () => await onLoadSchedules('우아앙'),
    );
    //onLoadSchedules();
  }, []);

  const NavigateToCalendar = () => {
    console.log('헤헤');
  };

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          backgroundColor: 'white',
        }}>
        <Title
          title="Schedule"
          onPress={() => navigation.navigate('calendar')}></Title>

        <WingBlank style={{}}>
          <ScrollView
            contentContainerStyle={{paddingBottom: '50%'}}
            style={{minHeight: '100%'}}>
            {!(
              (Array.isArray(scheduleList) && scheduleList.length === 0) ||
              !scheduleList
            ) ? (
              scheduleList?.map((item, i) => {
                console.log('scheduleList 맵함수 : ', i, item.isScheduleOn);
                const date = new Date(item.time);
                const h =
                  10 > date.getHours()
                    ? '0' + date.getHours()
                    : date.getHours();
                const m =
                  10 > date.getMinutes()
                    ? '0' + date.getMinutes()
                    : date.getMinutes();

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
                    <List.Item
                      extra={
                        <Pressable onPress={e => onChangeSwitch(item)}>
                          {item.isScheduleOn === true ? (
                            <Icon
                              size={25}
                              color={'#ff6e6e'}
                              name="heart"></Icon>
                          ) : (
                            <Icon
                              size={25}
                              color={'#ff6e6e'}
                              name="heart-o"></Icon>
                          )}
                        </Pressable>
                      }>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('scheduleModal', {
                            type: 'EDIT',
                            data: item,
                          })
                        }>
                        <WingBlank>
                          <Flex>
                            <Text
                              style={{
                                fontSize: 32,
                                color: '#444',
                                fontFamily: 'IMcreSoojinOTF',
                                paddingTop: height * 20,
                              }}>
                              {h} {`:`} {m}
                            </Text>
                          </Flex>
                          {item.repeat.length > 0 && (
                            <Text
                              style={{
                                fontSize: 13,
                                color: 'black',
                                marginTop: 5,
                                fontFamily: 'TheJamsilOTF_Light',
                                marginBottom: 3,
                              }}>
                              {item.sentence}
                            </Text>
                          )}

                          {/* {item.soundFile.uri && (
                            <Text style={{fontSize: 12, color: 'gray'}}>
                              {item.soundFile.name}
                            </Text>
                          )} */}
                        </WingBlank>
                      </Pressable>
                    </List.Item>
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
            navigation.navigate('scheduleModal', {type: 'CREATE'});
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

export default ScheduleScreen;
