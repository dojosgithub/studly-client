import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { endpoints } from "src/utils/axios";



export const updatePasswordFirstLogin = createAsyncThunk(
  'auth/updatePasswordFirstLogin',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.updatePassword, data);

      return response.data.data.user.isTempPassword
    } catch (err) {
      console.error("errSlice", err)
      if (err && err.message) {
        throw Error(
          err.message
        );
      }
      throw Error(
        'An error occurred while updating the password.'
      );
    }
  },
)


const initialState = {
  user: {},
  tokens: {},
  isLoggedIn: false,
  isLoading: true,
  error: null
}

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload.user
      state.isLoggedIn = true
      state.tokens = { accessToken: action.payload.accessToken, refreshToken: action.payload.refreshToken, }
    },
    setUserData: (state, action) => {
      state.user = action.payload
    },
    signOut: (state) => {
      state.user = {}
      state.tokens = {}
      state.isLoggedIn = false
    }
  },
  extraReducers: (builder) => {
    // * Update Password First Login
    builder.addCase(updatePasswordFirstLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePasswordFirstLogin.fulfilled, (state, action) => {
      state.user.isTempPassword = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updatePasswordFirstLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  }
})

export const { signIn, signOut, setUserData } = user.actions
export default user.reducer