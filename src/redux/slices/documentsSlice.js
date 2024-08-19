import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (documentsData, { getState, rejectWithValue }) => {

    try {
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
    try {
      const projectId = getState().project?.current?.id;
      let parentId;

      if ('parentId' in listOptions) {
        
        parentId = listOptions.parentId;
      } else {
        const listData = getState().documents?.list;
        parentId =
          listData?.links?.length > 2
            ? listData.links[listData.links.length - 1].href.replace('/', '')
            : null;
      }

      const { status, ...data } = listOptions;
      const response = await axiosInstance.post(
        endpoints.documents.list(projectId),
        { status, parentId },
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
export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(endpoints.documents.delete(id));

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
export const updateDocument = createAsyncThunk(
  'documents/update',
  async (id, documentsData, { getState, rejectWithValue }) => {

    try {
      const response = await axiosInstance.post(endpoints.documents.update(id), documentsData);
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

const documentsInitialState = {};

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
    setupdatedocuments: (state, action) => {
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
    builder.addCase(updateDocument.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateDocument.fulfilled, (state, action) => {
      state.upload = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateDocument.rejected, (state, action) => {
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

    builder.addCase(deleteDocument.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteDocument.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteDocument.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});
export default documents.reducer;
