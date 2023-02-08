import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';

const LogsScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 0.1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: '#8B00FF',
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 17, color: 'white'}}>
          김다운님이 딸기을(를) 사용했습니다.
        </Text>
        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Text style={{color: 'white', paddingRight: 20, fontWeight: 'bold'}}>
            12:00 - 12:20
          </Text>
          <Text style={{color: 'white', fontWeight: 'bold'}}>2023.05.23</Text>
        </View>
      </View>
      <View style={{paddingVertical: 8}}></View>
      <View
        style={{
          flex: 0.1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: '#8B00FF',
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 17, color: 'white'}}>
          김다운님이 딸기을(를) 사용했습니다.
        </Text>
        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Text style={{color: 'white', paddingRight: 20, fontWeight: 'bold'}}>
            13:00 - 13:20
          </Text>
          <Text style={{color: 'white', fontWeight: 'bold'}}>2023.05.23</Text>
        </View>
      </View>
      <View style={{paddingVertical: 8}}></View>
      <View
        style={{
          flex: 0.1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: '#8B00FF',
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 17, color: 'white'}}>
          김다운님이 딸기을(를) 사용했습니다.
        </Text>
        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Text style={{color: 'white', paddingRight: 20, fontWeight: 'bold'}}>
            14:00 - 14:20
          </Text>
          <Text style={{color: 'white', fontWeight: 'bold'}}>2023.05.23</Text>
        </View>
      </View>
      <View style={{paddingVertical: 8}}></View>
      <View
        style={{
          flex: 0.1,
          paddingTop: 12,
          paddingHorizontal: 10,
          backgroundColor: '#8B00FF',
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 17, color: 'white'}}>
          김다운님이 딸기을(를) 사용했습니다.
        </Text>
        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Text style={{color: 'white', paddingRight: 20, fontWeight: 'bold'}}>
            15:00 - 15:20
          </Text>
          <Text style={{color: 'white', fontWeight: 'bold'}}>2023.05.23</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogsScreen;
