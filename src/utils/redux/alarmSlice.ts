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
  repeatData: string;
  error: null;
  errorMessage: string;
}

// Define the initial state using that type
const initialState: AlarmState = {
  msg: '',
  loading: false,
  error: null,
  alarmData: [],
  repeatData: '0000000',
  errorMessage: '',
};

// // 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

export const createAlarm = createAsyncThunk<
  AlarmState[],
  object,
  {rejectValue: IError}
>('alarm/createAlarm', async (info, thunkAPI) => {
  const obj = {
    user_id: info.user_id,
    time_id: info.time_id,
    name: info.name,
    sentence: info.sentence,
    file: 'uploads/music/asdf.mp3',
    state: info.state,
    repeat: info.repeat,
  };

  // body.append('file', {
  //   uri: 'file:///Users/aedin/Library/Developer/CoreSimulator/Devices/0C76F39F-CEFE-4E03-836E-9F412AFC5F86/data/Containers/Data/Application/29F21345-25DE-4117-AC9A-6851A91E8F60/Library/Caches/DocumentPicker/AE5B3089-BFF1-4951-A9F4-8C14E33FBDA3.mp3',
  //   type: 'audio/mpeg',
  //   name: 'Part_02.mp3',
  // });

  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/alarm/create`, obj, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data,
    });
  }
});

export const getAllAlarm = createAsyncThunk<
  AlarmState[],
  number,
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

    // 시간 얻기
    // const hours = parseInt(data[0].time_id.substring(0, 2));
    // const minutes = parseInt(data[0].time_id.substring(2));
    // const utcDate = new Date(2001, 7 - 1, 6, hours, minutes);

    // const localDate = new Date(
    //   utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
    // );

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
    const accessToken = await AsyncStorage.getItem('access-token');

    // let body = new FormData();
    // body.append('user_id', JSON.stringify({user_id: info.user_id}));
    // body.append('time_id', JSON.stringify({time_id: info.time_id}));
    // body.append('name', JSON.stringify({name: info.name}));
    // body.append('sentence', JSON.stringify({sentence: info.sentence}));
    // body.append('state', JSON.stringify({state: info.state}));
    // body.append('repeat', JSON.stringify({repeat: info.repeat})); Multipart/form-data
    const obj = {
      user_id: info.user_id,
      time_id: info.time_id,
      name: info.name,
      sentence: info.sentence,
      file: 'uploads/music/asdf.mp3',
      state: info.state,
      repeat: info.repeat,
    };

    // body.append('file', JSON.stringify({file: 'uploads/music/asdf.mp3'}));

    const id = info.id;

    const {data} = await axios.patch(`${SERVER_URL}/alarm/update/${id}`, obj, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });

    return data;
  } catch (e) {
    console.log(e.response.data);
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const deleteAlarm = createAsyncThunk<
  AlarmState[],
  number,
  {rejectValue: IError}
>('alarm/deleteAlarm', async (alarmId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    console.log('DELETE ALARM');
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
      state.repeatData = '0000000';
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
    // createScheduleRepeatInfo: (state, action) => {
    //   console.log(action.payload, 'gg');
    //   state.repeatData = action.payload;
    // },
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
        state.error = null;
        state.loading = false;
        state.userData = payload;
        state.msg = 'SUCCESS_LOGIN';
        state.errorMessage = '';
        console.log(payload);
      })
      // 통신 에러
      .addCase(createAlarm.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_LOGIN';
        state.errorMessage = payload?.errorMessage;
        console.log(payload);
      })

      // GETALL
      .addCase(getAllAlarm.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(getAllAlarm.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.alarmData = payload;
        state.msg = 'SUCCESS_GET_ALL_ALARM';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(getAllAlarm.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_GET_ALL_ALARM';
        state.errorMessage = payload?.errorMessage;
      })

      // UPDATE ALARM
      .addCase(updateAlarm.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(updateAlarm.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.msg = 'SUCCESS_UPDATE_ALARM';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(updateAlarm.rejected, (state, {payload}) => {
        state.loading = false;
        console.log('fail', payload);
        state.msg = 'FAILED_UPDATE_ALARM';
        state.errorMessage = payload?.errorMessage;
      })

      // DELETE ALARM
      .addCase(deleteAlarm.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(deleteAlarm.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.msg = 'SUCCESS_DELETE_ALARM';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(deleteAlarm.rejected, (state, {payload}) => {
        state.loading = false;
        console.log('fail', payload);
        state.msg = 'FAILED_DELETE_ALARM';
        state.errorMessage = payload?.errorMessage;
      });
  },
});

// // 리듀서 액션
export const {
  //createScheduleActionInfo,
  //selectAlarmRepeatData,
  //initScheduleState,
  //initEditScheduleState,
} = scheduleSlice.actions;

// // useS
export const selectAlarmData = (state: RootState) => state.alarm.alarmData;
export const selectAlarmRepeatData = (state: RootState) =>
  state.alarm.repeatData;
// export const selectMsg = (state: RootState) => state.user.msg;

export default scheduleSlice.reducer;
