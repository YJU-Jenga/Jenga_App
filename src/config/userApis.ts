import axios from 'axios';
import {back_address} from './address';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: back_address,
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    accept: 'application/json,',
  },
  withCredentials: true,
});

export const userApis = {
  refreshToken: async () => {
    const access_token = await AsyncStorage.getItem('access-token');
    const refresh_token = await AsyncStorage.getItem('refresh-token');
    const config = {
      headers: {
        authorization: 'Bearer ' + access_token,
        'Refresh-Token': refresh_token,
      },
      withCredentials: true,
    };
    return api.post(`/auth/refresh`, {}, config);
  },
};
