import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import Title from '../components/Title';

const ManagementCalendar = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 12,
        backgroundColor: 'white',
      }}>
      <Title
        onPress={() => {
          navigation.goBack();
        }}
        title="Management"></Title>
    </SafeAreaView>
  );
};
export default ManagementCalendar;
