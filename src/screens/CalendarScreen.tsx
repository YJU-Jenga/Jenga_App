import {Flex, List} from '@ant-design/react-native';
import * as React from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Calendar,
  CalendarList,
  CalendarProvider,
  ExpandableCalendar,
} from 'react-native-calendars';
import {Ionicons} from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import Title from '../components/Title';
import {selectUserData} from '../utils/redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {DateTime} from 'luxon';
import WriteCalendar from '../components/Calendar/WriteCalendar';
import {
  SelectCalendarData,
  deleteCalendar,
  getMonthCalendar,
  initCalendarErrorMessage,
  selectCalendarErrorMsg,
  updateCalendar,
} from '../utils/redux/calendarSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {refreshToken} from '../utils/redux/authSlice';
import CalendarDailyItem from '../components/Calendar/CalendarDailyItem';
import EditCalendar from '../components/Calendar/EditCalendar';

const CalendarScreen = ({ui}) => {
  const [date, setDate] = React.useState(new Date());
  const [currDate, setCurrDate] = React.useState<string>(
    DateTime.local().toFormat('yyyy-MM-dd'),
  );
  const [currDataList, setCurrDataList] = React.useState([]);

  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>();
  const [calendarDots, setCalendarDots] = React.useState<object>({});

  const _errorMessage = useSelector(selectCalendarErrorMsg);
  const [errorMessage, setErrorMessage] = React.useState('');
  const _calendarData = useSelector(SelectCalendarData);
  const [calendarData, setCalendarData] = React.useState();
  const [isCalendarMode, setIsCalendarMode] = React.useState(true);
  const [editItem, setEditItem] = React.useState<object>();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const title = isCalendarMode ? 'Calendar' : 'Management';

  React.useEffect(() => {
    setErrorMessage(_errorMessage);
    dispatch(initCalendarErrorMessage());
  }, [_errorMessage]);

  React.useEffect(() => {
    if (errorMessage !== '') {
      dispatch(refreshToken());
      setErrorMessage('');
    }
  }, [errorMessage]);

  useFocusEffect(
    React.useCallback(() => {
      const obj = {userId: ui.id, dateString: new Date().toISOString()};
      dispatch(getMonthCalendar(obj));
      console.log('헤헤');
    }, [dispatch, ui.id]),
  );

  React.useEffect(() => {
    setCalendarData(_calendarData);
    //convertCurrCalendar(DateTime.local().c.day);
  }, [dispatch, calendarData]);

  React.useEffect(() => {
    setCalendarData(_calendarData);
    //convertCurrCalendar(DateTime.local().c.day, _calendarData);
    console.log(_calendarData);
    convertCurrCalendar(DateTime.fromISO(currDate).c.day, _calendarData);
    if (Object.keys(_calendarData).length !== 0)
      generateCalendarDots(_calendarData);
  }, [_calendarData]);

  const executeGetMonthCalendar = () => {
    const obj = {userId: ui.id, dateString: new Date(currDate).toISOString()};
    dispatch(getMonthCalendar(obj));
  };

  React.useEffect(() => {
    executeGetMonthCalendar();
  }, [ui]);

  const removeCalendar = React.useCallback(id => {
    const obj = {
      userId: ui.id,
      dateString: new Date(currDate).toISOString(),
    };
    dispatch(deleteCalendar(id))
      .unwrap()
      .then(() => executeGetMonthCalendar());
  }, []);

  const convertCurrCalendar = React.useCallback((date: object, data) => {
    if (Object.entries(data).length === 0 || data.length === 0) {
      setCurrDataList([]);
    } else {
      const filteredData = data.filter(item1 => {
        const itemStartDate = new Date(item1.start);
        const itemEndDate = new Date(item1.end);
        // const targetDate = new Date(date);

        // console.log(date);
        // console.log(itemStartDate.getDate());

        return date >= itemStartDate.getDate() && date <= itemEndDate.getDate();
      });
      console.log(filteredData);
      setCurrDataList(currDataList => [...filteredData]);
    }
  }, []);

  React.useEffect(() => {
    if (!(Array.isArray(currDataList) && currDataList.length === 0)) {
      // arr이 빈 배열인 경우 처리할 코드
      console.log('헤헤..');
      generateCalendarDots(calendarData);
    }
  }, [currDataList]);

  React.useEffect(() => {
    console.log(calendarDots);
  }, [calendarDots]);

  const pinkCurrDate = time => {
    setCurrDate(time.dateString);
    const d = new Date(time.year, time.month, time.day);
    convertCurrCalendar(time.day, calendarData);
  };

  const onMonthChange = time => {
    const y = time.year;
    // month 는 1빼줘야하는듯,,
    const m = time.month - 1;
    const d = time.day;
    const obj = {
      userId: ui.id,
      dateString: new Date(y, m, d).toISOString(),
    };
    dispatch(getMonthCalendar(obj));
  };

  const generateCalendarDots = data => {
    let obj = {};
    console.log(data);
    data?.forEach(item => {
      // let key = item.start;
      new Date(item.start);
      const startDate = new Date(item.start);
      const endDate = new Date(item.end);

      const startDateObj = DateTime.fromJSDate(new Date(startDate));
      const endDateObj = DateTime.fromJSDate(endDate);
      const formattedDate = startDateObj.toFormat('yyyy-MM-dd');
      let currentDate = startDateObj;
      while (currentDate <= endDateObj) {
        const formattedDate = currentDate.toFormat('yyyy-MM-dd');
        obj[formattedDate] = {
          marked: true,
          //selected: formattedDate == currDate,
          selectedColor: '#f29999',
        };
        // move to next day
        currentDate = currentDate.plus({days: 1});
      }
    });
    console.log(obj);
    setCalendarDots(obj);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title
        onPress={() => {
          navigation.navigate('manageCalendar');
        }}
        title={title}></Title>

      <>
        <CalendarProvider></CalendarProvider>
        <Calendar
          customHeaderTitle={
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'TheJamsilOTF_Regular',
                marginVertical: 10,
              }}>
              {currDate}
            </Text>
          }
          current={currDate}
          onMonthChange={onMonthChange}
          onDayPress={pinkCurrDate}
          markedDates={calendarDots}
          theme={{
            selectedDayTextColor: 'blue',
            todayTextColor: '#ff6e6e',
            monthTextColor: 'black',
            arrowColor: '#ff6e6e',
            dotColor: '#ff6e6e',
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          }}
        />
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            onEndReached={() => console.log('다닿았어')}
            data={currDataList}
            renderItem={({item, index}) => (
              <CalendarDailyItem
                data={item}
                index={index}
                removeCalendar={() => removeCalendar(item.id)}
                updateCalendar={() => {
                  setEditItem(item);
                  setMode('EDIT');
                  setVisibleModal(true);
                }}></CalendarDailyItem>
            )}></FlatList>
        </SafeAreaView>
      </>

      <FloatingButton
        onPress={() => {
          setVisibleModal(true);
          setMode('CREATE');
          setEditItem(null);
        }}></FloatingButton>
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={() => {
          setVisibleModal(false);
        }}
        visible={visibleModal}>
        {mode === 'CREATE' && !editItem ? (
          <WriteCalendar
            ui={ui}
            // editItem={editItem}
            mode={mode}
            currDate={currDate}
            onClose={() => {
              setVisibleModal(false);
              executeGetMonthCalendar();
            }}></WriteCalendar>
        ) : (
          <EditCalendar
            onClose={() => {
              setVisibleModal(false);
              executeGetMonthCalendar();
            }}
            ui={ui}
            editItem={editItem}></EditCalendar>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default CalendarScreen;
