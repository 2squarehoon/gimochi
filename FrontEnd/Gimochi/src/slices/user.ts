/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userNickname: '',
  accessToken: '',
  accessTokenExpiresAt: '',
  userId: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action) {
      state.accessToken = action.payload.accessToken;
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
      state.userId = action.payload.userId;
      state.userNickname = action.payload.userNickname;
    },
    setLogout(state) {
      state.accessToken = '';
      state.accessTokenExpiresAt = '';
      state.userId = '';
      state.userNickname = '';
    },
    setToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
