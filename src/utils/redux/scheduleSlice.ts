import {Platform} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {back_address} from '../../config/address';

let SERVER_URL = back_address;
// let SERVER_URL = 'http://127.0.0.1:5001';
// if (Platform.OS === 'android') {
//   SERVER_URL = 'http://10.0.2.2:5001';
// }

// // Define a type for the slice state
interface ScheduleState {
  msg: string;
  loading: boolean;
  musicData: any;
  repeatData: Array<object>;
  error: null;
  errorMessage: string;
}

// Define the initial state using that type
const initialState: ScheduleState = {
  msg: '',
  loading: false,
  error: null,
  musicData: [],
  repeatData: [
    {day: '일요일', isChecked: false},
    {day: '월요일', isChecked: false},
    {day: '화요일', isChecked: false},
    {day: '수요일', isChecked: false},
    {day: '목요일', isChecked: false},
    {day: '금요일', isChecked: false},
    {day: '토요일', isChecked: false},
  ],
  errorMessage: '',
};

// // 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

export const scheduleSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'schedule',
  // 초기 값
  initialState,
  reducers: {
    initScheduleState: state => {
      state.repeatData = [
        {day: '일요일', isChecked: false},
        {day: '월요일', isChecked: false},
        {day: '화요일', isChecked: false},
        {day: '수요일', isChecked: false},
        {day: '목요일', isChecked: false},
        {day: '금요일', isChecked: false},
        {day: '토요일', isChecked: false},
      ];
      state.musicData = [];
    },
    initEditScheduleState: (state, action) => {
      console.log(action.payload);
      state.repeatData = action.payload.repeat;
      state.musicData = action.payload.soundFile;
    },
    createScheduleActionInfo: (state, action) => {
      state.musicData = action.payload;
    },
    createScheduleRepeatInfo: (state, action) => {
      // const day: string = action.payload.day;
      const check: boolean = action.payload.isChecked;
      // state.repeatData.map(item =>
      //   item.day === day ? (item.isChecked = !check) : (item.isChecked = check),
      // );
      const findDay = state.repeatData.findIndex(
        item => item.day === action.payload.day,
      );
      console.log(state.repeatData[findDay].day);
      if (!isNaN(findDay)) {
        state.repeatData[findDay].isChecked =
          !state.repeatData[findDay].isChecked;
      }
    },
  },
});

// // 리듀서 액션
export const {
  createScheduleActionInfo,
  createScheduleRepeatInfo,
  initScheduleState,
  initEditScheduleState,
} = scheduleSlice.actions;

// // useS
export const selectSoundInfo = (state: RootState) => state.schedule.musicData;
export const selectRepeatInfo = (state: RootState) => state.schedule.repeatData;
// export const selectMsg = (state: RootState) => state.user.msg;

export default scheduleSlice.reducer;
