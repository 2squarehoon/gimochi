/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  screenArray: [],
};
const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    addScreen(state, action) {
      state.screenArray = [...state.screenArray, action.payload.screen];
    },
    deleteScreen(state) {
      state.screenArray = state.screenArray.slice(0, state.screenArray.length - 1);
    },
    resetScreen(state) {
      state.screenArray = [];
    },
  },
  extraReducers: (builder) => {},
});

export default screenSlice;
