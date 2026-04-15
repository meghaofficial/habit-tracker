import { createSlice } from "@reduxjs/toolkit";

interface FormDataState {
  id: string;
  username: string;
  email: string;
  accessToken: string;
}

const initialState: FormDataState = {
  id: "",
  username: "",
  email: "",
  accessToken: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCreds: (state, action) => {
      const { id, username, email, accessToken } = action.payload;
      if (!id || !username || !email || !accessToken) return;
      state.id = id;
      state.username = username;
      state.email = email;
      state.accessToken = accessToken;
    },
    removeCreds: (state) => {
      state.id = "";
      state.username = "";
      state.email = "";
      state.accessToken = "";
    }
  }
});

export const {
  setCreds, removeCreds
} = authSlice.actions;

export default authSlice.reducer;