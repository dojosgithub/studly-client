import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  PROJECTS,
  PROJECT_INVITE_USERS_EXTERNAL,
  PROJECT_INVITE_USERS_INTERNAL,
  PROJECT_SUBCONTRACTORS,
  PROJECT_TEMPLATES,
  PROJECT_WORKFLOWS,
  _userList,
} from 'src/_mock';
import { setSession } from 'src/auth/context/jwt/utils';
import axiosInstance, { endpoints } from 'src/utils/axios';
import uuidv4 from 'src/utils/uuidv4';

export const fetchCompanyList = createAsyncThunk(
  'company/list',
  async (listOptions, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.company.list, {
        params: listOptions,
      });

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
export const getCompanyDetails = createAsyncThunk(
  'company/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.company.details(id));

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching submittal details.');
    }
  }
);
export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ data, id }, { getState, rejectWithValue }) => {
    console.log('hehvsveh', data, id);

    try {
      const response = await axiosInstance.put(endpoints.company.update(id), data);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the plan.');
    }
  }
);

export const createNewCompany = createAsyncThunk(
  'company/create',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.company.create, companyData);

      return response.data.data.company;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the company.');
    }
  }
);
export const deleteCompany = createAsyncThunk('company/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(endpoints.company.delete(id));

    return response.data.data.company;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the company.');
  }
});

export const updateCompanyStatus = createAsyncThunk(
  'company/status',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(endpoints.company.status(id, status));

      return response.data.data.company;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the company.');
    }
  }
);

export const accessCompany = createAsyncThunk(
  'company/access',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(endpoints.company.access(id));

      console.log('response', response.data.data);
      const { accessToken } = response.data.data;
      setSession(accessToken);

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

export const exitCompanyAccess = createAsyncThunk(
  'company/exit-access',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(endpoints.company.exitAccess());

      console.log('response', response.data.data);
      const { accessToken } = response.data.data;
      setSession(accessToken);

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

const initialState = {
  list: null,
  current: null,
  create: null,
  isLoading: false,
  error: false,
};

const company = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCreateCompany: (state, action) => {
      state.create = action.payload;
    },
    setCompanyList: (state, action) => {
      state.list = action.payload;
    },
    setCurrentCompany: (state, action) => {
      state.current = action.payload;
    },

    resetCompanyState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Fetch Company List
    builder.addCase(fetchCompanyList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanyList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(fetchCompanyList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Create New Company
    builder.addCase(createNewCompany.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createNewCompany.fulfilled, (state, action) => {
      state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createNewCompany.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // * Delete New Company
    builder.addCase(deleteCompany.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCompany.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteCompany.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateCompanyStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCompanyStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.current = action.payload;
      state.error = null;
    });
    builder.addCase(updateCompanyStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getCompanyDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCompanyDetails.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCompanyDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { setCurrentCompany, resetCompanyState, setCompanyList, setCreateCompany } =
  company.actions;
export default company.reducer;

// const data=  await axios.post(endpoints.kanban, data, { params: { endpoint: 'create-column' } });
// const updateUser = createAsyncThunk(
//   'users/update',
//   async (userData, { rejectWithValue }) => {
//     const { id, ...fields } = userData
//     try {
//       const response = await userAPI.updateById(id, fields)
//       return response.data.user
//     } catch (err) {
//       // Use `err.response.data` as `action.payload` for a `rejected` action,
//       // by explicitly returning it using the `rejectWithValue()` utility
//       return rejectWithValue(err.response.data)
//     }
//   },
// )

// // ----------------------------------------------------------------------

// export function getContacts() {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/chat/contacts');
//       dispatch(slice.actions.getContactsSuccess(response.data.contacts));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getConversations() {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/chat/conversations');
//       dispatch(slice.actions.getConversationsSuccess(response.data.conversations));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getConversation(conversationKey) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/chat/conversation', {
//         params: { conversationKey },
//       });
//       dispatch(slice.actions.getConversationSuccess(response.data.conversation));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function markConversationAsRead(conversationId) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       await axios.get('/api/chat/conversation/mark-as-seen', {
//         params: { conversationId },
//       });
//       dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getParticipants(conversationKey) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/chat/participants', {
//         params: { conversationKey },
//       });
//       dispatch(slice.actions.getParticipantsSuccess(response.data.participants));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
