import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a type for the slice state
interface UserState {
  email: string;
  name: string;
  token: string;
  imgURL: string;
  isLogged: boolean;
  password: string;
}

// Define the initial state using that type
const initialState: UserState = {
  email: '',
  password: '',
  name: 'Aedin',
  imgURL: '',
  token: '',
  isLogged: false,
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
      state.isLogged = true;
      state.email = action.payload.email;
      state.password = action.payload.password;

      state.token = '내가 만든 쿠키';
      let data = {email: state.email, password: state.password};

      axios
        .post('/login', data)
        .then(res => console.log('토큰내놔~~~~~~~~~'))
        .catch(err => console.log('로그인 실패~~~'));

      AsyncStorage.setItem('token', state.token);
    },
    logoutAccount(state) {
      state.isLogged = false;
      state.email = null;
      state.name = null;
    },
    registerAccount(state) {},
  },
});

// 리듀서 액션
export const {loginAccount, logoutAccount} = userSlice.actions;

// useS
export const selectEmail = (state: RootState) => state.user.email;
export const selectToken = (state: RootState) => state.user.token;

export default userSlice.reducer;
