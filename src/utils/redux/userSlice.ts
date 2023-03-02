import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SERVER_URL = 'http://127.0.0.1:5001';

// Define a type for the slice state
interface UserState {
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
}

// Define the initial state using that type
const initialState: UserState = {
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
};

// 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

export const signUp = createAsyncThunk<
  UserState[],
  object,
  {rejectValue: IError}
>('user/register', async (registerInfo, thunkAPI) => {
  try {
    const {data} = await axios.post(
      `${SERVER_URL}/auth/local/signUp`,
      registerInfo,
    );
    return data;
  } catch (e) {
    // rejectWithValue를 사용하여 에러 핸들링이 가능하다
    console.log('로그인 실패');
    return thunkAPI.rejectWithValue({
      errorMessage: '알 수 없는 에러가 발생했습니다.',
    });
  }
});

export const registerAccount = createAsyncThunk<
  UserState[],
  object,
  {rejectValue: IError}
>('user/register', async (registerInfo, thunkAPI) => {
  try {
    const {data} = await axios.post(
      `${SERVER_URL}/auth/local/signup`,
      registerInfo,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  } catch (e) {
    // rejectWithValue를 사용하여 에러 핸들링이 가능하다
    console.log('로그인 실패');
    return thunkAPI.rejectWithValue({
      errorMessage: '알 수 없는 에러가 발생했습니다.',
    });
  }
});
// 비동기 통신 구현
export const loginAccount = createAsyncThunk<
  // 성공 시 리턴 타입
  UserState[],
  // input type. ex) LoginScreen.tsx에서 email, password 객체를 넘겨줬기때문에 object
  object,
  // ThunkApi 정의({dispatch?, state?, extra?, rejectValue?})
  {rejectValue: IError}
>('user/login', async (userInfo, thunkAPI) => {
  try {
    const {data} = await axios.post(
      `${SERVER_URL}/auth/local/signin`,
      userInfo,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(data);
    AsyncStorage.multiSet([
      ['access-token', data.access_token],
      ['refresh-token', data.refresh_token],
    ]);
    return data;
  } catch (e) {
    // rejectWithValue를 사용하여 에러 핸들링이 가능하다
    console.log('로그인 실패');
    return thunkAPI.rejectWithValue({
      errorMessage: '알 수 없는 에러가 발생했습니다.',
    });
  }
});

export const userSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'user',
  // 초기 값
  initialState,
  reducers: {},
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
        state.msg = 'SUCCESS LOGIN';
      })
      // 통신 에러
      .addCase(loginAccount.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED LOGIN';
      })
      .addCase(registerAccount.pending, state => {
        state.error = null;
        state.loading = true;
      })
      .addCase(registerAccount.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
      });
  },
});

// 리듀서 액션
export const {} = userSlice.actions;

// useS
export const selectEmail = (state: RootState) => state.user.email;
export const selectToken = (state: RootState) => state.user.token;
export const selectMsg = (state: RootState) => state.user.msg;

export default userSlice.reducer;
