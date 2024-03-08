import { createSlice } from "@reduxjs/toolkit";
import { PROJECTS, PROJECT_INVITE_USERS_EXTERNAL, PROJECT_INVITE_USERS_INTERNAL, PROJECT_SUBCONTRACTORS, PROJECT_TEMPLATES, PROJECT_WORKFLOWS, _userList } from "src/_mock";
import uuidv4 from "src/utils/uuidv4";

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
// PROJECTS ||
const initialState = {
  list: [],

  current: null,
  create: { ...projectObj },
  subcontractors: {
    list: PROJECT_SUBCONTRACTORS || [],
    assign: []
  },
  inviteUsers: {
    internal: [],
    external: [],
  },
  workflows: PROJECT_WORKFLOWS || [],
  template: {
    create: { name: '', trades: [] },
    list: PROJECT_TEMPLATES || [],
  },
  users: _userList || [],
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
      state.inviteUsers.internal = action.payload
    },
    setExternalUsers: (state, action) => {
      state.inviteUsers.external = action.payload
    },
    setAddInternalUser: (state, action) => {
      state.inviteUsers.internal = [...state.inviteUsers.internal, action.payload]
    },
    setAddExternalUser: (state, action) => {
      state.inviteUsers.external = [...state.inviteUsers.external, action.payload]
    },
    setCreateTemplate: (state, action) => {
      state.template.create = action.payload;
    },
    resetCreateProject: (state) => {
      state.create = projectObj;
      state.template.create = { name: '', trades: [] };
      state.inviteUsers = {
        internal: [],
        external: [],
      };
    },
    resetProjectState: () => initialState,
  }
})

export const { setProjectName, setProjectTrades, setCreateTemplate, setProjectWorkflow, setCurrentProject, setInternalUsers, setExternalUsers, setAddInternalUser, setAddExternalUser, resetCreateProject, resetProjectState } = project.actions
export default project.reducer