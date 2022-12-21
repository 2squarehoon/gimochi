/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reload: '',
};
const reloadSlice = createSlice({
  name: 'reload',
  initialState,
  reducers: {
    setReload(state, action) {
      state.reload = action.payload.reload;
    },
  },
  extraReducers: (builder) => {},
});

export default reloadSlice;
