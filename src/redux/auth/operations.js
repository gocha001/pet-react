import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
  }
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

    // Якщо отримано статус 401 і токен ще не оновлювався
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Оновлення токена через refreshToken
        const { data } = await Api.post("/auth/refresh", {
          token: localStorage.getItem("refreshToken"),
          
        });

        // Оновлення заголовків
        Api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Повторний запит
        return Api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);