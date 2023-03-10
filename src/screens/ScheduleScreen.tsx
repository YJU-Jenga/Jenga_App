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
} from '@ant-design/react-native';
import React from 'react';
import Title from '../components/Title';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';

const ScheduleScreen = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [value12hours, setValue12hours] = React.useState(new Date());
  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}>
        <Title title="Alarm"></Title>

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
                onPress={() => setVisibleModal(true)}
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

        <Modal
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
            {/* <Button
                type="primary"
                onPress={() => Toast.info('Hello Toast in Modal now works')}>
                Hello Toast in Modal now works
              </Button> */}
            <WingBlank size="lg">
              <DatePickerView
                mode="time"
                value={value12hours}
                onChange={v => setValue12hours(v)}
                use12Hours
              />

              <List>
                <List.Item arrow="horizontal">반복</List.Item>
                <List.Item arrow="horizontal">액션</List.Item>
                <List.Item>명령어</List.Item>
              </List>
              <WhiteSpace size="xl" />
              <Button
                title="DELETE"
                color="red"
                onPress={() => setVisibleModal(false)}></Button>

              <WhiteSpace></WhiteSpace>
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

export default ScheduleScreen;
