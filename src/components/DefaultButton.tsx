import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
const DefaultButton = ({onPress, title}) => {
  return (
    <TouchableOpacity style={{padding: 15}} onPress={onPress}>
      <Text style={{textAlign: 'center', color: 'red', fontSize: 18}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
