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