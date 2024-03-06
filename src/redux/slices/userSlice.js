import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  tokens: {},
  isLoggedIn: false,
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
  }
})

export const { signIn, signOut, setUserData } = user.actions
export default user.reducer