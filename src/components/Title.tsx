import {Flex} from '@ant-design/react-native';
import React from 'react';
import {Text, SafeAreaView, Image, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getUser, selectUserData} from '../utils/redux/userSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshToken} from '../utils/redux/authSlice';

interface Props {
  title: string;
}

const Title: React.FC<Props> = ({title, onPress}) => {
  const _userData = useSelector(selectUserData);

  const dispatch = useDispatch();
  React.useEffect(() => {
    const funcRefresh = async () => {
      const token = await AsyncStorage.getItem('refresh-token');

      if (token) {
        dispatch(refreshToken());
      }
    };
    funcRefresh();
  }, [title]);
  return (
    <SafeAreaView>
      <Flex
        justify="between"
        style={{
          marginHorizontal: 25,
          marginTop: 0,
          marginBottom: 10,
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

        {(title === 'Calendar' || title === 'Management') && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              gap: 5,
            }}>
            <Pressable onPress={onPress}>
              <Icon
                color={'#333'}
                size={30}
                name={
                  title === 'Calendar' ? 'calendar-search' : 'calendar-heart'
                }></Icon>
            </Pressable>
          </View>
        )}
      </Flex>
    </SafeAreaView>
  );
};

export default Title;
