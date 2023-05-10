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
interface AlarmState {
  msg: string;
  loading: boolean;
  alarmData: any;
  repeatData: Array<object>;
  error: null;
  errorMessage: string;
}

// Define the initial state using that type
const initialState: AlarmState = {
  msg: '',
  loading: false,
  error: null,
  alarmData: [],
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

export const createAlarm = createAsyncThunk<
  AlarmState[],
  number,
  {rejectValue: IError}
>(
  'alarm/createAlarm',
  async (info, thunkAPI) => {
    const body = new FormData();
    body.append('user_id', JSON.stringify({user_id: 1}));
    body.append('time_id', JSON.stringify({time_id: '1200'}));
    body.append('name', JSON.stringify({name: '잠잘시간~~~~^^'}));
    body.append('sentence', JSON.stringify({sentence: 'ㅇㅇ야 잘 ㅅ지삭ㄴ'}));
    body.append('state', JSON.stringify({state: true}));
    body.append('repeat', JSON.stringify({repeat: '0000000'}));

    body.append('file', {
      uri: 'file:///Users/aedin/Library/Developer/CoreSimulator/Devices/0C76F39F-CEFE-4E03-836E-9F412AFC5F86/data/Containers/Data/Application/29F21345-25DE-4117-AC9A-6851A91E8F60/Library/Caches/DocumentPicker/AE5B3089-BFF1-4951-A9F4-8C14E33FBDA3.mp3',
      type: 'audio/mpeg',
      name: 'Part_02.mp3',
    });

    try {
      const accessToken = await AsyncStorage.getItem('access-token');

      const {data} = await axios.post(`${SERVER_URL}/alarm/create`, body, {
        headers: {
          authorization: 'Bearer ' + accessToken,
          'Content-Type': 'Multipart/form-data',
        },
        withCredentials: true,
      });
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue({
        errorMessage: e.response.data,
      });
    }
  },
  {
    serializableCheck: false,
  },
);

export const getAllAlarm = createAsyncThunk<
  AlarmState[],
  object,
  {rejectValue: IError}
>('alarm/getAllAlarm', async (userId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.get(`${SERVER_URL}/alarm/getAll/${userId}`, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const getOneAlarm = createAsyncThunk<
  AlarmState[],
  object,
  {rejectValue: IError}
>('alarm/getOneAlarm', async (alarmId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.get(`${SERVER_URL}/alarm/getOne/${alarmId}`, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const updateAlarm = createAsyncThunk<
  AlarmState[],
  object,
  {rejectValue: IError}
>('alarm/updateAlarm', async (info, thunkAPI) => {
  try {
    const obj = {
      user_id: 1,
      time_id: '1200',
      name: '잠잘시간',
      sentence: '○○야 잘시간이야~',
      state: true,
      repeat: '0000000',
    };

    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.patch(`${SERVER_URL}/alarm/create`, obj, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const deleteAlarm = createAsyncThunk<
  AlarmState[],
  object,
  {rejectValue: IError}
>('alarm/deleteAlarm', async (alarmId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.delete(`${SERVER_URL}/alarm/delete/${alarmId}`, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

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
  extraReducers: builder => {
    builder
      // 통신 중
      .addCase(createAlarm.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(createAlarm.fulfilled, (state, {payload}) => {
        console.log('~승공 ', payload);
        state.error = null;
        state.loading = false;
        state.userData = payload;
        state.msg = 'SUCCESS_LOGIN';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(createAlarm.rejected, (state, {payload}) => {
        console.log('~싱ㄴ리ㅏㄹㅇ넝ㄹ니ㅏㅓㅇㄴ리패~!@!@!@! ', payload);
        state.loading = false;
        state.msg = 'FAILED_LOGIN';
        state.errorMessage = payload?.errorMessage;
      });
    // 회원가입
    // .addCase(registerAccount.pending, state => {
    //   state.error = null;
    //   state.loading = true;
    // })
    // .addCase(registerAccount.fulfilled, (state, {payload}) => {
    //   state.error = null;
    //   state.loading = false;
    //   state.msg = 'SUCCESS_REGISTER';
    //   state.errorMessage = '';
    //   state.accessToken = payload?.access_token;
    // })
    // .addCase(registerAccount.rejected, (state, {payload}) => {
    //   console.log('레지스터 실패ㅣ ', state);
    //   state.errorMessage = payload?.errorMessage;
    //   state.loading = false;
    //   state.msg = 'FAILED_REGISTER';
    // })
    // // 토큰 재발급
    // .addCase(refreshToken.pending, state => {
    //   state.error = null;
    // })
    // .addCase(refreshToken.fulfilled, (state, {payload}) => {
    //   state.error = null;
    //   state.msg = 'SUCCESS_REFRESH_TOKEN';
    //   state.accessToken = payload?.access_token;
    //   state.refreshToken = payload?.refresh_token;
    // })
    // .addCase(refreshToken.rejected, (state, {payload}) => {
    //   state.msg = 'FAILED_REFRESH_TOKEN';
    // })
    // // 로그아웃
    // .addCase(logout.pending, state => {
    //   state.error = null;
    // })
    // .addCase(logout.fulfilled, (state, {payload}) => {
    //   state.error = null;
    //   state.msg = 'SUCCESS_LOGOUT';
    // })
    // .addCase(logout.rejected, (state, {payload}) => {
    //   state.msg = 'FAILED_LOGOUT';
    // });
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
export const selectAlarmData = (state: RootState) => state.alarm.alarmData;
// export const selectMsg = (state: RootState) => state.user.msg;

export default scheduleSlice.reducer;
