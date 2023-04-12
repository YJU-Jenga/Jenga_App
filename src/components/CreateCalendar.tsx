import * as React from 'react';
import {SafeAreaView, Text} from 'react-native';
import Title from './Title';
import {
  DatePickerView,
  Flex,
  Provider,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import Icon from 'react-native-vector-icons/Ionicons';
import {height} from '../config/globalStyles';
import TextAreaItem from '@ant-design/react-native/lib/textarea-item';
const CreateCalendar = ({onClose}) => {
  return (
    <Provider locale={enUS}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 12,
          backgroundColor: 'white',
        }}>
        <WhiteSpace size="lg" />
        <Flex justify="around" style={{marginBottom: height * 30}}>
          <Icon
            name="md-caret-back-outline"
            size={30}
            color={'#ff6e6e'}
            onPress={onClose}></Icon>
          <Text
            style={{
              fontSize: 24,
              color: 'black',
              fontFamily: 'TheJamsilOTF_Regular',
            }}>
            월간 일정
          </Text>
          <Text
            style={{
              color: '#ff6e6e',
              fontSize: 18,
              fontWeight: '600',
              fontFamily: 'TheJamsilOTF_Regular',
            }}
            //   onPress={onSave}
          >
            저장
          </Text>
        </Flex>
        <WingBlank>
          <Text
            style={{
              fontSize: 24,
              color: 'black',
              fontFamily: 'TheJamsilOTF_Regular',
              marginStart: 15,
            }}>
            날짜
          </Text>
          <DatePickerView
            defaultDate={new Date()}
            mode={'date'}></DatePickerView>

          <Text
            style={{
              fontSize: 24,
              color: 'black',
              fontFamily: 'TheJamsilOTF_Regular',
              marginStart: 15,
            }}>
            일정
          </Text>
          <TextAreaItem placeholder="자녀의 뭐를 작성하세요?"></TextAreaItem>
        </WingBlank>
      </SafeAreaView>
    </Provider>
  );
};
export default CreateCalendar;
