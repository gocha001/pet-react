import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { store } from "../store.js";
import { setToken } from "./slice.js";

export const Api = axios.create({
  // baseURL: "https://connections-api.goit.global/",
  baseURL: "https://nodejs-hw-mongodb-9-lmos.onrender.com",
  withCredentials: true,
  // baseURL: "http://localhost:3000/",
});

const setAuthHeader = (token) => {
  Api.defaults.headers.common.Authorization = `Bearer ${token}`;
  Api.defaults.withCredentials = true;
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
  };

  setAuthHeader(savedToken);

  try {
    const { data } = await Api.post("/auth/refresh");
    return data;
    
  } catch (error) {
    console.error("Error in refresh token:", error);
    return thunkApi.rejectWithValue(error.response?.data || error.message);
  }
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Original request:", originalRequest.url);
    console.log("Response status:", error.response?.status);
    console.log("Retry flag:", originalRequest._retry);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      console.log("Retry flag:", originalRequest._retry);
      console.log("Retrying with refresh token...");

      try {
        // Викликаємо refresh-дію
        const result = await store.dispatch(refresh());

        if (refresh.fulfilled.match(result)) {
          // Оновлюємо токен у заголовках
          const newToken = result.payload.accessToken;

          console.log("New token received:", newToken);
          store.dispatch(setToken(newToken));

          setAuthHeader(newToken);

          // Повторюємо запит
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return Api(originalRequest);
        } else {
          // Якщо оновлення не вдалося
          console.error("Refresh token failed:", result.payload);
          store.dispatch(logout());
          return Promise.reject(result.payload);
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
