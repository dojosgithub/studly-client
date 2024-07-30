import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

// * Meeting Minutes

// export const createDailyLogs = createAsyncThunk(
//   'dailyLogs/create',
//   async (dailyLogsData, { getState, rejectWithValue }) => {
//     if (isEmpty(dailyLogsData)) {
//       return rejectWithValue('daily logs cannot be empty.');
//     }

//     const projectId = getState().project?.current?.id;

//     dailyLogsData.projectId = projectId;
//     try {
//       const response = await axiosInstance.post(endpoints.dailyLogs.create, dailyLogsData);

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while creating the plan.');
//     }
//   }
// );
export const createDailyLogs = createAsyncThunk(
  'dailyLogs/create',
  async (dailyLogsData, { getState, rejectWithValue }) => {
    console.log('dailyLogsData', dailyLogsData);
    // if (isEmpty(dailyLogsData)) {
    //   return rejectWithValue('daily logs cannot be empty.');
    // }
    const projectId = getState().project?.current?.id;

    dailyLogsData.projectId = projectId;
    try {
      console.log('Sending data:', dailyLogsData);
      const response = await axiosInstance.post(
        endpoints.dailyLogs.create(projectId),
        dailyLogsData
      );
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (err) {
      console.error('API Error:', err);
      if (err && err.message) {
        throw Error(err.message);
      }
      throw Error('An error occurred while creating the plan.');
    }
  }
);

export const getDailyLogsList = createAsyncThunk(
  'dailyLogs/list',

  async (listOptions, { getState, rejectWithValue }) => {
    console.log('ListsData', listOptions);
    try {
      const projectId = getState().project?.current?.id;
      console.log('Sending data:', listOptions);
      const { status, ...data } = listOptions;
      const response = await axiosInstance.post(
        endpoints.dailyLogs.list(projectId),
        { status },
        {
          params: data,
        }
      );
      console.log('API Response:', response.data);
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
// export const getMeetingMinutesList = createAsyncThunk(
//   'dailyLogs/list',
//   async (listOptions, { getState, rejectWithValue }) => {
//     try {
//       const projectId = getState().project?.current?.id;

//       const { status, ...data } = listOptions;
//       // const projectId = getState().projectId.id
//       const response = await axiosInstance.post(
//         endpoints.meetingMinutes.list(projectId),
//         { status },
//         {
//           params: data,
//         }
//       );

//       return response.data.data;
//     } catch (err) {
//       console.error('errSlice', err);
//       if (err && err.message) {
//         throw Error(err.message);
//       }
//       throw Error('An error occurred while fetching rfi list.');
//     }
//   }
// );

export const updatedailyLogs = createAsyncThunk(
  'dailyLogs/update',
  async ({ data, id }, { getState, rejectWithValue }) => {
    if (isEmpty(data)) {
      return rejectWithValue('Meeting minutes data cannot be empty.');
    }

    const projectId = getState().project?.current?.id;

    data.projectId = projectId;
    try {
      const response = await axiosInstance.put(endpoints.dailyLogs.update(id), data);

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

export const DailyLogs = createAsyncThunk(
  'dailyLogsSheet/delete',
  async ({ projectId, dailyLogsId, sheetId }, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        endpoints.dailyLogs.delete(projectId, dailyLogsId, sheetId)
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

export const getDailyLogsDetails = createAsyncThunk(
  'dailyLogs/details',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.dailyLogs.details(id));

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

export const createFollowup = createAsyncThunk(
  'dailyLogs/followup',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.dailyLogs.followup(id));

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

export const sendToAttendees = createAsyncThunk(
  'dailyLogs/send',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.dailyLogs.sendToAttendees(id));

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

export const changeToMinutes = createAsyncThunk(
  'dailyLogs/changetominutes',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoints.dailyLogs.toMinutes(id));

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

export const deleteLog = createAsyncThunk(
  'dailyLogs/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(endpoints.dailyLogs.delete(id));

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

export const getDailyLogsPDF = createAsyncThunk(
  'dailyLogs/pdf',
  async (id, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?.id;

      const response = await axiosInstance.get(endpoints.dailyLogs.pdf(id), {
        responseType: 'blob',
      });

      const buffer = response.data;

      const blob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger a download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meeting_log';
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

const dailyLogsInitialState = {
  date: new Date('07-21-2024'),
  accidentSafetyIssues: '',
  visitors: [{ visitors: '' }],
  inspection: [{ value: '', status: true, reason: '' }],
  weather: 'Clear',
  subcontractorAttendance: [{ companyName: '', headCount: '' }],
  distributionList: [{ name: '', email: '' }],
  attachments: [],
  summary: '',
  status: 1,
  docStatus: 1,
};

// {
//   date: {
//     type: Date,
//   },
//   projectId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Project',
//   },
//   accidentSafetyIssues: String,
//   visitors: [String],
//   inspection: [
//     {
//       value: String,
//       status: Boolean,
//       reason: String,
//     },
//   ],
//   weather: [String],
//   subcontractorAttendance: [
//     {
//       companyName: String,
//       headCount: Number,
//     },
//   ],
//   distributionList: [
//     {
//       name: String,
//       email: String,
//     },
//   ],
//   attachments: Array,
//   summary: String,
//   status: {
//     type: Number,
//     default: 1,
//   },
//   docStatus: {
//     type: Number,
//     default: DOC_STATUS.active,
//   },
// },

const initialState = {
  notes: '',
  list: [],
  create: cloneDeep(dailyLogsInitialState),
  current: {},
  isLoading: false,
  error: null,
};
const dailyLogs = createSlice({
  name: 'dailyLogs',
  initialState,
  reducers: {
    setDailyLogs: (state, action) => {
      // state.list = action.payload;
      state.list = [...state.list, action.payload];
    },
    setCurrentDailyLogs: (state, action) => {
      state.current = action.payload;
    },
    setCreateDailyLogs: (state, action) => {
      state.create = action.payload;
    },
    setDailyLogsDescription: (state, action) => {
      state.create.description = action.payload;
    },
    // setdailyLogsInviteAttendee: (state, action) => {
    //   state.create.inviteAttendee = action.payload;
    // },
    // setdailyLogsNotes: (state, action) => {
    //   state.create.notes = action.payload;
    // },
    // setdailyLogsPermit: (state, action) => {
    //   state.create.permit = action.payload;
    // },
    // setdailyLogsPlanTracking: (state, action) => {
    //   state.create.plan = action.payload;
    // },

    resetDailyLogsCreateState: () => dailyLogsInitialState,
    resetDailyLogsState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Create New dailyLogs
    builder.addCase(createDailyLogs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createDailyLogs.fulfilled, (state, action) => {
      state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createDailyLogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Get PlanRoom List
    builder.addCase(getDailyLogsList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDailyLogsList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getDailyLogsList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Delete PlanRoom
    builder.addCase(deleteLog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteLog.fulfilled, (state, action) => {
      // state.create = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteLog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // // Get PlanRoom Details
    builder.addCase(getDailyLogsDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDailyLogsDetails.fulfilled, (state, action) => {
      state.current = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getDailyLogsDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const {
  setdailyLogs,
  setCurrentDailyLogs,
  setCreateDailyLogs,
  setDailyLogsDescription,
  resetdailyLogsState,
  resetdailyLogsCreateState,
} = dailyLogs.actions;
export default dailyLogs.reducer;
