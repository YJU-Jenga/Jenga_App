import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Button,
} from 'react-native';
import {
  Provider,
  Modal,
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
                12시 30분
                <WhiteSpace></WhiteSpace>
                <Text>"안녕 종율아"</Text>
              </List.Item>
            </SwipeAction>
            <List.Item onPress={() => setVisibleModal(true)} extra={<Switch />}>
              12시 30분
              <WhiteSpace></WhiteSpace>
              <Text>"안녕 종율아"</Text>
            </List.Item>
            <List.Item onPress={() => setVisibleModal(true)} extra={<Switch />}>
              12시 30분
              <WhiteSpace></WhiteSpace>
              <Text>"안녕 종율아"</Text>
            </List.Item>
          </List>
        </WingBlank>

        <Modal
          transparent={false}
          visible={visibleModal}
          animationType="slide-up"
          onClose={() => setVisibleModal(false)}>
          <SafeAreaView
            style={{
              height: '100%',
              display: 'flex',
            }}>
            <WhiteSpace size="lg" />
            <Text style={{fontSize: 24, textAlign: 'center'}}>예약 편집</Text>
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
