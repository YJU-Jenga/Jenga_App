import {Platform} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import {useCookies} from 'react-cookie';
import jwtDecode from 'jwt-decode';
import {back_address} from '../../config/address';

// let SERVER_URL = 'http://127.0.0.1:5001';
// if (Platform.OS === 'android') {
//   SERVER_URL = 'http://10.0.2.2:5001';
// }

let SERVER_URL = back_address;

// Define a type for the slice state
interface UserState {
  msg: string;
  loading: boolean;
  userData: object;
  error: null;
  errorMessage: string;
  accessToken: string;
}

// Define the initial state using that type
const initialState: UserState = {
  msg: '',
  loading: false,
  error: null,
  userData: {},
  errorMessage: '',
  accessToken: '',
};

// 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}
export const getUser = createAsyncThunk<
  UserState[],
  any,
  {rejectValue: IError}
>('user/getUser', async (accessToken, thunkAPI) => {
  try {
    //console.log(accessToken);
    const refreshToken = await AsyncStorage.getItem('refresh-token');
    const user = JSON.parse(JSON.stringify(jwtDecode(refreshToken)));
    const {data} = await axios.get(`${SERVER_URL}/user/${user.email}`, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });
    console.log(data);
    return data;
    // setUserName(name);
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const userSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'user',
  // 초기 값
  initialState,
  reducers: {
    initErrorMessage: state => {
      state.errorMessage = '';
    },
  },
  extraReducers: builder => {
    builder
      // 통신 중
      .addCase(getUser.pending, state => {
        state.error = null;
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(getUser.fulfilled, (state, {payload}) => {
        console.log('payload : ', payload);
        state.error = null;
        state.loading = false;
        state.userData = payload;
        state.msg = 'SUCCESS_GET_USER';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(getUser.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_GET_USER';
        state.errorMessage = payload?.errorMessage;
      });
  },
});

// 리듀서 액션
export const {initErrorMessage} = userSlice.actions;

// useS
export const selectUserData = (state: RootState) => state.user.userData;
export const selectMsg = (state: RootState) => state.user.msg;

export default userSlice.reducer;
