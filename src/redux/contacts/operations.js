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
  async (_id, thunkApi) => {
    try {
      const { data } = await Api.delete(`/contacts/${_id}`);
      console.log(`delete data${data}`);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (body, thunkApi) => {
    console.log(`body${body}`);
    try {
      const { data } = await Api.post(`/contacts`, body);
      console.log(data);
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
