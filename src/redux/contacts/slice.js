import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addContact,
  deleteContact,
  fetchContacts,
  patchContact,
} from "./operations.js";
import { logout } from "../auth/operations.js";
import toast from "react-hot-toast";

const initialState = {
  items: [],
  loading: false,
  error: false,
};

const slice = createSlice({
  name: "contacts",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.items = action.payload.data.data;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id != action.payload.data._id
        );
        toast.success(`Contact ${action.payload.data.name} deleted successfully.`);
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
        toast.success(`Contact ${action.payload.data.name} successfully added.`);
      })
      .addCase(patchContact.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
        state.items.push(action.payload.data);
        toast.success(`Contact ${action.payload.data.name} has been edited.`);
      })
      .addCase(logout.fulfilled, () => initialState)
      .addMatcher(
        isAnyOf(
          fetchContacts.pending,
          deleteContact.pending,
          addContact.pending,
          patchContact.pending
        ),
        (state) => {
          state.error = false;
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchContacts.fulfilled,
          deleteContact.fulfilled,
          addContact.fulfilled,
          patchContact.fulfilled
        ),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchContacts.rejected,
          deleteContact.rejected,
          addContact.rejected,
          patchContact.rejected
        ),
        (state) => {
          state.loading = false;
          state.error = true;
        }
      );
  },
});

export const contactsReducer = slice.reducer;
