import React from 'react';
import { View, Text } from 'react-native';

const LogsScreen = () => {
  return (
    <View style={{ flex: 1, paddingTop: 12, paddingHorizontal: 10, backgroundColor: 'white' }}>
        <View style={{ flex: 0.1, paddingTop: 12, paddingHorizontal: 10, backgroundColor: "#8B00FF", borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: 'white' }}>김다운님이 딸기을(를) 사용헀습니다.</Text>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                <Text style={{ color: 'white', paddingRight: 20, fontWeight: 'bold' }}>12:00 - 16:00</Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>2023.05.23</Text>
            </View>
        </View>
    </View>
  );
};

export default LogsScreen;