import { createSlice } from "@reduxjs/toolkit";
import { PROJECTS } from "src/_mock";

// const initialState = {
//   list: PROJECTS || [],
//   current: {
//     name: '',
//     trades: [],
//     workflow: {
//       name: '',
//       status: [],
//       returnDate: '',
//     },
//     submittals: []
//   }
// }
const initialState = {
  list: PROJECTS || [],
  current: null
}

const project = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action) => {
      state.name = action.payload
    },
    setProjectTrades: (state, action) => {
      state.trades = action.payload
    },
    setProjectWorkflow: (state, action) => {
      state.workflow = action.payload
    },
    setCurrentProject: (state, action) => {
      state.current = action.payload
    },

  }
})

export const { setProjectName, setProjectTrades, setProjectWorkflow, setCurrentProject } = project.actions
export default project.reducer