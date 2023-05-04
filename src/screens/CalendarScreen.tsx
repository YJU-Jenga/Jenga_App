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
  deleteCalendar,
  getDateCalendar,
  getMonthCalendar,
  initCalendarErrorMessage,
  selectCalendarData,
  selectCalendarDateData,
  selectCalendarErrorMsg,
  updateCalendar,
} from '../utils/redux/calendarSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {refreshToken} from '../utils/redux/authSlice';
import CalendarDailyItem from '../components/Calendar/CalendarDailyItem';
import EditCalendar from '../components/Calendar/EditCalendar';
import {colors} from '../config/globalStyles';

const CalendarScreen = ({ui}) => {
  const [date, setDate] = React.useState(new Date());
  const [currDate, setCurrDate] = React.useState<string>(
    DateTime.local().toFormat('yyyy-MM-dd'),
  );
  const [isCurrMonth, setIsCurrMonth] = React.useState(true);
  const [currDataList, setCurrDataList] = React.useState([]);

  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>();
  const [calendarDots, setCalendarDots] = React.useState<object>({});

  const _errorMessage = useSelector(selectCalendarErrorMsg);
  const [errorMessage, setErrorMessage] = React.useState('');
  const _calendarData = useSelector(selectCalendarData);
  const [calendarData, setCalendarData] = React.useState();
  const _calendarDateData = useSelector(selectCalendarDateData);
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
    }, []),
  );

  React.useEffect(() => {
    //setCalendarData(_calendarData);
    //convertCurrCalendar(DateTime.local().c.day, _calendarData);
    executeGetDateCalendar();
    //convertCurrCalendar(DateTime.fromISO(currDate), _calendarData);
    if (Object.keys(_calendarData).length !== 0)
      generateCalendarDots(_calendarData);
  }, [_calendarData]);

  const executeGetMonthCalendar = () => {
    const obj = {userId: ui.id, dateString: new Date(currDate).toISOString()};
    dispatch(getMonthCalendar(obj));
  };

  const executeGetDateCalendar = () => {
    const obj = {userId: ui.id, dateString: new Date(currDate).toISOString()};
    dispatch(getDateCalendar(obj));
  };

  const removeCalendar = React.useCallback(id => {
    const obj = {
      userId: ui.id,
      dateString: new Date(currDate).toISOString(),
    };
    dispatch(deleteCalendar(id))
      .unwrap()
      .then(() => executeGetMonthCalendar());
  }, []);

  const pickCurrDate = React.useCallback(
    time => {
      if (DateTime.fromISO(currDate).c.month !== time.month) {
        //setIsCurrMonth(false);
        const obj = {
          userId: ui.id,
          dateString: new Date(time.year, time.month - 1, 15).toISOString(),
        };
        // dispatch(getMonthCalendar(obj));
        // onClickAnotherMonth(obj);
        //onMonthChange(time);
      }
      setCurrDate(time.dateString);
    },
    [currDate],
  );

  React.useEffect(() => {
    executeGetDateCalendar();
  }, [currDate]);

  const onMonthChange = React.useCallback(time => {
    const y = time.year;
    // month 는 1빼줘야하는듯,,
    const m = time.month - 1;
    const d = time.day;
    const obj = {
      userId: ui.id,
      dateString: new Date(y, m, d).toISOString(),
    };
    dispatch(getMonthCalendar(obj));
  }, []);

  const generateDate = (date: Date) => {
    const yyyy = date?.getUTCFullYear();
    const mm = (date?.getUTCMonth() + 1).toString().padStart(2, '0');
    const dd =
      date?.getUTCDate() <= 10
        ? '0' + date?.getUTCDate()
        : date?.getUTCDate().toString();
    return `${yyyy}-${mm}-${dd}`;
  };

  const generateCalendarDots = React.useCallback(
    data => {
      let obj = {};
      _calendarData.forEach(item => {
        // let key = item.start;
        const utcOffset = new Date().getTimezoneOffset() * -1;

        const startDate = new Date(item.start);
        const endDate = new Date(item.end);
        const startStr = generateDate(startDate);

        const endStr = generateDate(endDate);
        // const startDateStr = item.start.slice(0, 10);

        // const endDateStr = item.end.slice(0, 10);
        // const formattedDate = startDateObj.toFormat('yyyy-MM-dd');
        let currDate = startDate;

        if (startStr === endStr) {
          obj[startStr] = {marked: true};
          return;
        } else {
          const n = new Date(endDate - startDate).getUTCDate();
          for (let i = 0; i < n; i++) {
            let formattedDate = generateDate(currDate);
            // currDate = currDate.setDate(currDate.getUTCDate() + 1);
            currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000);
            //currDate = currDate.plus({days: 1});
            obj[formattedDate] = {marked: true};
          }
        }
      });
      setCalendarDots(obj);
    },
    [_calendarData],
  );

  React.useEffect(() => {
    // calendarDots 상태 변수가 변경될 때마다 컴포넌트를 다시 렌더링하도록 함
  }, [calendarDots]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title
        onPress={() => {
          navigation.navigate('manageCalendar', {ui: ui});
        }}
        title={title}></Title>

      <CalendarProvider date={currDate}>
        <ExpandableCalendar
          customHeaderTitle={
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'TheJamsilOTF_Regular',
                marginVertical: 10,
                color: 'black',
              }}>
              {currDate}
            </Text>
          }
          current={currDate}
          onMonthChange={onMonthChange}
          onDayPress={pickCurrDate}
          markedDates={calendarDots}
          theme={{
            selectedDayTextColor: 'white',
            selectedDayBackgroundColor: '#ff6e6e',
            todayTextColor: '#ff6e6e',
            monthTextColor: 'black',
            arrowColor: '#ff6e6e',
            dotColor: '#ff6e6e',
            calendarBackground: 'white',
          }}
          allowShadow={false}
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: '#bbb',
          }}></ExpandableCalendar>
        <FlatList
          //data={currDataList}
          data={_calendarDateData}
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
      </CalendarProvider>

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
