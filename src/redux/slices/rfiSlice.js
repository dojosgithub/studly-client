import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * Submittal
export const createRfi = createAsyncThunk('rfi/create', async (rfiData) => {
  try {
    const response = await axiosInstance.post(endpoints.rfi.create, rfiData);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the rfi.');
  }
});

export const submitRfiToArchitect = createAsyncThunk('rfi/submitToArchitect', async (id) => {
  try {
    const response = await axiosInstance.post(endpoints.rfi.submit(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while submitting rfi for review.');
  }
});
export const getProjectRfiUsersList = createAsyncThunk(
  'rfi/users/list',
  async (_, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;

      const response = await axiosInstance.get(endpoints.project.projectRfiUsersList(projectId));

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching rfi user list.');
    }
  }
);

export const editRfi = createAsyncThunk('rfi/edit', async (rfiData) => {
  try {
    const { id, formData } = rfiData;

    const response = await axiosInstance.put(endpoints.rfi.edit(id), formData);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while updating the rfi.');
  }
});

export const getRfiList = createAsyncThunk('rfi/list', async (listOptions, { getState }) => {
  try {
    const projectId = getState().project?.current?._id;

    const { status, ...data } = listOptions;
    const response = await axiosInstance.post(
      endpoints.rfi.list(projectId),
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
    throw Error('An error occurred while fetching rfi list.');
  }
});
export const deleteRfi = createAsyncThunk('rfi/delete', async (id) => {
  try {
    const response = await axiosInstance.delete(endpoints.rfi.delete(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the rfi.');
  }
});
export const getRfiDetails = createAsyncThunk('submittal/details', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.rfi.details(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while fetching submittal details.');
  }
});

export const submitRfiResponse = createAsyncThunk('rfi/response', async (rfiData) => {
  try {
    const { id, formData } = rfiData;

    const response = await axiosInstance.put(endpoints.rfi.response(id), formData);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while submitting RFI response.');
  }
});

export const getRFILogPDF = createAsyncThunk('rfi/pdf', async (exptype, { getState }) => {
  try {
    const projectId = getState().project?.current?._id;

    const response = await axiosInstance.get(endpoints.rfi.pdf(projectId, exptype), {
      responseType: 'blob',
    });

    const buffer = response.data;

    const blob = new Blob([buffer], { type: exptype === 'pdf' ? 'application/pdf' : 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rfi_logs';
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
});

const initialState = {
  list: [],
  create: {},
  current: {},
  users: [],
  isLoading: false,
  error: null,
};

const rfi = createSlice({
  name: 'rfi',
  initialState,
  reducers: {
    resetRfiState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Create New Submittal
    builder.addCase(createRfi.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createRfi.fulfilled, (state, action) => {
      state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createRfi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // * Edit Submittal
    builder.addCase(editRfi.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(editRfi.fulfilled, (state, action) => {
      state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(editRfi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // * Delete Submittal
    builder.addCase(deleteRfi.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteRfi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteRfi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Get Submittal List
    builder.addCase(getRfiList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getRfiList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getRfiList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // Get RFI Details
    builder.addCase(getRfiDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getRfiDetails.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getRfiDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(submitRfiResponse.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(submitRfiResponse.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(submitRfiResponse.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getProjectRfiUsersList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProjectRfiUsersList.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getProjectRfiUsersList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { resetRfiState } = rfi.actions;
export default rfi.reducer;
