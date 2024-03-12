import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PROJECTS, PROJECT_INVITE_USERS_EXTERNAL, PROJECT_INVITE_USERS_INTERNAL, PROJECT_SUBCONTRACTORS, PROJECT_TEMPLATES, PROJECT_WORKFLOWS, _userList } from "src/_mock";
import axiosInstance, { endpoints } from "src/utils/axios";
import uuidv4 from "src/utils/uuidv4";


export const createNewProject = createAsyncThunk(
  'project/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.project.create, projectData);

      return response.data.data
    } catch (err) {
      console.error("errSlice", err)
      if (err && err.message) {
        throw Error(
          err.message
        );
      }
      throw Error(
        'An error occurred while creating the project.'
      );
    }
  },
)

export const getProjectList = createAsyncThunk(
  'project/list',
  async (_, { getState, rejectWithValue }) => {
    try {
      const email = getState()?.user?.user?.email; // Access the current state
      const response = await axiosInstance.get(endpoints.project.list);

      return response.data.data.project
    } catch (err) {
      console.error("errSlice", err)
      if (err && err.message) {
        throw Error(
          err.message
        );
      }
      throw Error(
        'An error occurred while fetching project list.'
      );
    }
  },
)




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
    list: [], // PROJECT_SUBCONTRACTORS
  },
  inviteUsers: {
    internal: [],
    external: [],
  },
  // workflows: [], // PROJECT_WORKFLOWS
  // template: {
  //   create: { name: '', trades: [] },
  //   list: [], // PROJECT_TEMPLATES
  // },
  users: [], // _userList 
  submittals:[],
  isLoading: false,
  error: null
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
  },
  extraReducers: (builder) => {
    // * Create New Project
    builder.addCase(createNewProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createNewProject.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createNewProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
    });
    builder.addCase(getProjectList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProjectList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getProjectList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
    });
  }
})

export const { setProjectName, setProjectTrades, setCreateTemplate, setProjectWorkflow, setCurrentProject, setInternalUsers, setExternalUsers, setAddInternalUser, setAddExternalUser, resetCreateProject, resetProjectState } = project.actions
export default project.reducer