import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Font from 'react-native-vector-icons/AntDesign';
import {width} from '../config/globalStyles';
const FloatingButton = ({onPress, color = '#f29999'}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.touchableOpacity}>
      <View style={[styles.buttonWrapper, {backgroundColor: color}]}>
        <Font
          color={'#fff'}
          size={40}
          style={styles.floatingButton}
          name="plus"></Font>
      </View>
      {/* <Image
        source={{
          uri: 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png',
        }}
        style={styles.FloatingButtonStyle}
      /> */}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  touchableOpacity: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  buttonWrapper: {
    width: width * 50,
    height: width * 50,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    marginHorizontal: 'auto',
  },
});
export default FloatingButton;
