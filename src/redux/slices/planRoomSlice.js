import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * PLAN ROOM
export const createPlanRoom = createAsyncThunk(
  'planRoom/create',
  async (planRoomData, { getState, rejectWithValue }) => {
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
  }
);

export const getPlanRoomList = createAsyncThunk(
  'planRoom/list',
  async (listOptions, { getState, rejectWithValue }) => {
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
  async (listOptions, { getState, rejectWithValue }) => {
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

export const getExistingPlanRoomList = createAsyncThunk(
  'existingPlanRoom/list',
  async (listOptions, { getState, rejectWithValue }) => {
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
  async ({ projectId, planRoomId, sheetId }, { getState, rejectWithValue }) => {
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

// export const submitPlanRoomToArchitect = createAsyncThunk(
//   'rfi/submitToArchitect',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       console.log('rfiId', id);

//       const response = await axiosInstance.post(endpoints.rfi.submit(id));

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while submitting rfi for review.');
//     }
//   }
// );

// export const editPlanRoom = createAsyncThunk(
//   'rfi/edit',
//   async (rfiData, { getState, rejectWithValue }) => {
//     try {
//       const { id, formData } = rfiData;
//       console.log('rfiId', id);
//       console.log('formData', formData);

//       const response = await axiosInstance.put(endpoints.rfi.edit(id), formData);

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while updating the rfi.');
//     }
//   }
// );

// export const deletePlanRoom = createAsyncThunk(
//   'rfi/delete',
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       console.log('rfiId', id);
//       const response = await axiosInstance.delete(endpoints.rfi.delete(id));

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while creating the rfi.');
//     }
//   }
// );
export const getPlanRoomDetails = createAsyncThunk(
  'planRoom/details',
  async (id, { getState, rejectWithValue }) => {
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
  }
);

// export const submitPlanRoomResponse = createAsyncThunk(
//   'rfi/response',
//   async (rfiData, { getState, rejectWithValue }) => {
//     try {
//       const { id, formData } = rfiData;
//       console.log('rfiId', id);
//       console.log('formData', formData);

//       const response = await axiosInstance.put(endpoints.rfi.response(id), formData);

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while submitting RFI response.');
//     }
//   }
// );

// export const getRFILogPDF = createAsyncThunk(
//   'rfi/pdf',
//   async (exptype, { getState, rejectWithValue }) => {
//     try {
//       const projectId = getState().project?.current?._id;
//       console.log('projectId', projectId);

//       const response = await axiosInstance.get(endpoints.rfi.pdf(projectId, exptype), {
//         responseType: 'blob',
//       });

//       const buffer = response.data;
//       console.log('buffer', response.data);

//       const blob = new Blob([buffer], { type: exptype === 'pdf' ? 'application/pdf' : 'text/csv' });
//       console.log('blob', blob);
//       const url = URL.createObjectURL(blob);

//       // Create a temporary link and trigger a download
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'rfi_logs';
//       a.click();

//       // Cleanup
//       URL.revokeObjectURL(url);

//       return response.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while fetching submittal list.');
//     }
//   }
// );

const initialState = {
  list: [],
  existingList: [],
  create: {},
  current: {},
  isLoading: false,
  error: null,
};

const planRoom = createSlice({
  name: 'planRoom',
  initialState,
  reducers: {
    setPlanRoomList: (state, action) => {
      // state.list = action.payload;
      state.list = [...state.list, action.payload];
    },
    setCurrentPlanRoom: (state, action) => {
      state.current = action.payload;
    },
    setCreatePlanRoom: (state, action) => {
      state.create = action.payload;
    },
    resetPlanRoomState: () => initialState,
  },
  extraReducers: (builder) => {
    // // * Create New PlanRoom
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
    builder.addCase(deletePlanRoomSheet.fulfilled, (state, action) => {
      // state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deletePlanRoomSheet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // // * Edit PlanRoom
    // builder.addCase(editPlanRoom.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(editPlanRoom.fulfilled, (state, action) => {
    //   state.create = action.payload;
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(editPlanRoom.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Get PlanRoom Details
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
    // builder.addCase(submitPlanRoomResponse.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(submitPlanRoomResponse.fulfilled, (state, action) => {
    //   state.current = action.payload;
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(submitPlanRoomResponse.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

export const { setPlanRoomList, setCurrentPlanRoom, setCreatePlanRoom, resetPlanRoomState } =
  planRoom.actions;
export default planRoom.reducer;
