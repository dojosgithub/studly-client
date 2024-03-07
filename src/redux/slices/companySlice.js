import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PROJECTS, PROJECT_INVITE_USERS_EXTERNAL, PROJECT_INVITE_USERS_INTERNAL, PROJECT_SUBCONTRACTORS, PROJECT_TEMPLATES, PROJECT_WORKFLOWS, _userList } from "src/_mock";
import uuidv4 from "src/utils/uuidv4";


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


const initialState = {
  list: [],
  current: null,
  create: null,

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
  }
})

export const { resetCompanyState, setCompanyList, setCreateCompany } = company.actions
export default company.reducer


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
