/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: 0,
};
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.notification = action.payload.notification;
    },
    deleteNotification(state) {
      state.notification = state.notification - 1;
    },
  },
  extraReducers: (builder) => {},
});

export default notificationSlice;
