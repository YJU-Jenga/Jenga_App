import {StyleSheet, View, Text, Pressable, FlatList, Image} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';

const RecordScreen = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarVisible: true,
        tabBarStyle: {display: 'flex'},
      });
    }, [navigation]),
  );
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 10,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{paddingBottom: 200}}>
        <Text style={{fontSize: 50, textAlign: 'center', paddingBottom: 20}}>
          🍓
        </Text>
        <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'center'}}>
          안녕 다운!
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/image/mic2.png')}
          style={{width: 100, height: 100, borderRadius: 60, padding: 40}}
        />
        <Text style={{fontSize: 20, textAlign: 'center'}}>
          인형 이름을 말해주세요
        </Text>
      </View>
    </View>
  );
};

export default RecordScreen;
