import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * Submittal
export const createRfi = createAsyncThunk(
  'rfi/create',
  async (rfiData, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.submittal.create, rfiData);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the rfi.');
    }
  }
);

export const editRfi = createAsyncThunk(
  'rfi/edit',
  async (rfiData, { getState, rejectWithValue }) => {
    try {
      const { id, formData } = rfiData;
      console.log('rfiId', id);
      console.log('formData', formData);

      const response = await axiosInstance.put(endpoints.rfi.edit(id), formData);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while updating the rfi.');
    }
  }
);
export const deleteRfi = createAsyncThunk(
  'rfi/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log('rfiId', id);
      const response = await axiosInstance.delete(endpoints.rfi.delete(id));

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the rfi.');
    }
  }
);
export const getRfiDetails = createAsyncThunk(
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

export const getRfiList = createAsyncThunk(
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


const initialState = {
  list: [],
  create: {},
  current: {},
  isLoading: false,
  error: null,
};

const rfi = createSlice({
  name: 'rfi',
  initialState,
  reducers: {
    setRfiList: (state, action) => {
      state.list = action.payload;
    },
    setCurrentRfi: (state, action) => {
      state.current = action.payload;
    },
    setCreateRfi: (state, action) => {
      state.create = action.payload;
    },
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
      // state.create = action.payload;
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
    // Get Submittal Details
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
  },
});

export const {
  setRfiList,
  setCurrentRfi,
  setCreateRfi,
  resetRfiState,
} = rfi.actions;
export default rfi.reducer;
