// import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../auth/operations";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchAll",
  async (_, thunkApi) => {
    try {
      const { data } = await Api.get("/contacts");
      console.log(data);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, thunkApi) => {
    try {
      const { data } = await Api.delete(`/contacts/${id}`);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (body, thunkApi) => {
    try {
      const { data } = await Api.post(`/contacts`, body);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const patchContact = createAsyncThunk(
  "contacts/patchContact",
  async ({ values, id }, thunkApi) => {
    try {
      const { data } = await Api.patch(`/contacts/${id}`, values);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);