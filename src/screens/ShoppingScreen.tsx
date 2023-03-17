import React from 'react';
import {View, Text, SafeAreaView, FlatList, Image} from 'react-native';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WhiteSpace, WingBlank, Flex} from '@ant-design/react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getUser, selectMsg, selectUserData} from '../utils/redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Title as CardTitle} from 'react-native-paper';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';

const LogsScreen = ({route, navigation}) => {
  const [productList, setProductList] = React.useState();

  React.useEffect(() => {
    const productList = axios
      .get('http://127.0.0.1:5001/product/getAll')
      .then(res => {
        setProductList(res.data);
      });
  }, []);

  return (
    <SafeAreaView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <Title title="Shopping"></Title>
      {/* <Text style={{textAlign: 'right', marginHorizontal: 20}}>
          <Icon name="delete-sweep" size={30} color="#100" />
        </Text> */}
      <FlatList
        data={productList}
        renderItem={({item, i}) => (
          <WingBlank key={i} size="lg">
            <TouchableOpacity
              style={{
                backgroundColor: '#eee',
                marginVertical: 5,
                paddingVertical: 10,
              }}
              onPress={() => navigation.navigate('shoppingDetail', item)}>
              <Card.Content>
                <Card.Cover source={{uri: item.image}}></Card.Cover>
                <View style={{paddingTop: 10}}>
                  <Text style={{fontSize: 18}}>{item.name}</Text>
                  <Text style={{fontSize: 18, fontWeight: '600', color: 'red'}}>
                    {item.price}
                  </Text>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </WingBlank>
        )}></FlatList>
    </SafeAreaView>
  );
};

export default LogsScreen;
