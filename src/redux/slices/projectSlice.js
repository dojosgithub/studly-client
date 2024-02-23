import { createSlice } from "@reduxjs/toolkit";
import { PROJECTS, PROJECT_SUBCONTRACTORS, PROJECT_TEMPLATES, PROJECT_WORKFLOWS } from "src/_mock";

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
  create: {
    name: '',
    trades: [],
    workflow: {
      name: '',
      statuses: [],
      returnDate: '',
    },
  },
  subcontractors: {
    list: PROJECT_SUBCONTRACTORS || [],
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
      state.create.name = action.payload
    },
    setProjectTrades: (state, action) => {
      state.create.trades = action.payload
    },
    setProjectWorkflow: (state, action) => {
      state.create.workflow = action.payload
    },
    setCurrentProject: (state, action) => {
      state.current = action.payload
    },
    setInternalUsers: (state, action) => {
      state.inviteUsers.inside.internal = action.payload
    },
    setExternalUsers: (state, action) => {
      state.inviteUsers.inside.external = action.payload
    },
    resetCreateProject: (state) => {
      state.create = projectObj;
      state.inviteUsers = {
        inside: {
          internal: [],
          external: [],
        },
        outside: [],
      };
    },
    resetProjectState: () => initialState,
  }
})

export const { setProjectName, setProjectTrades, setProjectWorkflow, setCurrentProject,setInternalUsers,setExternalUsers, resetCreateProject, resetProjectState } = project.actions
export default project.reducer