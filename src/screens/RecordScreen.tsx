import {StyleSheet, View, Text, Pressable, FlatList, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';

const RecordScreen = () => {
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
          π
        </Text>
        <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'center'}}>
          μλ λ€μ΄!
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/image/mic2.png')}
          style={{width: 100, height: 100, borderRadius: 60, padding: 40}}
        />
        <Text style={{fontSize: 20, textAlign: 'center'}}>
          μΈν μ΄λ¦μ λ§ν΄μ£ΌμΈμ
        </Text>
      </View>
    </View>
  );
};

export default RecordScreen;