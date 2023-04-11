import {Platform} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCookies} from 'react-cookie'; // useCookies import
import {back_address} from '../../config/address';

let SERVER_URL = back_address;
// if (Platform.OS === 'android') {
//   SERVER_URL = back_address
//   SERVER_URL = 'http://10.0.2.2:5001';
// }

// Define a type for the slice state
interface AuthState {
  email: string;
  name: string;
  token: string;
  imgURL: string;
  isLogged: boolean;
  password: string;
  msg: string;
  loading: boolean;
  userData: object;
  error: null;
  errorMessage: string;
  accessToken: string;
  refreshToken: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  email: '',
  password: '',
  name: '',
  imgURL: '',
  token: '',
  isLogged: false,
  msg: '',
  loading: false,
  error: null,
  userData: {},
  errorMessage: '',
  accessToken: '',
  refreshToken: '',
};

// 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

export const registerAccount = createAsyncThunk<
  AuthState[],
  object,
  {rejectValue: IError}
>('auth/register', async (registerInfo, thunkAPI) => {
  let {name, password, email, phone} = registerInfo;
  phone = await registerInfo.phone.replace(/\s|_/g, '-');

  const obj = {email, name, password, phone};
  try {
    const {data} = await axios.post(`${SERVER_URL}/auth/local/signup`, obj, {
      withCredentials: true,
    });
    AsyncStorage.setItem('refresh-token', data.refresh_token);
    AsyncStorage.setItem('access-token', data.access_token);
    return data;
  } catch (e) {
    console.error(e);
    // rejectWithValue를 사용하여 에러 핸들링이 가능하다
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});
// 비동기 통신 구현
export const loginAccount = createAsyncThunk<
  AuthState[],
  object,
  {rejectValue: IError}
>('auth/login', async (userInfo, thunkAPI) => {
  try {
    const {data} = await axios.post(
      `${SERVER_URL}/auth/local/signin`,
      userInfo,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(data);
    AsyncStorage.setItem('refresh-token', data.refresh_token);
    AsyncStorage.setItem('access-token', data.access_token);
    return data;
  } catch (e) {
    console.error(e);
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const refreshToken = createAsyncThunk<
  AuthState[],
  object,
  {rejectValue: IError}
>('auth/refresh', async thunkAPI => {
  const token = await AsyncStorage.getItem('refresh-token');
  try {
    // const {data} = await axios.post(`${SERVER_URL}/auth/refresh`, {
    //   headers: {
    //     authorization: 'Bearer ' + token,
    //   },
    //   withCredentials: true,
    // });

    await fetch(`${SERVER_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      credentials: 'include',
    })
      .then(res => {
        return res.json();
        //AsyncStorage.multiRemove(['access-token', 'refresh-token']);
      })
      .then(json => {
        console.log(json);
        AsyncStorage.setItem('refresh-token', json.refresh_token);
        AsyncStorage.setItem('access-token', json.access_token);
      });
    // console.log(data);
    // if (data.refresh_token) {
    //   AsyncStorage.setItem('refresh-token', data.refresh_token);
    //   AsyncStorage.setItem('access-token', data.access_token);
    // }
    return {refresh: 'refresh'};
  } catch (e) {
    // rejectWithValue를 사용하여 에러 핸들링이 가능하다
    console.error(e);
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const logout = createAsyncThunk<
  AuthState[],
  object,
  {rejectValue: IError}
>('auth/logout', async thunkAPI => {
  try {
    await fetch(`${SERVER_URL}/auth/logout`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    }).then(() => {
      AsyncStorage.multiRemove(['access-token', 'refresh-token']);
    });
  } catch (e) {
    // rejectWithValue를 사용하여 에러 핸들링이 가능하다
    console.error(e);
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const authSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'auth',
  // 초기 값
  initialState,
  reducers: {
    initErrorMessage: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.errorMessage = '';
    },
  },
  extraReducers: builder => {
    builder
      // 통신 중
      .addCase(loginAccount.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(loginAccount.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.userData = payload;
        state.msg = 'SUCCESS_LOGIN';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(loginAccount.rejected, (state, {payload}) => {
        console.log(payload);
        state.loading = false;
        state.msg = 'FAILED_LOGIN';
        state.errorMessage = payload?.errorMessage;
      })
      // 회원가입
      .addCase(registerAccount.pending, state => {
        state.error = null;
        state.loading = true;
      })
      .addCase(registerAccount.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.msg = 'SUCCESS_REGISTER';
        state.errorMessage = '';
        state.accessToken = payload?.access_token;
      })
      .addCase(registerAccount.rejected, (state, {payload}) => {
        console.log('레지스터 실패ㅣ ', state);
        state.errorMessage = payload?.errorMessage;
        state.loading = false;
        state.msg = 'FAILED_REGISTER';
      })
      // 토큰 재발급
      .addCase(refreshToken.pending, state => {
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, {payload}) => {
        state.error = null;
        state.msg = 'SUCCESS_REFRESH_TOKEN';
        state.accessToken = payload?.access_token;
        state.refreshToken = payload?.refresh_token;
      })
      .addCase(refreshToken.rejected, (state, {payload}) => {
        state.msg = 'FAILED_REFRESH_TOKEN';
      })
      // 로그아웃
      .addCase(logout.pending, state => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, {payload}) => {
        state.error = null;
        state.msg = 'SUCCESS_LOGOUT';
      })
      .addCase(logout.rejected, (state, {payload}) => {
        state.msg = 'FAILED_LOGOUT';
      });
  },
});

// 리듀서 액션
export const {initErrorMessage} = authSlice.actions;

// useS
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectMsg = (state: RootState) => state.auth.msg;
export const selectErrorMsg = (state: RootState) => state.auth.errorMessage;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
