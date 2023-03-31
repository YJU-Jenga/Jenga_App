import React, {useEffect, useRef} from 'react';
import {
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {height, width} from '../config/globalStyles';
const PopupMessage = ({onPress, msg}) => {
  const startValue = useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.sequence([
      Animated.loop(
        Animated.spring(startValue, {
          toValue: 1.1,
          speed: 6,
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
  container: {
    paddingVertical: height * 30,
    paddingHorizontal: width * 20,
    backgroundColor: '#ff9e9b',
    marginTop: height * 60,
    borderRadius: 30,
  },
  content: {
    textAlign: 'center',
    color: 'white',
    fontSize: 19,
    fontWeight: '500',
  },
});
export default PopupMessage;
