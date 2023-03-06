import React from 'react';
import {View, SafeAreaView, Text, Image} from 'react-native';
import Title from '../components/Title';
import {
  Provider,
  Modal,
  WhiteSpace,
  WingBlank,
  Button,
  DatePickerView,
  List,
  SearchBar,
} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';

import {useAppSelector, useAppDispatch} from '../../hooks';
import {selectName, getUserInfo} from '../utils/redux/authSlice';
interface books {
  id: number;
  title: string;
  author: string;
  imgSrc: string;
}

const ListenScreen = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [value12hours, setValue12hours] = React.useState(new Date());
  //const count = useAppSelector(selectName);
  const dispatch = useAppDispatch();
  // const data: Array<books> = [
  //   {
  //     id: 1,
  //     title: '스웩 넘치는 일상',
  //     author: '김냥냥',
  //     imgSrc: './../scpark.jpeg',
  //   },
  //   {id: 2, title: '볼살 통통이', author: '하예진', imgSrc: './../scpark.jpeg'},
  //   {id: 3, title: '뭘봐 돼지야', author: '김돼지', imgSrc: './../scpark.jpeg'},
  //   {
  //     id: 4,
  //     title: '저 안봤는데용',
  //     author: '하예진',
  //     imgSrc: './../scpark.jpeg',
  //   },
  // ];
  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        }}>
        <Title title="Sounds"></Title>
        <SearchBar
          placeholder="오디오의 제목을 입력하세요"
          onSubmit={v => {
            console.log(v);
          }}
          onClear={v => {}}
        />
        <WingBlank>
          <List>
            <List.Item
              thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
              extra={
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'lightpink',
                    width: 10,
                    height: 10,
                  }}></View>
              }>
              샘플책1
            </List.Item>
            <List.Item
              thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
              extra={
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'lightblue',
                    width: 10,
                    height: 10,
                  }}></View>
              }>
              샘플영상2
            </List.Item>
            <List.Item
              thumb="https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png"
              extra={
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'lightsalmon',
                    width: 10,
                    height: 10,
                  }}></View>
              }>
              샘플책3
            </List.Item>
          </List>
        </WingBlank>
      </SafeAreaView>
    </Provider>
  );
};

export default ListenScreen;
