import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
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
      <SafeAreaView
        style={{
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 30,
        }}>
        <KeyboardAvoidingView
          style={{
            width: '100%',
            borderRadius: 20,
            height: height * 160,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            // position: 'absolute',
            // bottom: 0,
            backgroundColor: '#fff',
            padding: 20,
            marginTop: height * 220,
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
            }}>
            <DefaultButton
              onPress={handleCancel}
              title="キャンセル"></DefaultButton>
            <DefaultButton onPress={handleSubmit} title="保存"></DefaultButton>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default Prompt;
