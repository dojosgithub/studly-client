import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * Submittal
export const createNewSubmittal = createAsyncThunk(
  'submittal/create',
  async (submittalData, { getState, rejectWithValue }) => {
    try {
      // const projectId = getState().project.current._id
      // console.log("projectId", projectId)
      // { ...submittalData, projectId }
      const response = await axiosInstance.post(endpoints.submittal.create, submittalData);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the submittal.');
    }
  }
);

export const editSubmittal = createAsyncThunk(
  'submittal/edit',
  async (submittalData, { getState, rejectWithValue }) => {
    try {
      const { id, formData } = submittalData;
      console.log('submittalId', id);
      console.log('formData', formData);

      const response = await axiosInstance.put(endpoints.submittal.edit(id), formData);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the submittal.');
    }
  }
);
export const deleteSubmittal = createAsyncThunk(
  'submittal/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('submittalId', id);
      const response = await axiosInstance.delete(endpoints.submittal.delete(id));

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the submittal.');
    }
  }
);
export const getSubmittalDetails = createAsyncThunk(
  'submittal/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('submittalId', id);

      const response = await axiosInstance.get(endpoints.submittal.details(id));

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

export const getSubmittalList = createAsyncThunk(
  'submittal/list',
  async (listOptions, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?.id;
      console.log('projectId', projectId);

      const { status, ...data } = listOptions;
      console.log('status', status);
      console.log('data', data);
      // const projectId = getState().projectId.id
      const response = await axiosInstance.post(
        endpoints.submittal.list(projectId),
        { status },
        {
          params: data,
        }
      );

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching submittal list.');
    }
  }
);
export const getProjectUsersList = createAsyncThunk(
  'submittal/users/list',
  async (_, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?.id;
      console.log('projectId', projectId);

      const response = await axiosInstance.get(endpoints.project.projectUsersList(projectId));

      return response.data.data.members;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching submittal list.');
    }
  }
);

export const getSubmittalLogPDF = createAsyncThunk(
  'submittal/pdf',
  async (exptype, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?.id;
      console.log('projectId', projectId);

      const response = await axiosInstance.get(endpoints.submittal.pdf(projectId, exptype), {
        responseType: 'blob',
      });

      const buffer = response.data;
      console.log('buffer', response.data);

      const blob = new Blob([buffer], { type: exptype === 'pdf' ? 'application/pdf' : 'text/csv' });
      console.log('blob', blob);
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger a download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'submittal_logs';
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);

      return response.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching submittal list.');
    }
  }
);

export const submitSubmittalToArchitect = createAsyncThunk(
  'submittal/submitToArchitect',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('submittalId', id);

      const response = await axiosInstance.post(endpoints.submittal.submit(id));

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
export const respondToSubmittalRequest = createAsyncThunk(
  'submittal/respondToSubmittalRequest',
  async (submittalData, { getState, rejectWithValue }) => {
    try {
      const { id, formData } = submittalData;
      console.log('formData', formData);
      console.log('submittalId', id);

      const response = await axiosInstance.post(endpoints.submittal.review(id), formData);

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
export const getSubmittalResponseDetails = createAsyncThunk(
  'submittal/submittalResponseDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('submittalId', id);

      const response = await axiosInstance.get(endpoints.submittal.reviewDetails(id));

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
export const updateSubmittalResponseDetails = createAsyncThunk(
  'submittal/updateSubmittalResponseDetails',
  async (submittalData, { getState, rejectWithValue }) => {
    try {
      const { id, formData } = submittalData;
      console.log('formData', formData);
      console.log('submittalId', id);

      const response = await axiosInstance.put(endpoints.submittal.reviewDetails(id), formData);

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

const initialState = {
  list: [],
  create: {},
  current: {},
  users: [],
  report: null,
  response: null,
  isLoading: false,
  error: null,
};

const submittal = createSlice({
  name: 'submittal',
  initialState,
  reducers: {
    setSubmittalList: (state, action) => {
      state.list = action.payload;
    },
    extraReducers: (builder) => {
      // * Create New Submittal
      builder.addCase(createNewSubmittal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(createNewSubmittal.fulfilled, (state, action) => {
        state.create = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(createNewSubmittal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      // * Edit Submittal
      builder.addCase(editSubmittal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(editSubmittal.fulfilled, (state, action) => {
        state.create = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(editSubmittal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      // * Delete Submittal
      builder.addCase(deleteSubmittal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(deleteSubmittal.fulfilled, (state, action) => {
        // state.create = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(deleteSubmittal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      // * Get Project Users List
      builder.addCase(getProjectUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(getProjectUsersList.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(getProjectUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      // * Get Submittal List
      builder.addCase(getSubmittalList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(getSubmittalList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(getSubmittalList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      // Get Submittal Details
      builder.addCase(getSubmittalDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(getSubmittalDetails.fulfilled, (state, action) => {
        state.current = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(getSubmittalDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      builder.addCase(respondToSubmittalRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(respondToSubmittalRequest.fulfilled, (state, action) => {
        state.current = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(respondToSubmittalRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      //
      builder.addCase(getSubmittalResponseDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(getSubmittalResponseDetails.fulfilled, (state, action) => {
        state.response = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(getSubmittalResponseDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      builder.addCase(updateSubmittalResponseDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(updateSubmittalResponseDetails.fulfilled, (state, action) => {
        state.response = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(updateSubmittalResponseDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      builder.addCase(getSubmittalLogPDF.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(getSubmittalLogPDF.fulfilled, (state, action) => {
        state.report = action.payload;
        state.isLoading = false;
        state.error = null;
      });
      builder.addCase(getSubmittalLogPDF.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    },
  },
});

export const {
  setSubmittal,
  setCurrentSubmittal,
  setSubmittalResponse,
  setCreateSubmittal,
  resetSubmittalState,
} = submittal.actions;
export default submittal.reducer;
