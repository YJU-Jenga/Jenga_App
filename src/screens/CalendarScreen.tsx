import {Flex, List} from '@ant-design/react-native';
import * as React from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Ionicons} from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import CreateCalendar from '../components/CreateCalendar';
import Title from '../components/Title';
const CalendarScreen = ({navigation}) => {
  const data = [
    {id: 1, title: 'dummy1'},
    {id: 2, title: 'dummy2'},
  ];
  const [date, setDate] = React.useState(new Date());
  const [currDate, setCurrDate] = React.useState<string>();

  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

  const formatCurrentDate = React.useCallback(
    date => {
      const yyyy = date?.getFullYear().toString();
      const mm =
        date?.getMonth() + 1 < 10
          ? '0' + (date?.getMonth() + 1)
          : date?.getMonth() + 1;
      const dd =
        date?.getDate() < 10
          ? '0' + date?.getDate()
          : date?.getDate().toString();

      setCurrDate(yyyy + '-' + mm + '-' + dd);
      console.log('포맷실행');
    },
    [currDate],
  );

  React.useEffect(() => {
    formatCurrentDate(date);
  }, [date]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title
        onPress={() => navigation.navigate('schedule')}
        title="Monthly"></Title>
      <Calendar
        onDayPress={day => {
          console.log(day);
          setCurrDate(day.dateString);
        }}
        markedDates={{
          [currDate]: {
            selected: true,
            disableTouchEvent: true,
          },
        }}
        style={styles.calendar}
      />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            paddingVertical: 15,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontFamily: 'TheJamsilOTF_Regular',
            }}>
            {currDate}
          </Text>
        </View>
        <FlatList
          data={data}
          //   ListHeaderComponent={HeaderComponent()}
          renderItem={({item, index}) => (
            <List.Item key={item.id}>
              <Text>{item.title}</Text>
            </List.Item>
          )}></FlatList>
      </SafeAreaView>
      <FloatingButton
        color={'#b8dff8'}
        onPress={() => {
          setVisibleModal(true);
        }}></FloatingButton>
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={() => {
          setVisibleModal(false);
        }}
        visible={visibleModal}>
        <CreateCalendar onClose={() => setVisibleModal(false)}></CreateCalendar>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default CalendarScreen;
