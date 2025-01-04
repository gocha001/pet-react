// import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "../auth/operations";
import { selectIsRefreshing } from "../auth/selectors";
import { useSelector } from "react-redux";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchAll",
  async (_, thunkApi) => {
    try {
      const isRefreshing = useSelector(selectIsRefreshing);
      if (isRefreshing === false) {
        const { data } = await Api.get("/contacts");
        return data;
      } else {
        return;
      }
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
