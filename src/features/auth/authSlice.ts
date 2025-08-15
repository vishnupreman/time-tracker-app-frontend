import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

// Load from localStorage if available
const savedAuth = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth")!)
  : { accessToken: null, user: null };

const initialState: AuthState = {
  accessToken: savedAuth.accessToken,
  user: savedAuth.user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
