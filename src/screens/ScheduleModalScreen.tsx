import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Button,
  Modal,
  BackHandler,
} from 'react-native';
import {
  Provider,
  Card,
  Toast,
  Flex,
  WhiteSpace,
  WingBlank,
  DatePickerView,
  List,
  Switch,
  SwipeAction,
  InputItem,
} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import Title from '../components/Title';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import {ActionComponent, RepeatComponent} from './ScheduleDetailScreen';

const ScheduleModalScreen = ({route, navigation}) => {
  const [value12hours, setValue12hours] = React.useState(new Date());
  const [visibleRepeatModal, setVisibleRepeatModal] = React.useState(false);
  const [visibleSoundsModal, setVisibleSoundsModal] = React.useState(false);

  const day: string[] = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];

  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}>
        <SafeAreaView
          style={{
            height: '100%',
            display: 'flex',
          }}>
          <WhiteSpace size="lg" />
          <Flex justify="around">
            <Button
              title="Back"
              onPress={() => navigation.navigate('schedule')}></Button>
            <Text style={{fontSize: 24}}>예약 편집</Text>
            <Button
              title="Save"
              onPress={() => navigation.navigate('schedule')}></Button>
          </Flex>
          <WingBlank size="lg">
            <DatePickerView
              mode="time"
              value={value12hours}
              onChange={v => setValue12hours(v)}
              use12Hours
            />

            <List>
              <List.Item
                onPress={() => {
                  setVisibleRepeatModal(true);
                  //navigation.navigate('scheduleDetail', {type: 'repeat'});
                }}
                arrow="horizontal">
                반복
              </List.Item>
              <List.Item
                onPress={() => {
                  setVisibleSoundsModal(true);
                  //navigation.navigate('scheduleDetail', {type: 'action'});
                }}
                arrow="horizontal">
                액션
              </List.Item>
              <InputItem placeholder="아이에게 할 말을 입력하세요">
                명령어
              </InputItem>
            </List>
            <WhiteSpace size="xl" />
            <Button title="DELETE" color="red"></Button>

            <WhiteSpace></WhiteSpace>
          </WingBlank>
        </SafeAreaView>

        <Modal
          presentationStyle="pageSheet"
          visible={visibleRepeatModal}
          animationType="slide"
          onRequestClose={() => setVisibleRepeatModal(false)}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <Flex
              justify="between"
              style={{marginHorizontal: 25, marginTop: 20, marginBottom: 20}}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '600',
                }}>
                반복
              </Text>
            </Flex>
            <WhiteSpace size="lg" />
            {day.map((v, i) => {
              return <RepeatComponent data={v}></RepeatComponent>;
            })}
          </SafeAreaView>
        </Modal>

        <Modal
          presentationStyle="formSheet"
          visible={visibleSoundsModal}
          animationType="slide"
          onRequestClose={() => setVisibleSoundsModal(false)}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <WingBlank size="lg">
              <Flex
                justify="between"
                style={{marginHorizontal: 10, marginTop: 20, marginBottom: 20}}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '600',
                  }}>
                  액션
                </Text>
              </Flex>
              <ActionComponent></ActionComponent>
            </WingBlank>
          </SafeAreaView>
        </Modal>
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
});

export default ScheduleModalScreen;
