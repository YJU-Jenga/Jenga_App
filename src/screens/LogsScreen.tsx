import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WhiteSpace} from '@ant-design/react-native';
import {useFocusEffect} from '@react-navigation/native';

const LogsScreen = () => {
  const dummy = React.useState([
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
  ]);

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

      {dummy.map((v, i) => {
        return (
          <View>
            <Text>안녕</Text>
          </View>
        );
      })}
    </SafeAreaView>
  );
};

export default LogsScreen;
