import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { store } from "../store.js";

export const Api = axios.create({
  baseURL: "https://nodejs-hw-mongodb-9-lmos.onrender.com",
  withCredentials: true,
  // baseURL: "http://localhost:3000/",
});

const setAuthHeader = (token) => {
  Api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const register = createAsyncThunk(
  "register",
  async (credentials, thunkApi) => {
    try {
      const { data } = await Api.post("/auth/register", credentials);

      setAuthHeader(data.accessToken);

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const { data } = await Api.post("/auth/login", credentials);

      setAuthHeader(data.accessToken);

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    await Api.post("/auth/logout");
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const refresh = createAsyncThunk("auth/refresh", async (_, thunkApi) => {
  const savedToken = thunkApi.getState().auth.token;

  if (!savedToken) {
    return thunkApi.rejectWithValue("Token does not exist!");
  }
  setAuthHeader(savedToken);
  try {
    const { data } = await Api.post("/auth/refresh");

    if (!data.accessToken) {
      throw new Error("No accessToken in server response");
    }
    return data;
  } catch (error) {
    console.error("Error in refresh token:", error);
    return thunkApi.rejectWithValue(error.message);
  }
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const result = await store.dispatch(refresh());
        const newToken = result.payload.accessToken;
        setAuthHeader(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return Api(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token:", err);
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
