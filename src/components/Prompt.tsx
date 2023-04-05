import React, {useState} from 'react';
import {View, Text, TextInput, Modal, Button} from 'react-native';
import {height} from '../config/globalStyles';
import DefaultButton from './DefaultButton';

const Prompt = ({visible, title, message, onCancel, onSubmit}) => {
  const [text, setText] = useState('');

  const handleCancel = () => {
    onCancel && onCancel();
    setText('');
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(text);
    setText('');
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            width: '100%',
            borderRadius: 20,
            height: '40%',
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            padding: 20,
          }}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 10,
              color: 'black',
              fontFamily: 'TheJamsilOTF_Regular',
            }}>
            {title}
          </Text>
          <Text style={{color: '#555', fontFamily: 'TheJamsilOTF_Light'}}>
            {message}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              marginTop: 10,
              fontFamily: 'TheJamsilOTF_Light',
            }}
            value={text}
            onChangeText={setText}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <DefaultButton onPress={handleCancel} title="취소"></DefaultButton>
            <DefaultButton onPress={handleSubmit} title="저장"></DefaultButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Prompt;