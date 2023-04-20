import React, {useEffect, useRef} from 'react';
import {
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {colors, height, width} from '../config/globalStyles';
const PopupMessage = ({onPress, msg}) => {
  const startValue = useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.sequence([
      Animated.loop(
        Animated.spring(startValue, {
          toValue: 1.1,
          speed: 3,
          useNativeDriver: true,
          bounciness: 10,
        }),
      ),
    ]).start();
  };

  useEffect(() => {
    fadeIn();
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                scale: startValue,
              },
            ],
          },
        ]}>
        <Text style={styles.content}>{msg}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   paddingVertical: height * 15,
  //   paddingHorizontal: width * 20,
  //   backgroundColor: '#fff',
  //   marginTop: height * 60,
  //   borderRadius: 30,
  //   shadowColor: '#ff9e9b',
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  //   shadowOffset: {
  //     height: 5,
  //     width: 0,
  //   },
  //   elevation: 10,
  // },
  container: {
    paddingVertical: height * 15,
    paddingHorizontal: width * 20,
    backgroundColor: colors.babyPink,
    marginTop: height * 60,
    borderRadius: 30,
    shadowColor: '#ffe7e6',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    elevation: 10,
  },
  content: {
    textAlign: 'center',
    //color: '#df9f9f',
    color: '#ed8f8c',
    fontSize: 15,
    fontFamily: 'TheJamsilOTF_Regular',
  },
});
export default PopupMessage;
