import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Button,
  Modal,
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
import React from 'react';
import Title from '../components/Title';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScheduleScreen = ({route, navigation}) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [value12hours, setValue12hours] = React.useState(new Date());
  const [visibleRepeatModal, setVisibleRepeatModal] = React.useState(false);
  const [visibleSoundsModal, setVisibleSoundsModal] = React.useState(false);
  React.useEffect(() => {
    console.log(visibleRepeatModal);
  }, [visibleRepeatModal]);
  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}>
        <Title title="Schedule"></Title>

        <WingBlank>
          <List renderHeader="List">
            <SwipeAction
              right={[
                {
                  text: 'X',
                  onPress: () => console.log('delete'),
                  backgroundColor: 'red',
                  color: 'white',
                },
              ]}>
              <List.Item
                onPress={() => {
                  navigation.navigate('scheduleModal');
                  //setVisibleModal(true);
                  setValue12hours(new Date());
                }}
                extra={<Switch />}>
                <WingBlank>
                  <Flex>
                    <Text style={{fontSize: 18, marginEnd: 5}}>오전</Text>
                    <Text style={{fontSize: 32}}>12:30</Text>
                  </Flex>
                  <Text style={{fontSize: 18, color: 'gray'}}>"헬로 민수"</Text>
                </WingBlank>
              </List.Item>
            </SwipeAction>
            <List.Item onPress={() => setVisibleModal(true)} extra={<Switch />}>
              <WingBlank>
                <Flex>
                  <Text style={{fontSize: 18, marginEnd: 5}}>오전</Text>
                  <Text style={{fontSize: 32}}>12:30</Text>
                </Flex>
                <Text style={{fontSize: 18, color: 'gray'}}>"헬로 지토"</Text>
              </WingBlank>
            </List.Item>
            <List.Item onPress={() => setVisibleModal(true)} extra={<Switch />}>
              <WingBlank>
                <Flex>
                  <Text style={{fontSize: 18, marginEnd: 5}}>오전</Text>
                  <Text style={{fontSize: 32}}>12:30</Text>
                </Flex>
                <Text style={{fontSize: 18, color: 'gray'}}>"응ㅐ응애"</Text>
              </WingBlank>
            </List.Item>
          </List>
        </WingBlank>

        {/* <Modal
          presentationStyle="formSheet"
          visible={visibleModal}
          animationType="slide"
          onRequestClose={() => setVisibleModal(false)}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <WhiteSpace size="lg" />
            <Flex justify="around">
              <Button
                title="Back"
                onPress={() => setVisibleModal(false)}></Button>
              <Text style={{fontSize: 24}}>예약 편집</Text>
              <Button
                title="Save"
                onPress={() => setVisibleModal(false)}></Button>
            </Flex>
            <Button
                type="primary"
                onPress={() => Toast.info('Hello Toast in Modal now works')}>
                Hello Toast in Modal now works
              </Button>
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
                    setVisibleModal(false);
                    navigation.navigate('scheduleDetail');
                  }}
                  arrow="horizontal">
                  반복
                </List.Item>
                <List.Item
                  onPress={() => {
                    setVisibleModal(false);
                    navigation.navigate('scheduleDetail');
                  }}
                  arrow="horizontal">
                  액션
                </List.Item>
                <InputItem placeholder="아이에게 할 말을 입력하세요">
                  명령어
                </InputItem>
              </List>
              <WhiteSpace size="xl" />
              <Button
                title="DELETE"
                color="red"
                onPress={() => setVisibleModal(false)}></Button>

              <WhiteSpace></WhiteSpace>
            </WingBlank>
          </SafeAreaView>
        </Modal> */}
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

export default ScheduleScreen;
