import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ScheduleScreen from '../screens/ScheduleScreen';
import DetailsScreen from '../screens/DetailScreen';
import {HomeStackNavigatorParamList} from '../types';

const HomeStack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={ScheduleScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
