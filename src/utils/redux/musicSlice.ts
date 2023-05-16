import {Platform} from 'react-native';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';
import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {back_address} from '../../config/address';

let SERVER_URL = back_address;

// // Define a type for the slice state
interface MusicState {
  msg: string;
  loading: boolean;
  musicData: any;
  error: null;
  errorMessage: string;
}

const initialState: MusicState = {
  msg: '',
  loading: false,
  error: null,
  musicData: [],
  errorMessage: '',
};

// // 통신 에러 시 보여줄 에러 메세지의 타입
interface IError {
  errorMessage: string;
}

export const createMusic = createAsyncThunk<
  MusicState[],
  object,
  {rejectValue: IError}
>('music/createMusic', async (info, thunkAPI) => {
  const body = new FormData();
  body.append('user_id', JSON.stringify({user_id: info.userId}));
  body.append('name', JSON.stringify({name: info.name}));
  body.append('file', {
    uri: info.soundInfo?.uri,
    name: info.soundInfo?.name,
    type: info.soundInfo?.mimeType,
  });

  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.post(`${SERVER_URL}/music/create`, body, {
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
});

export const getAllMusic = createAsyncThunk<
  MusicState[],
  number,
  {rejectValue: IError}
>('music/getAllMusic', async (userId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.get(`${SERVER_URL}/music/getAll/${userId}`, {
      headers: {
        authorization: 'Bearer ' + accessToken,
      },
      withCredentials: true,
    });

    console.log(data);

    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({
      errorMessage: e.response.data.message,
    });
  }
});

export const getOneMusic = createAsyncThunk<
  MusicState[],
  object,
  {rejectValue: IError}
>('music/getOneMusic', async (musicId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const {data} = await axios.get(`${SERVER_URL}/music/getOne/${musicId}`, {
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

export const updateMusic = createAsyncThunk<
  MusicState[],
  object,
  {rejectValue: IError}
>('music/updateMusic', async (info, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    const body = new FormData();
    body.append('user_id', JSON.stringify({user_id: info.userId}));
    body.append('name', JSON.stringify({name: info.name}));
    body.append('file', {
      uri: info.soundInfo?.uri,
      name: info.soundInfo?.name,
      type: info.soundInfo?.mimeType,
    });

    // let body = new FormData();
    // body.append('user_id', JSON.stringify({user_id: info.user_id}));
    // body.append('time_id', JSON.stringify({time_id: info.time_id}));
    // body.append('name', JSON.stringify({name: info.name}));
    // body.append('sentence', JSON.stringify({sentence: info.sentence}));
    // body.append('state', JSON.stringify({state: info.state}));
    // body.append('repeat', JSON.stringify({repeat: info.repeat})); Multipart/form-data
    // const obj = {
    //   user_id: info.user_id,
    //   time_id: info.time_id,
    //   name: info.name,
    //   sentence: info.sentence,
    //   file: 'uploads/music/asdf.mp3',
    //   state: info.state,
    //   repeat: info.repeat,
    // };

    const id = info.id;

    const {data} = await axios.patch(`${SERVER_URL}/music/update/${id}`, obj, {
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

export const deleteMusic = createAsyncThunk<
  MusicState[],
  number,
  {rejectValue: IError}
>('music/deleteMusic', async (musicId, thunkAPI) => {
  try {
    const accessToken = await AsyncStorage.getItem('access-token');

    console.log(musicId);

    const {data} = await axios.delete(`${SERVER_URL}/music/delete/${musicId}`, {
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

export const musicSlice = createSlice({
  // 슬라이스 이름 정의
  name: 'music',
  // 초기 값
  initialState,
  reducers: {
    // createMusicRepeatInfo: (state, action) => {
    //   console.log(action.payload, 'gg');
    //   state.repeatData = action.payload;
    // },
  },
  extraReducers: builder => {
    builder
      // 통신 중
      .addCase(createMusic.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(createMusic.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.musicData = payload;
        state.msg = 'SUCCESS_LOGIN';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(createMusic.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_LOGIN';
        state.errorMessage = payload?.errorMessage;
      })

      // GETALL
      .addCase(getAllMusic.pending, state => {
        state.error = null;
        state.loading = true;
      })

      // 통신 성공
      .addCase(getAllMusic.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.musicData = payload;
        state.msg = 'SUCCESS_GET_ALL_MUSIC';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(getAllMusic.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_GET_ALL_MUSIC';
        state.errorMessage = payload?.errorMessage;
      })

      // UPDATE Music
      .addCase(updateMusic.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(updateMusic.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.msg = 'SUCCESS_UPDATE_Music';
        state.errorMessage = '';
      })
      // 통신 에러
      .addCase(updateMusic.rejected, (state, {payload}) => {
        state.loading = false;
        console.log('fail', payload);
        state.msg = 'FAILED_UPDATE_Music';
        state.errorMessage = payload?.errorMessage;
      })

      // DELETE Music
      .addCase(deleteMusic.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(deleteMusic.fulfilled, (state, {payload}) => {
        state.error = null;
        state.loading = false;
        state.msg = 'SUCCESS_DELETE_Music';
        state.errorMessage = '';
        console.log('SUCCESS ', payload);
      })
      // 통신 에러
      .addCase(deleteMusic.rejected, (state, {payload}) => {
        state.loading = false;
        state.msg = 'FAILED_DELETE_Music';
        state.errorMessage = payload?.errorMessage;
        console.log('FAILED_DELETE_Music' + payload);
      });
  },
});

// // 리듀서 액션

// // useS
export const selectMusicData = (state: RootState) => state.music.musicData;
// export const selectMsg = (state: RootState) => state.user.msg;

export default musicSlice.reducer;
