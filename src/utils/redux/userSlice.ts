import {createSlice, current, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import produce from 'immer';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = 'http://127.0.0.1:5001';
// Define a type for the slice state
interface UserState {
  email: string;
  name: string;
  token: string;
  imgURL: string;
  isLogged: boolean;
  password: string;
  msg: string;
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
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // increment: state => {
    //   state.value += 1;
    // },
    // decrement: state => {
    //   state.value -= 1;
    // },

    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    loginAccount(state, action) {
      state.email = action.payload.email;
      state.password = action.payload.password;
      let data = {email: state.email, password: state.password};

      // 👇 얘는 되는데
      const failMsg = 'FAILED_LOGIN';
      state.msg = failMsg;

      axios
        .post(`${SERVER_URL}/auth/local/signin`, data)
        .then(res => {
          // res.data.access_token); //refresh_token

          if (res.data.access_token) {
            AsyncStorage.setItem('token', res.data.access_token);
            // 👇 얘는 안댐
            const failMsg = 'FAILED_LOGIN';
            state.msg = failMsg;
            // state.isLogged = true;
            // return produce(state, draft => {
            //   draft.msg = action.payload.msg;
            // });
          }
        })
        .catch(err => console.error(err));
    },
    logoutAccount(state) {
      state.isLogged = false;
      state.email = null;
      state.name = null;
    },
    registerAccount(state, action) {},
  },
});

// 리듀서 액션
export const {loginAccount, logoutAccount} = userSlice.actions;

// useS
export const selectEmail = (state: RootState) => state.user.email;
export const selectToken = (state: RootState) => state.user.token;
export const selectMsg = (state: RootState) => state.user.msg;

export default userSlice.reducer;
