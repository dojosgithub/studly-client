import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

export const createNewProject = createAsyncThunk('project/create', async (projectData) => {
  try {
    const response = await axiosInstance.post(endpoints.project.create, projectData);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the project.');
  }
});
export const updateExistingProject = createAsyncThunk('project/update', async (projectData) => {
  try {
    const response = await axiosInstance.put(endpoints.project.update, projectData);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while updating the project.');
  }
});
export const getProjectList = createAsyncThunk('project/list', async () => {
  try {
    const response = await axiosInstance.get(endpoints.project.list);

    return response.data.data.project;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while fetching project list.');
  }
});
export const getCurrentProjectTradesById = createAsyncThunk('project/trades', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.project.trades(id));

    return response.data.data.trades;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while fetching project list.');
  }
});

// get users list from
export const getCompanyUserList = createAsyncThunk('company/user/list', async () => {
  try {
    const response = await axiosInstance.get(endpoints.user.userList);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the company.');
  }
});

// get subcontractor list in company
export const getCompanySubcontractorList = createAsyncThunk(
  'subcontractor/companyList',
  async () => {
    try {
      const response = await axiosInstance.get(endpoints.user.subcontractorCompanyList);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the company.');
    }
  }
);
// get subcontractor list in db (NOT IN USE)
export const getAllSubcontractorList = createAsyncThunk('subcontractor/dbList', async () => {
  try {
    const response = await axiosInstance.get(endpoints.user.subcontractorList);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the company.');
  }
});

const projectInitialState = {
  name: '',
  address: '',
  state: '',
  city: '',
  zipCode: '',
  trades: [],
  workflow: {
    name: '',
    statuses: [],
    returnDate: '',
  },
  activeTab: 'create', // existing
  selectedTradeTemplate: '', // default || create || [template]
  isDefaultTemplateModified: false, // if true open name modal for creating a new template
  isCreatedWithCSI: false,
};
const subcontractorInitialState = {
  list: {
    all: [],
    company: [],
  },
  invited: [],
};

// PROJECTS ||
const initialState = {
  list: [],
  isProjectDrawerOpen: false,
  current: null,
  update: null,
  create: { ...projectInitialState },
  members: [],
  // Invite
  subcontractors: { ...subcontractorInitialState },
  users: [], // PROJECT_USERS

  isLoading: false,
  error: null,
};

const project = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action) => {
      state.create.name = action.payload.name;
      state.create.address = action.payload.address;
      state.create.state = action.payload.state;
      state.create.city = action.payload.city;
      state.create.zipCode = action.payload.zipCode;
    },
    setProjectSettingsName: (state, action) => {
      state.update.name = action.payload.name;
      state.update.address = action.payload.address;
      state.update.state = action.payload.state;
      state.update.city = action.payload.city;
      state.update.zipCode = action.payload.zipCode;
    },
    setProjectTrades: (state, action) => {
      state.create.trades = action.payload;
    },
    setProjectSettingsTrades: (state, action) => {
      state.update.trades = action.payload;
    },
    setProjectWorkflow: (state, action) => {
      state.create.workflow = action.payload;
    },
    setProjectSettingsWorkflow: (state, action) => {
      state.update.workflow = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.current = action.payload;
    },
    setCreateProject: (state, action) => {
      state.create = action.payload;
    },
    setUpdateProject: (state, action) => {
      state.update = { ...state.current };
    },
    setCurrentProjectRole: (state, action) => {
      state.current = { ...state.current, role: action.payload };
    },
    setUpdateProjectRole: (state, action) => {
      state.update = { ...state.update, role: action.payload };
    },
    setCurrentProjectTrades: (state, action) => {
      state.current = { ...state.current, trades: action.payload };
    },
    setUpdateProjectTrades: (state, action) => {
      state.update = { ...state.update, trades: action.payload };
    },

    setRemoveExternalUser: (state, action) => {
      state.inviteUsers.external = state.inviteUsers.external.filter(
        (row) => row.email !== action.payload
      );
    },
    setInvitedSubcontractor: (state, action) => {
      const subcontractorExists = state.subcontractors?.invited?.some(
        (subcontractor) => subcontractor.email === action.payload.email
      );

      // If the subcontractor does not exist, add them to the invited array
      if (!subcontractorExists) {
        state.subcontractors.invited = [...state.subcontractors.invited, action.payload];
      }
    },
    removeInvitedSubcontractor: (state, action) => {
      // Filter out the subcontractor with the matching email
      state.subcontractors.invited = state.subcontractors.invited.filter(
        (subcontractor) => subcontractor.email !== action.payload
      );
    },
    setMembers: (state, action) => {
      const memberExists = state.members.some((member) => member.email === action.payload.email);

      // If the member does not exist, add them to the members array
      if (!memberExists) {
        state.members = [...state.members, action.payload];
      }
    },
    removeMember: (state, action) => {
      const filteredMembers = state.members.filter((member) => member?.email !== action?.payload);
      state.members = filteredMembers;
    },
    setUpdateProjectMembers: (state, action) => {
      const memberExists = state.update?.members.some(
        (member) => member.email === action.payload.email
      );

      // If the member does not exist, add them to the members array
      if (!memberExists) {
        state.update.members = [...state.update.members, action.payload];
      }
    },
    removeUpdateProjectMember: (state, action) => {
      const filteredMembers = state.update?.members?.filter(
        (member) => member?.email !== action?.payload
      );
      state.update.members = filteredMembers;
    },
    resetMembers: (state) => {
      state.members = [];
    },
    resetCreateProject: (state) => {
      state.create = projectInitialState;
      state.members = [];
      // ? Changed subcontractor to initial state
      state.subcontractors = { ...subcontractorInitialState };
      state.users = [];
    },
    resetUpdateProject: (state) => {
      state.update = null;
      state.update = { ...state.current };
    },
    setProjectDrawerState: (state, action) => {
      state.isProjectDrawerOpen = action.payload;
    },
    setActiveTab: (state, action) => {
      state.create.activeTab = action.payload;
    },
    setDefaultTemplateModified: (state, action) => {
      state.create.isDefaultTemplateModified = action.payload;
    },
    setSelectedTradeTemplate: (state, action) => {
      state.create.selectedTradeTemplate = action.payload;
    },
    setTemplateCreationType: (state) => {
      if (
        state.create.selectedTradeTemplate === 'default' &&
        state.create.activeTab === 'existing'
      ) {
        state.create.isCreatedWithCSI = true;
      } else {
        state.create.isCreatedWithCSI = false;
      }
    },
    resetSubcontractorState: () => subcontractorInitialState,
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
      state.error = action.error.message;
    });
    // * Update Existing Project
    builder.addCase(updateExistingProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateExistingProject.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateExistingProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
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
      state.error = action.error.message;
    });
    builder.addCase(getCurrentProjectTradesById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCurrentProjectTradesById.fulfilled, (state, action) => {
      state.current = { ...state.current, trades: action.payload };
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCurrentProjectTradesById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
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
  },
});

export const {
  setProjectName,
  setProjectTrades,
  setProjectWorkflow,
  setCurrentProject,
  setCreateProject,
  setCurrentProjectRole,
  setCurrentProjectTrades,
  setProjectSettingsName,
  setProjectSettingsTrades,
  setProjectSettingsWorkflow,
  setUpdateProject,
  setUpdateProjectRole,
  setUpdateProjectTrades,
  resetCreateProject,
  resetProjectState,
  resetUpdateProject,
  resetSubcontractorState,
  setInvitedSubcontractor,
  removeInvitedSubcontractor,
  setMembers,
  setUpdateProjectMembers,
  removeMember,
  removeUpdateProjectMember,
  resetMembers,
  setProjectDrawerState,
  setActiveTab,
  setDefaultTemplateModified,
  setSelectedTradeTemplate,
  setTemplateCreationType,
} = project.actions;
export default project.reducer;
