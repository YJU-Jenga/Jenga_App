import {Platform} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {back_address} from '../../config/address';

let SERVER_URL = back_address;

// // Define a type for the slice state
interface DeviceState {
  msg: string;
  loading: boolean;
  deviceData: object;
  errorMessage: string;
}

// Define the initial state using that type
const initialState: DeviceState = {
  msg: '',
  loading: false,
  deviceData: {},
  errorMessage: '',
};

// // 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

// export const getAllDevice = createAsyncThunk<
//   DeviceState[],
//   object,
//   {rejectValue: IError}
// >('device/getAllDevice', async thunkAPI => {
//   try {
//     const accessToken = await AsyncStorage.getItem('access-token');

//     const {data} = await axios.get(`${SERVER_URL}/device/getAll`, {
//       headers: {
//         authorization: 'Bearer ' + accessToken,
//       },

//       withCredentials: true,
//     });

//     console.log(data);
//     return data;
//   } catch (e) {
//     return thunkAPI.rejectWithValue({
//       errorMessage: e.response.data.message,
//     });
//   }
// });

export const syncDevice = createAsyncThunk<
  DeviceState[],
  object,
  {rejectValue: IError}
>('device/syncDevice', async (info, thunkAPI) => {
  try {
    console.log('안녕 ', info);
    const obj = {
      macAddress: info?.macAddress,
      userId: info?.userId,
    };

    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/device/sync`, obj, {
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

export const deleteDevice = createAsyncThunk<
  DeviceState[],
  object,
  {rejectValue: IError}
>('device/syncDevice', async (info, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const obj = {
      name: info.name,
      macAddress: info.macAddress,
      userId: null,
    };

    console.log(obj);

    const {data} = await axios.patch(
      `${SERVER_URL}/device/update/${info.deviceId}`,
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

export const getSyncedDeviceData = createAsyncThunk<
  DeviceState[],
  number,
  {rejectValue: IError}
>('device/getSyncedDeviceData', async (userId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.get(
      `${SERVER_URL}/device/syncedDevice/${userId}`,
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

export const deviceSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'device',
  // 초기 값
  initialState,
  reducers: {
    initDeviceErrorMessage: state => {
      state.errorMessage = '';
    },
  },

  extraReducers: builder => {
    builder
      // UPDATE
      // 통신 중
      .addCase(syncDevice.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(syncDevice.fulfilled, (state, {payload}) => {
        console.log('디바이스 업데이트 성공 : ', payload);
        state.loading = false;
        // state.userData = payload;
        state.msg = 'SUCCESS_SYNC_DEVICE';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(syncDevice.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_SYNC_DEVICE';
        state.errorMessage = payload?.errorMessage;
      })

      .addCase(getSyncedDeviceData.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      // 통신 성공
      .addCase(getSyncedDeviceData.fulfilled, (state, {payload}) => {
        console.log('통신 성공 : ', payload);
        state.loading = false;
        state.deviceData = payload;
        state.msg = 'SUCCESS_GET_SYNCED_DEVICE_DATA';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(getSyncedDeviceData.rejected, (state, {payload}) => {
        console.log('통신 실패 : ', payload);
        state.loading = false;
        state.msg = 'FAILED_GET_SYNCED_DEVICE_DATA';
        state.errorMessage = payload?.errorMessage;
      });
  },
});

// // 리듀서 액션
export const {initDeviceErrorMessage} = deviceSlice.actions;

// // useS
export const selectDeviceErrorMsg = (state: RootState) =>
  state.device.errorMessage;
export const selectDeviceData = (state: RootState) => state.device.deviceData;

export default deviceSlice.reducer;
