import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { store } from "../store.js";

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

