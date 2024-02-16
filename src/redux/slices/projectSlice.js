import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name:'',
    trades:[],
    workflow:'',
    templates:[],
}

const project = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action) => {
      state.name = action.payload
    },
    
  }
})

export const {signIn, signOut} = project.actions
export default project.reducer