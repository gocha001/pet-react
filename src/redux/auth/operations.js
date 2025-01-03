import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { store } from "../store.js";

export const Api = axios.create({
  // baseURL: "https://connections-api.goit.global/",
  baseURL: "https://nodejs-hw-mongodb-9-lmos.onrender.com",
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
  "login",
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

export const logout = createAsyncThunk("logout", async (_, thunkApi) => {
  try {
    await Api.post("/auth/logout");

  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const refresh = createAsyncThunk("refresh", async (_, thunkApi) => {
  const savedToken = thunkApi.getState().auth.token;

  if (!savedToken) {
    return thunkApi.rejectWithValue("Token does not exist!");
  };

  setAuthHeader(savedToken);

  try {
    const { data } = await Api.post("/auth/refresh");
    return data;
    
  } catch (error) {
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
        // Викликаємо refresh-дію
        const result = await store.dispatch(refresh());

        if (refresh.fulfilled.match(result)) {
          // Оновлюємо токен у заголовках
          const newToken = result.payload.accessToken;
          setAuthHeader(newToken);

          // Повторюємо запит
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return Api(originalRequest);
        } else {
          // Якщо оновлення не вдалося
          return Promise.reject(result.payload);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

 
