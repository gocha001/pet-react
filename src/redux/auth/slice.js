import { createSlice } from "@reduxjs/toolkit";
import {
  register, login, logout,
  refresh
} from "./operations.js";

const initialState = {
  user: {
    name: null,
    email: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload; // Оновлюємо токен
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.token = action.payload.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.token = action.payload.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(refresh.fulfilled, (state, action) => {
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refresh.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refresh.rejected, (state) => {
        state.isRefreshing = false;
      });
  },
});

export const { setToken } = slice.actions;
export const authReducer = slice.reducer;
