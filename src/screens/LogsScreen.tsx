import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WhiteSpace, WingBlank, Card} from '@ant-design/react-native';
import {useFocusEffect} from '@react-navigation/native';

interface logType {
  id: number;
  msg: string;
  type: string;
  created_at: string;
  isChecked: boolean;
}

const LogsScreen = () => {
  const dummy: Array<logType> = [
    {
      id: 1,
      msg: "아이가 '달러의 가치와 경제'를 들었습니다.",
      type: 'system',
      created_at: '2023.05.23 05:43',
      isChecked: false,
    },
    {
      id: 2,
      msg: '아이의 약먹기 일정이 곧 실행됩니다.',
      type: 'schedule',
      created_at: '2023.05.23 08.56',
      isChecked: false,
    },
    ,
    {
      id: 3,
      msg: '아이의 약먹기 일정이 곧 실행됩니다.',
      type: 'schedule',
      created_at: '2023.05.23 08.56',
      isChecked: false,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log(
          'LogsScreen의 useFocusEffect : isChecked를 true로 바꿔주는 작업',
        );
        console.log(
          'LogsScreen의 useFocusEffect : 100개 넘으면 그만큼 삭제하기',
        );
      };
    }, []),
  );
  return (
    <SafeAreaView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <Title title="Logs"></Title>
      {/* <Text style={{textAlign: 'right', marginHorizontal: 20}}>
          <Icon name="delete-sweep" size={30} color="#100" />
        </Text> */}
      <ScrollView
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {dummy.map((el, i) => {
          return (
            <WingBlank key={i} size="lg">
              <Card style={{marginBottom: 5}}>
                <Card.Header
                  title="알림"
                  thumbStyle={{width: 30, height: 30}}
                  //thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                  extra="this is extra"
                />
                <Card.Body>
                  <View style={{height: 42}}>
                    <Text style={{marginLeft: 16}}>{el?.msg}</Text>
                  </View>
                </Card.Body>
                <Card.Footer extra={el?.created_at} />
              </Card>
            </WingBlank>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogsScreen;
