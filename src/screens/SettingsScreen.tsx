import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SettingsScreen = () => {

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <View>
        <Text style={{ color: '#939393', fontSize: 20, paddingHorizontal: 12, paddingVertical: 10 }}>
          나
        </Text>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image source={require('../assets/image/user.png')} style={{ width: 60, height: 60, borderRadius: 60 }}/>
          <Text style={{ fontWeight: "bold", fontSize: 30, paddingHorizontal: 12, paddingVertical: 12 }}>
            김다운
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#ccc',
        }}
      />
      <View>
        <Text style={{ color: '#939393', fontSize: 20, paddingHorizontal: 12, paddingVertical: 10 }}>
          인형
        </Text>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image source={require('../assets/image/doll.png')} style={{ width: 60, height: 60, borderRadius: 60 }}/>
          <Text style={{ fontWeight: "bold", fontSize: 30, paddingHorizontal: 12, paddingVertical: 12 }}>
            딸기
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#ccc',
        }}
      />
      <View>
        <Text style={{ fontSize: 20, paddingHorizontal: 12, paddingTop: 12 }}>
          알림
        </Text>
        <Text style={{ color: '#939393', fontSize: 18, paddingHorizontal: 12, paddingBottom: 12, paddingTop: 3 }}>
          알림을 허용합니다
        </Text>
      </View>
      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#ccc',
        }}
      />
      <View>
        <Text style={{ fontSize: 20, paddingHorizontal: 12, paddingTop: 12 }}>
          언어
        </Text>
        <Text style={{ color: '#939393', fontSize: 18, paddingHorizontal: 12, paddingBottom: 12, paddingTop: 3 }}>
          언어를 설정하세요
        </Text>
      </View>
      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#ccc',
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity activeOpacity={0.8} style={{ width: 280, height: 70, backgroundColor: "#fe5746", justifyContent: 'center', alignItems: 'center', borderRadius: 60}}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 23 }}>
          쇼핑하러가기
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;