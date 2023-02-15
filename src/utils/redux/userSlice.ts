import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../../store';

// Define a type for the slice state
interface CounterState {
  id: string;
  name: string;
  imgURL: string;
}

// Define the initial state using that type
const initialState: CounterState = {
  id: 'panda01com',
  name: 'Aedin',
  imgURL: '',
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
    getUserInfo(state, action) {
      //state.push(action.payload);
      state.id = 'test';
      state.imgURL = 'testImg';
      state.name = 'admin';
    },
  },
});

export const {getUserInfo} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;
export const selectId = (state: RootState) => state.user.id;

export default userSlice.reducer;
