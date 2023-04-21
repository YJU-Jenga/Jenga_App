import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {FlatList, Modal, SafeAreaView, Text} from 'react-native';
import Title from '../components/Title';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteCalendar,
  getAllCalendar,
  selectCalendarData,
} from '../utils/redux/calendarSlice';
import CalendarDailyItem from '../components/Calendar/CalendarDailyItem';
import EditCalendar from '../components/Calendar/EditCalendar';

const ManagementCalendar = () => {
  const [orderedCalendar, setOrderedCalendar] = React.useState<
    object[] | null
  >();
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [editItem, setEditItem] = React.useState<object>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const _calendarData = useSelector(selectCalendarData);

  React.useEffect(() => {
    getAllCalendarData();
  }, []);

  React.useEffect(() => {
    if (!(Array.isArray(_calendarData) && _calendarData.length === 0)) {
      let arr = [..._calendarData];
      const orderedDate = arr.sort(
        (a, b) => new Date(a.start) - new Date(b.start),
      );
      setOrderedCalendar(orderedDate);
    } else {
      setOrderedCalendar(null);
    }
  }, [_calendarData]);

  const getAllCalendarData = () => {
    dispatch(getAllCalendar({userId: route.params?.ui.userId}));
  };

  const removeCalendar = React.useCallback((data: object) => {
    setOrderedCalendar(prev => prev.filter(item => item.id !== data.id));
    dispatch(deleteCalendar(data.id));
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title
        onPress={() => {
          navigation.goBack();
        }}
        title="Management"></Title>
      <FlatList
        data={orderedCalendar}
        renderItem={({item, index}) => (
          <CalendarDailyItem
            data={item}
            removeCalendar={() => removeCalendar(item)}
            updateCalendar={() => {
              setEditItem(item);
              setVisibleModal(true);
            }}></CalendarDailyItem>
        )}></FlatList>
      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={() => {
          setVisibleModal(false);
        }}
        visible={visibleModal}>
        <EditCalendar
          onClose={() => {
            setVisibleModal(false);
            setEditItem(null);
          }}
          ui={route.params.ui}
          editItem={editItem}></EditCalendar>
      </Modal>
    </SafeAreaView>
  );
};
export default ManagementCalendar;
