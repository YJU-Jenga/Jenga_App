import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  Button,
  Modal,
} from 'react-native';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  WhiteSpace,
  WingBlank,
  Card,
  Flex,
  PickerView,
} from '@ant-design/react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getUser, selectMsg, selectUserData} from '../utils/redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import SelectStock from '../components/SelectStock';

const OrderScreen = ({route, navigation}) => {
  const [product, setProduct] = React.useState();
  const [stockList, setStockList] = React.useState();
  const [currStock, setCurrStock] = React.useState();
  const [visibleModal, setVisibleModal] = React.useState(false);
  let list: any = [];
  const setValue = (props: number) => {
    for (let i = 1; i <= props; i++) {
      list.push({label: i, value: i});
    }
    let wrapper = [list];
    return wrapper;
  };

  React.useEffect(() => {
    // setProduct(route.params);
    setStockList(setValue(route.params.stock));
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <WingBlank size="lg">
        <Flex direction="column">
          <Title title="Order"></Title>
        </Flex>
      </WingBlank>
    </SafeAreaView>
  );
};

export default OrderScreen;
