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
export const getCurrentProjectTradesById = createAsyncThunk(
  'project/trades',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('id', id);
      const response = await axiosInstance.get(endpoints.project.trades(id));

      return response.data.data.trades
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


// get users list from
export const getCompanyUserList = createAsyncThunk(
  'company/user/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.company.userList);

      return response.data.data
    } catch (err) {
      console.error("errSlice", err)
      if (err && err.message) {
        throw Error(
          err.message
        );
      }
      throw Error(
        'An error occurred while creating the company.'
      );
    }
  },
)

// get subcontractor list in company
export const getCompanySubcontractorList = createAsyncThunk(
  'subcontractor/companyList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.company.subcontractorCompanyList);

      return response.data.data
    } catch (err) {
      console.error("errSlice", err)
      if (err && err.message) {
        throw Error(
          err.message
        );
      }
      throw Error(
        'An error occurred while creating the company.'
      );
    }
  },
)
// get subcontractor list in db
export const getAllSubcontractorList = createAsyncThunk(
  'subcontractor/dbList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.company.subcontractorList);

      return response.data.data
    } catch (err) {
      console.error("errSlice", err)
      if (err && err.message) {
        throw Error(
          err.message
        );
      }
      throw Error(
        'An error occurred while creating the company.'
      );
    }
  },
)

// export const inviteSubcontractor = createAsyncThunk(
//   'project/inviteSubcontractor',
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(endpoints.project.invite, data);

//       return response.data.data
//     } catch (err) {
//       console.error("errSlice", err)
//       if (err && err.message) {
//         throw Error(
//           err.message
//         );
//       }
//       throw Error(
//         'An error occurred while creating the project.'
//       );
//     }
//   },
// )


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
  members: [],
  // Invite
  subcontractors: {
    list: {
      all: [],
      company: [],
    },
    invited: [],
  },
  users: [], // PROJECT_USERS
  inviteUsers: {
    internal: [],
    external: [],
  },
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
    setCurrentProjectRole: (state, action) => {
      state.current = { ...state.current, role: action.payload }
    },
    setCurrentProjectTrades: (state, action) => {
      state.current = { ...state.current, trades: action.payload }
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
    setRemoveInternalUser: (state, action) => {
      state.inviteUsers.internal = state.inviteUsers.internal.filter((row) => row.id !== action.payload);
    },
    setRemoveExternalUser: (state, action) => {
      state.inviteUsers.external = state.inviteUsers.external.filter((row) => row.id !== action.payload);
    },
    setInvitedSubcontractor: (state, action) => {
      const subcontractorExists = state.subcontractors?.invited?.some(subcontractor =>
        subcontractor.email === action.payload.email
      );

      // If the subcontractor does not exist, add them to the invited array
      if (!subcontractorExists) {
        state.subcontractors.invited = [...state.subcontractors.invited, action.payload];
      }
    },
    setMembers: (state, action) => {
      const memberExists = state.members.some(member =>
        member.email === action.payload.email
      );

      // If the member does not exist, add them to the members array
      if (!memberExists) {
        state.members = [...state.members, action.payload];
      }
    },
    removeMember: (state, action) => {
      const filteredMembers = state.members.filter(member => member?.id !== action?.payload)
      state.members = filteredMembers
    },
    resetMembers: (state, action) => {
      state.members = []
    },
    resetCreateProject: (state) => {
      state.create = projectObj;
      state.members = [];
      state.subcontractors.invited = [];
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
    builder.addCase(getCurrentProjectTradesById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCurrentProjectTradesById.fulfilled, (state, action) => {
      state.current = { ...state.current, trades: action.payload }
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCurrentProjectTradesById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
    });

    // * Get Company User List
    builder.addCase(getCompanyUserList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCompanyUserList.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCompanyUserList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Get Subcontractor List in Company 
    builder.addCase(getCompanySubcontractorList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCompanySubcontractorList.fulfilled, (state, action) => {
      state.subcontractors.list.company = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCompanySubcontractorList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // * Get Subcontractor List in DB 
    builder.addCase(getAllSubcontractorList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllSubcontractorList.fulfilled, (state, action) => {
      state.subcontractors.list.all = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getAllSubcontractorList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // // * Invite Subcontractor
    // builder.addCase(inviteSubcontractor.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(inviteSubcontractor.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(inviteSubcontractor.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  }
})

export const { setProjectName, setProjectTrades, setCreateTemplate, setProjectWorkflow, setCurrentProject, setCurrentProjectRole, setCurrentProjectTrades, setInternalUsers, setExternalUsers, setAddInternalUser, setAddExternalUser, resetCreateProject, setRemoveInternalUser, setRemoveExternalUser, resetProjectState, setInvitedSubcontractor, setMembers, removeMember, resetMembers } = project.actions
export default project.reducer