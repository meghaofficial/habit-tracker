import { createSlice } from "@reduxjs/toolkit";

interface FormDataState {
  username: string;
  email: string;
}

const initialState: FormDataState = {
  username: localStorage.getItem("localUsername") || "",
  email: localStorage.getItem("localEmail") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCreds: (state, action) => {
      const { username, email } = action.payload;
      if (!username || !email) return;
      state.username = username;
      state.email = email;
      localStorage.setItem("localUsername", username);
      localStorage.setItem("localEmail", email);
    },
    removeCreds: (state) => {
      state.username = "";
      state.email = "";
      localStorage.removeItem("localUsername");
      localStorage.removeItem("localEmail");
    }
  }
});

export const {
  setCreds, removeCreds
} = authSlice.actions;

export default authSlice.reducer;