import {configureStore} from '@reduxjs/toolkit';

// Slice -> Reducer of ~~Slice
import authReducer from './src/utils/redux/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;