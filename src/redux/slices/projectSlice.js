import { createSlice } from "@reduxjs/toolkit";
import { PROJECTS, PROJECT_TEMPLATES, PROJECT_WORKFLOWS } from "src/_mock";

// const initialState = {
//   list: PROJECTS || [],
//   current: null,
//   new: {
//     name: '',
//     trades: [],
//     workflow: {
//       name: '',
//       statuses: [],
//       returnDate: '',
//     },
//    },
// //     submittals: []
//   }
// }
// const assignSubcontractor ={ _id: '',tradeId:'',subcontractorId:'' }
// const outsideUser ={ name: '', _id: '', email: '', role: '' }
const projectObj = {
  name: '',
  trades: [],
  workflow: {
    name: '',
    statuses: [],
    returnDate: '',
  },
}

const initialState = {
  list: PROJECTS || [],
  current: null,
  project: {
    name: '',
    trades: [],
    workflow: {
      name: '',
      statuses: [],
      returnDate: '',
    },
  },
  subcontractors: {
    list: [],
    assign: []
  },
  inviteUsers: {
    inside: {
      internal: [],
      external: [],
    },
    outside: [],
  },
  workflows: PROJECT_WORKFLOWS || [],
  templates: PROJECT_TEMPLATES || [],
}

const project = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action) => {
      state.project.name = action.payload
    },
    setProjectTrades: (state, action) => {
      state.project.trades = action.payload
    },
    setProjectWorkflow: (state, action) => {
      state.project.workflow = action.payload
    },
    setCurrentProject: (state, action) => {
      state.current = action.payload
    },
    resetCreateProject: (state) => {
      state.project = projectObj
    },

  }
})

export const { setProjectName, setProjectTrades, setProjectWorkflow, setCurrentProject, resetCreateProject } = project.actions
export default project.reducer