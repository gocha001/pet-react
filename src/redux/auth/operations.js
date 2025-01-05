import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { store } from "../store.js";
// import { setToken } from "./slice.js";

export const Api = axios.create({
  // baseURL: "https://connections-api.goit.global/",
  baseURL: "https://nodejs-hw-mongodb-9-lmos.onrender.com",
  withCredentials: true,
  // baseURL: "http://localhost:3000/",
});

const setAuthHeader = (token) => {
  Api.defaults.headers.common.Authorization = `Bearer ${token}`;
  // Api.defaults.withCredentials = true;
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
      console.log("Server response:", data); 
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
let read = false;
export const refresh = createAsyncThunk("auth/refresh", async (_, thunkApi) => {
  read = true;
  const savedToken = thunkApi.getState().auth.token;
  console.log(savedToken);
  if (!savedToken) {
    return thunkApi.rejectWithValue("Token does not exist!");
  };

  setAuthHeader(savedToken);

  try {
    const {data} = await Api.post("/auth/refresh");
    // const data = response.data;
     console.log("Server response:", data); // Перевірте, чи сервер повертає правильні дані

     if (!data.accessToken) {
       throw new Error("No accessToken in server response");
     }
    return data;
    
  } catch (error) {
    console.error("Error in refresh token:", error);
    return thunkApi.rejectWithValue(error.response?.data || error.message);
  } finally {
    read = false;
  }
});

export { read };

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

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          setAuthHeader(newToken);

          return Api(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token:", err);
        store.dispatch(logout());
        return Promise.reject(err);
      }
    };
    return Promise.reject(error);
  }
);
