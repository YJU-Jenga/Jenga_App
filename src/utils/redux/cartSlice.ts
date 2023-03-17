import {Platform} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import {useCookies} from 'react-cookie';
import jwtDecode from 'jwt-decode';

let SERVER_URL = 'http://127.0.0.1:5001';
if (Platform.OS === 'android') {
  SERVER_URL = 'http://10.0.2.2:5001';
}

// Define a type for the slice state
interface CartState {
  msg: string;
  loading: boolean;
  cartData: object;
  error: null;
  errorMessage: string;
}

// Define the initial state using that type
const initialState: CartState = {
  msg: '',
  loading: false,
  error: null,
  cartData: {},
  errorMessage: '',
};

// 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}
export const addProduct = createAsyncThunk<
  CartState[],
  object,
  {rejectValue: IError}
>('cart/addProduct', async (productInfo, thunkAPI) => {
  try {
    //console.log(accessToken);
    console.log(productInfo);
    const {data} = await axios.post(
      `${SERVER_URL}/cart/addProduct`,
      productInfo,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(data);
    return data;
  } catch (e) {
    console.error(e.response.data.message);
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const userSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'cart',
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
      .addCase(addProduct.pending, state => {
        state.error = null;
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(addProduct.fulfilled, (state, {payload}) => {
        console.log('payload : ', payload);
        state.error = null;
        state.loading = false;
        state.userData = payload;
        state.msg = 'SUCCESS_ADD_PRODUCT';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(addProduct.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_ADD_PRODUCT';
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
