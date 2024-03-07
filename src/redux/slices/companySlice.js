import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PROJECTS, PROJECT_INVITE_USERS_EXTERNAL, PROJECT_INVITE_USERS_INTERNAL, PROJECT_SUBCONTRACTORS, PROJECT_TEMPLATES, PROJECT_WORKFLOWS, _userList } from "src/_mock";
import axiosInstance, { endpoints } from "src/utils/axios";
import uuidv4 from "src/utils/uuidv4";


export const fetchCompanyList = createAsyncThunk(
  'company/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.company.list);

      return response.data.data.company
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

export const createNewCompany = createAsyncThunk(
  'company/create',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.company.create, companyData);

      return response.data.data.company
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


const initialState = {
  list: [],
  current: null,
  create: null,
  isLoading: false,
  error: false

}

const company = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCreateCompany: (state, action) => {
      state.create = action.payload
    },
    setCompanyList: (state, action) => {
      state.list = action.payload
    },

    resetCompanyState: () => initialState,
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchCompanyList.pending, (state) => {
      // Set isLoading to true while the fetch is pending
      state.isLoading = true;
      state.error = null; // Reset error state
    });
    builder.addCase(fetchCompanyList.fulfilled, (state, action) => {
      // Add user to the state array
      state.list = action.payload;
      state.isLoading = false; // Reset isLoading state
      state.error = null; // Reset error state
    });
    builder.addCase(fetchCompanyList.rejected, (state, action) => {
      // Set error state if the fetch is rejected
      state.isLoading = false; // Reset isLoading state
      state.error = action.error.message;
    });

    // * Create New Company
    builder.addCase(createNewCompany.pending, (state) => {
      // Set isLoading to true while the fetch is pending
      state.isLoading = true;
      state.error = null; // Reset error state
    });
    builder.addCase(createNewCompany.fulfilled, (state, action) => {
      // Add user to the state array
      state.create = action.payload;
      state.isLoading = false; // Reset isLoading state
      state.error = null; // Reset error state
    });
    builder.addCase(createNewCompany.rejected, (state, action) => {
      // Set error state if the fetch is rejected
      state.isLoading = false; // Reset isLoading state
      state.error = action.error.message
    });
  },
})

export const { resetCompanyState, setCompanyList, setCreateCompany } = company.actions
export default company.reducer




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
