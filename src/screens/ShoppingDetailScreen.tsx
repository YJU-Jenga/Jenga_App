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

const ShoppingDetailScreen = ({route, navigation}) => {
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
          <Image
            source={{uri: route.params.image}}
            style={{width: '100%', height: 150}}></Image>
          <View style={{width: '100%'}}>
            <Text style={{fontSize: 18}}>{route.params.name}</Text>
            <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}>
              {route.params.price}
            </Text>
            <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}>
              {route.params.description}
            </Text>

            <Button
              title="showModal"
              onPress={() => setVisibleModal(true)}></Button>

            <Modal
              presentationStyle="formSheet"
              visible={visibleModal}
              animationType="slide"
              onRequestClose={() => setVisibleModal(false)}>
              <SafeAreaView style={{backgroundColor: 'pink'}}>
                <Text style={{marginStart: 30, marginTop: 30}}>
                  장바구니에 담아보거라~~~~
                </Text>
                {stockList && (
                  <PickerView
                    onChange={e => {
                      setCurrStock(e);
                    }}
                    value={currStock}
                    data={stockList}
                    cascade={false}
                  />
                )}
                <Text style={{textAlign: 'center'}}>Content...</Text>
                <Text style={{textAlign: 'center'}}>Content...</Text>
                <Button
                  title="close modal"
                  onPress={() => setVisibleModal(false)}></Button>
              </SafeAreaView>
            </Modal>
          </View>
        </Flex>
      </WingBlank>
    </SafeAreaView>
  );
};

export default ShoppingDetailScreen;
