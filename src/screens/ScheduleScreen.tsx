import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import {
  Provider,
  Flex,
  WingBlank,
  List,
  SwipeAction,
  Button,
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
      setScheduleList(data);
      let d = data.sort(orderFunction);
      setDisplayScheduleList(d);
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
      let list = displayScheduleList;
      const index = displayScheduleList.findIndex(item => item.id === data.id);

      data.isScheduleOn = !data.isScheduleOn;

      list[index] = data;
      await AsyncStorage.setItem('schedules', JSON.stringify(list));
      onLoadSchedules('왜이래');
    },
    [displayScheduleList],
  );

  const onSwipeDelete = React.useCallback(
    async data => {
      const filteredSchedules = displayScheduleList.filter(
        item => item.id !== data.id,
      );
      await AsyncStorage.setItem(
        'schedules',
        JSON.stringify(filteredSchedules),
      );
      onLoadSchedules('swipe');
    },
    [displayScheduleList],
  );

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
    navigation.addListener('focus', () => onLoadSchedules('우아앙'));
    //onLoadSchedules();
  }, []);

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          backgroundColor: 'white',
        }}>
        <Title title="Schedule"></Title>

        <WingBlank>
          <ScrollView
            contentContainerStyle={{paddingBottom: '50%'}}
            style={{minHeight: '100%'}}>
            {!(
              Array.isArray(displayScheduleList) &&
              displayScheduleList.length === 0
            ) ? (
              displayScheduleList.map((item, i) => {
                console.log('진짜 이거 왜이럼 : ', i, item.isScheduleOn);
                const date = new Date(item.time);
                const h =
                  10 > date.getHours()
                    ? '0' + date.getHours()
                    : date.getHours();
                console.log('sdfsdf', h % 12);
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
                        // </Button> //   {item.isScheduleOn.toString()} // <Button onPress={e => onChangeSwitch(item)}> // /> //   value={item.isScheduleOn} //   // }} //   //   onChangeSwitch(e, item); //   // onChange={e => { //   }} //     onChangeSwitch(e, item); //   onValueChange={e => { // <Switch
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
                            <Text style={{fontSize: 32, color: 'black'}}>
                              {h} {`:`} {m}
                            </Text>
                          </Flex>
                          {item.sentence.length > 0 && (
                            <Text style={{fontSize: 18, color: 'gray'}}>
                              {item.sentence}
                            </Text>
                          )}
                          {item.soundFile.uri && (
                            <Text style={{fontSize: 18, color: 'gray'}}>
                              {item.soundFile.name}
                            </Text>
                          )}
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
