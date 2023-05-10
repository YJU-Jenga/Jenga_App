import {configureStore} from '@reduxjs/toolkit';

// Slice -> Reducer of ~~Slice
import authReducer from './src/utils/redux/authSlice';
import userReducer from './src/utils/redux/userSlice';
import alarmReducer from './src/utils/redux/alarmSlice';
import calendarReducer from './src/utils/redux/calendarSlice';
import deviceReducer from './src/utils/redux/deviceSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    alarm: alarmReducer,
    calendar: calendarReducer,
    device: deviceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
