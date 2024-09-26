import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const createDailyLogs = createAsyncThunk('dailyLogs/create', async (dailyLogsData) => {
  try {
    const response = await axiosInstance.post(endpoints.dailyLogs.create, dailyLogsData);
    return response.data.data;
  } catch (err) {
    console.error('API Error:', err);
    if (err && err.message) {
      throw Error(err.message);
    }
    throw Error('An error occurred while creating the plan.');
  }
});

export const getDailyLogsDetails = createAsyncThunk('dailyLogs/details', async (id) => {
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
});

export const getDailyLogsList = createAsyncThunk(
  'dailyLogs/list',

  async (listOptions, { getState }) => {
    try {
      const projectId = getState().project?.current?._id;
      const { status, ...data } = listOptions;
      const response = await axiosInstance.post(
        endpoints.dailyLogs.list(projectId),
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

export const updateDailyLogs = createAsyncThunk('dailyLogs/update', async ({ data, id }) => {
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
});

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

export const createFollowup = createAsyncThunk('dailyLogs/followup', async (id) => {
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
});

export const sendToAttendees = createAsyncThunk('dailyLogs/send', async (id) => {
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
});

export const changeToMinutes = createAsyncThunk('dailyLogs/changetominutes', async (id) => {
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
});

export const deleteLog = createAsyncThunk('dailyLogs/delete', async (id) => {
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
});

export const getDailyLogsPDF = createAsyncThunk('dailyLogs/pdf', async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.dailyLogs.pdf(id), {
      responseType: 'blob',
    });

    const buffer = response.data;

    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_log';
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

const dailyLogsInitialState = {
  date: new Date('07-21-2024'),
  accidentSafetyIssues: '',
  visitors: [{ visitors: '' }],
  inspection: [{ value: '', status: true, reason: '' }],
  weather: 'Clear',
  subcontractorAttendance: [{ companyName: '', headCount: null }],
  distributionList: [{ name: '', email: '' }],
  attachments: [],
  summary: '',
  status: 1,
  docStatus: 1,
};

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
    resetDailyLogsCreateState: () => dailyLogsInitialState,
    resetDailyLogsState: () => initialState,
  },
  extraReducers: (builder) => {
    // * Create New Daily Log
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

    // * Get Daily Logs List
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

    // * Delete Daily Log
    builder.addCase(deleteLog.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteLog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // * Get Daily Log Details
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

export const { resetDailyLogsCreateState, resetDailyLogsState } = dailyLogs.actions;
export default dailyLogs.reducer;
