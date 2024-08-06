import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (documentsData, { getState, rejectWithValue }) => {
    console.log('documentsData', documentsData);

    try {
      console.log('Sending data:', documentsData);
      const response = await axiosInstance.post(endpoints.documents.upload, documentsData);
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
export const getDocumentsList = createAsyncThunk(
  'documents/list',

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
export const deleteLog = createAsyncThunk(
  'documents/delete',
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
const documentsInitialState = {
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
  upload: cloneDeep(documentsInitialState),
  current: {},
  isLoading: false,
  error: null,
};
const documents = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setdocuments: (state, action) => {
      // state.list = action.payload;
      state.list = [...state.list, action.payload];
    },
    setCurrentdocuments: (state, action) => {
      state.current = action.payload;
    },
    setuploaddocuments: (state, action) => {
      state.upload = action.payload;
    },
    setdocumentsDescription: (state, action) => {
      state.upload.description = action.payload;
    },

    resetdocumentsuploadState: () => documentsInitialState,
    resetdocumentsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(uploadDocument.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadDocument.fulfilled, (state, action) => {
      state.upload = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(uploadDocument.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(getDocumentsList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDocumentsList.fulfilled, (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getDocumentsList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

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
  },
});
export default documents.reducer;
