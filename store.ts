import {configureStore} from '@reduxjs/toolkit';

// Slice -> Reducer of ~~Slice
import authReducer from './src/utils/redux/authSlice';
import userReducer from './src/utils/redux/userSlice';
import scheduleReducer from './src/utils/redux/scheduleSlice';
import calendarReducer from './src/utils/redux/calendarSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    schedule: scheduleReducer,
    calendar: calendarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
