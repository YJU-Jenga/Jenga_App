import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
const DeleteButton = ({onPress}) => {
  return (
    <TouchableOpacity style={{width: '100%', padding: 15}} onPress={onPress}>
      <Text
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: 18,
          fontFamily: 'TheJamsilOTF_Regular',
        }}>
        삭제
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteButton;
