import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const updatePasswordFirstLogin = createAsyncThunk(
  'auth/updatePasswordFirstLogin',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.auth.updatePassword, data);

      return response.data.data.user.isTempPassword;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while updating the password.');
    }
  }
);

export const authSwitchProject = createAsyncThunk(
  'auth/project-switch',
  async (projectData, { getState, rejectWithValue }) => {
    try {
      // const email = getState()?.user?.user?.email; // Access the current state
      const response = await axiosInstance.post(endpoints.project.switch, projectData);
      console.log('projectData', projectData);
      console.log('response.data.data', response.data.data);
      return response.data.data.tokens;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while changing project.');
    }
  }
);

const initialState = {
  user: {},
  tokens: {},
  isLoggedIn: false,
  isLoading: true,
  error: null,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.tokens = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = {};
      state.tokens = {};
      state.isLoggedIn = false;
    },
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
    builder.addCase(authSwitchProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authSwitchProject.fulfilled, (state, action) => {
      console.log('action.payload', action.payload);
      state.tokens = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(authSwitchProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { signIn, signOut, setUserData } = user.actions;
export default user.reducer;
