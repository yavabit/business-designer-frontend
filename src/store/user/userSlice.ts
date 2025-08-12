import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isAuth: false,
	name: '',
	email: '',
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.isAuth = payload;
    },
    setName: (state, { payload }) => {
      state.name = payload;
    },
    setEmail: (state, { payload }) => {
      state.email = payload;
    },
    reset: () => initialState,
  },
});

export const userReducer = userSlice.reducer;
export const {setAuth, setName, setEmail, reset } = userSlice.actions;