import { StyleSheet, View, Text, Pressable, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';


const HomeScreen = () => {
  return (
    <View style={{ flex: 1, paddingTop: 10, justifyContent: 'center', alignContent: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 50 }}>
          🍓
      </Text>
      <Text style={{ fontSize: 50, fontWeight: 'bold' }}>
          안녕 다운!
      </Text>
      <Image source={require('../assets/image/mic2.png')} style={{ width: 100, height: 100, borderRadius: 60 }}/>
      <Text style={{ fontSize: 20 }}>
          인형 이름을 말해주세요
      </Text>
    </View>
  );
};

export default HomeScreen;