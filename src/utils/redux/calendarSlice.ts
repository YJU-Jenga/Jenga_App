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
interface CalendarState {
  msg: string;
  loading: boolean;
  calendarData: object;
  errorMessage: string;
}

// Define the initial state using that type
const initialState: CalendarState = {
  msg: '',
  loading: false,
  calendarData: {},
  errorMessage: '',
};

// // 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

export const createCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calender/createCalendar', async (calendarData: object, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(
      `${SERVER_URL}/calendar/create`,
      calendarData,
      {
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
        withCredentials: true,
      },
    );

    console.log(data);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const getAllCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calendar/getAllCalendar', async (userId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/calendar/all`, userId, {
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

export const getMonthCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calendar/getMonthCalendar', async (info, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/calendar/month`, info, {
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

export const getWeekCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calendar/getWeekCalendar', async (userId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/calendar/week`, userId, {
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

export const getDateCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calendar/getDateCalendar', async (userId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/calendar/date`, userId, {
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

export const updateCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calendar/updateCalendar', async (info, thunkAPI) => {
  try {
    const obj = {
      title: info.title,
      start: info.start,
      end: info.end,
      location: info.location,
      description: info.description,
    };
    const calendarId = info.id;
    console.log(info);
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.patch(
      `${SERVER_URL}/calendar/update_calendar/${info.id}`,
      obj,
      {
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
        withCredentials: true,
      },
    );
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const deleteCalendar = createAsyncThunk<
  CalendarState[],
  object,
  {rejectValue: IError}
>('calendar/deleteCalendar', async (calendarId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');
    console.log(calendarId);

    const {data} = await axios.delete(
      `${SERVER_URL}/calendar/delete_calendar/${calendarId}`,
      {
        //data: {id: calendarId},
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
        withCredentials: true,
      },
    );
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const calendarSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'calendar',
  // 초기 값
  initialState,
  reducers: {
    initCalendarErrorMessage: state => {
      state.errorMessage = '';
    },
  },

  extraReducers: builder => {
    builder
      // 통신 중
      .addCase(createCalendar.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(createCalendar.fulfilled, (state, {payload}) => {
        console.log('통신 성공 : ', payload);
        state.loading = false;
        // state.userData = payload;
        state.msg = 'SUCCESS_CREATE_CALENDAR';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(createCalendar.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_CREATE_CALENDAR';
        state.errorMessage = payload?.errorMessage;
      })

      // UPDATE
      // 통신 중
      .addCase(updateCalendar.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(updateCalendar.fulfilled, (state, {payload}) => {
        console.log('통신 성공 : ', payload);
        state.loading = false;
        // state.userData = payload;
        state.msg = 'SUCCESS_UPDATE_CALENDAR';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(updateCalendar.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_UPDATE_CALENDAR';
        state.errorMessage = payload?.errorMessage;
      })

      // DELETE
      // 통신 중
      .addCase(deleteCalendar.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(deleteCalendar.fulfilled, (state, {payload}) => {
        console.log('삭제');
        state.loading = false;
        // state.userData = payload;
        state.msg = 'SUCCESS_DELETE_CALENDAR';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(deleteCalendar.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_DELETE_CALENDAR';
        state.errorMessage = payload?.errorMessage;
      })

      // ALL
      .addCase(getAllCalendar.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(getAllCalendar.fulfilled, (state, {payload}) => {
        console.log('통신 성공 : ', payload);
        state.loading = false;
        // state.userData = payload;
        state.msg = 'SUCCESS_GET_ALL_CALENDAR';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(getAllCalendar.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_GET_ALL_CALENDAR';
        state.errorMessage = payload?.errorMessage;
      })

      // Month
      .addCase(getMonthCalendar.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(getMonthCalendar.fulfilled, (state, {payload}) => {
        console.log('통신 성공 : ', payload);
        state.loading = false;
        state.calendarData = payload;
        state.msg = 'SUCCESS_GET_MONTH_CALENDAR';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(getMonthCalendar.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_GET_MONTH_CALENDAR';
        state.errorMessage = payload?.errorMessage;
      });
  },
});

// // 리듀서 액션
export const {initCalendarErrorMessage} = calendarSlice.actions;

// // useS
export const selectCalendarErrorMsg = (state: RootState) =>
  state.calendar.errorMessage;
export const SelectCalendarData = (state: RootState) =>
  state.calendar.calendarData;

export default calendarSlice.reducer;
