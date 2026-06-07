import { createSlice } from "@reduxjs/toolkit";

const initialState: { theme: string } = {
  theme: localStorage.getItem("theme")
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload.theme
    },
  }
});

export const {
  setTheme
} = themeSlice.actions;

export default themeSlice.reducer;