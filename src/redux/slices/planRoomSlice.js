import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { transformDocumentAIResponseArray } from 'src/utils/transformDocumentAIresponse';

// * PLAN ROOM
export const createPlanRoom = createAsyncThunk('planRoom/create', async (planRoomData) => {
  try {
    const response = await axiosInstance.post(endpoints.planRoom.create, planRoomData);

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the plan.');
  }
});

export const getPlanRoomList = createAsyncThunk(
  'planRoom/list',
  async (listOptions, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;

      const { status, ...data } = listOptions;
      const response = await axiosInstance.post(
        endpoints.planRoom.list(projectId),
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
  }
);

export const getPlanRoomPDFSThumbnails = createAsyncThunk(
  'split-pdf',
  async (listOptions, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;

      const { data } = listOptions;
      const response = await axiosInstance.post(endpoints.planRoom.pdfThumbnails(projectId), data);

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching rfi list.');
    }
  }
);

// export const getExtractedSheetsText = createAsyncThunk('extractSheet', async (data) => {
//   try {
//     const response = await axiosInstance.post(endpoints.planRoom.extractSheet, data);

//     return response.data.data;
//   } catch (err) {
//     console.error('errSlice', err);
//     if (err && err.message) {
//       throw Error(err.message);
//     }
//     throw Error('An error occurred while fetching extracted sheet text.');
//   }
// });
export const getExtractedSheetsText = createAsyncThunk(
  'extractSheet',
  async (data, { rejectWithValue }) => {
    try {
      // Make the Axios request (no streaming in browser)
      const response = await axiosInstance.post(endpoints.planRoom.extractSheet, data, {
        timeout: 60000 * 25, // Timeout increased to 5minutes (client-side)
      });

      // Since Axios doesn't support streams in the browser, we handle it all at once
      if (!response.data) {
        throw new Error('No response data received');
      }

      console.log('Raw response data:', response.data);
      console.log('Response headers:', response.headers);
      const finalData = response?.data;

      // Transform the response if necessary
      const transformedData = transformDocumentAIResponseArray(finalData);
      return transformedData;
    } catch (err) {
      console.error('Error in getExtractedSheetsText:', err);
      return rejectWithValue(err.message);
    }
  }
);

export const getExistingPlanRoomList = createAsyncThunk(
  'existingPlanRoom/list',
  async (listOptions, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;

      const response = await axiosInstance.get(endpoints.planRoom.existinglist(projectId));

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while fetching rfi list.');
    }
  }
);

export const deletePlanRoomSheet = createAsyncThunk(
  'planRoomSheet/delete',
  async ({ projectId, planRoomId, sheetId }) => {
    try {
      const response = await axiosInstance.delete(
        endpoints.planRoom.delete(projectId, planRoomId, sheetId)
      );

      return response.data.data;
    } catch (err) {
      console.error('errSlice', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while deleting planroom sheet.');
    }
  }
);

export const getPlanRoomDetails = createAsyncThunk('planRoom/details', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.planRoom.details(id));

    return response.data.data;
  } catch (err) {
    console.error('errSlice', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while fetching submittal details.');
  }
});

const initialState = {
  list: [],
  existingList: [],
  create: {},
  current: {},
  sheets: [],
  isLoading: false,
  error: null,
};

const planRoom = createSlice({
  name: 'planRoom',
  initialState,
  reducers: {
    resetPlanRoomState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Create New PlanRoom
    builder.addCase(createPlanRoom.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createPlanRoom.fulfilled, (state, action) => {
      state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createPlanRoom.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Get PlanRoom List
    builder.addCase(getPlanRoomList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getPlanRoomList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getPlanRoomList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // * Get Exisiting PlanRoom List
    builder.addCase(getExistingPlanRoomList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getExistingPlanRoomList.fulfilled, (state, action) => {
      state.existingList = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getExistingPlanRoomList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // * Delete PlanRoom
    builder.addCase(deletePlanRoomSheet.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deletePlanRoomSheet.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deletePlanRoomSheet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get PlanRoom Details
    builder.addCase(getPlanRoomDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getPlanRoomDetails.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getPlanRoomDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // Get PlanRoom Details
    builder.addCase(getExtractedSheetsText.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getExtractedSheetsText.fulfilled, (state, action) => {
      state.sheets = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getExtractedSheetsText.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { resetPlanRoomState } = planRoom.actions;
export default planRoom.reducer;
