import {Flex} from '@ant-design/react-native';
import React from 'react';
import {Text, SafeAreaView, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUserData} from '../utils/redux/userSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Pressable} from 'react-native';

interface Props {
  title: string;
}

const Title: React.FC<Props> = ({title, onPress}) => {
  const _userData = useSelector(selectUserData);

  return (
    <SafeAreaView>
      <Flex
        justify="between"
        style={{
          marginHorizontal: 25,
          marginTop: 0,
          marginBottom: 20,
          backgroundColor: 'white',
        }}>
        <Text
          style={{
            color: '#111',
            fontSize: 36,
            fontFamily: 'Cafe24Ohsquare',
          }}>
          {title}
        </Text>
        {title === 'Schedule' && (
          <Pressable onPress={onPress}>
            <Icon color={'#f29999'} size={30} name="calendar-month"></Icon>
          </Pressable>
        )}
        {title === 'Monthly' && (
          <Pressable onPress={onPress}>
            <Icon color={'#99ccff'} size={30} name="calendar-week"></Icon>
          </Pressable>
        )}

        {/* <Image
          source={require('./../scpark.jpeg')}
          style={{width: 30, height: 30, borderRadius: 40}}></Image> */}
      </Flex>
      {/* <Text>프사 누르면 {_userData['name']}이랑..</Text>
      <Text>장바구니 탭도 넣을 거임</Text> */}
    </SafeAreaView>
  );
};

export default Title;
