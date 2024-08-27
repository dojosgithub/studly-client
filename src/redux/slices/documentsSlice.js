import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, isEmpty } from 'lodash';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (documentsData, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endpoints.documents.upload, documentsData);
      // console.log('API Response:', response.data);
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
export const moveDocument = createAsyncThunk(
  'folders/move',
  async ({ id, to }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/user/documents/move/${id}/${to}`);
      return response.data; // Adjust if your API returns different data
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);
// export const renameDocument = createAsyncThunk(
//   'documents/rename',
//   async (id, documentsData, { getState, rejectWithValue }) => {
//     try {
//       // Assuming you have an API endpoint for renaming
//       console.log('data 22k-4289', documentsData);
//       const response = await axiosInstance.put(endpoints.documents.rename(id), documentsData);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );
export const renameDocument = createAsyncThunk(
  'documents/rename',
  async ({ newName, _id }, { rejectWithValue }) => {
    try {
      // console.log('Renaming document with ID:', _id, 'Data:', newName);

      const response = await axiosInstance.put(endpoints.documents.rename(_id), { name: newName });

      // console.log('Rename document response:', response.data);
      return response.data;
    } catch (err) {
      // console.error('Rename document error:', err);

      const errorMessage =
        err.response?.data?.message || 'An error occurred while renaming the document.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateDailyLogs = createAsyncThunk(
  'dailyLogs/update',
  async ({ data, id }, { getState, rejectWithValue }) => {
    // console.log(data, id);

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

export const downloadDocument = createAsyncThunk(
  'documents/download',
  async (id, { getState, rejectWithValue }) => {
    try {
      // Fetch the document as a blob
      const response = await axiosInstance.get(endpoints.documents.download(id), {
        responseType: 'blob',
      });

      // Create a URL for the blob object
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and trigger a click to start the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip'); // Set the filename for the download

      // Append to the DOM and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object and remove the link element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return response.data;
    } catch (err) {
      console.error('Download error:', err);
      return rejectWithValue(err.message || 'An error occurred while downloading the document.');
    }
  }
);

export const getDocumentsList = createAsyncThunk(
  'documents/list',

  async (listOptions, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?._id;
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

export const getDocumentsMoveList = createAsyncThunk(
  'documents/moveList',

  async (listOptions, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().project?.current?._id;
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
      // console.log('API Response:', response.data);
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
  moveList: [],
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
    // builder.addCase(renameDocument.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(renameDocument.fulfilled, (state, action) => {
    //   // Update the document with the new name in the state if necessary
    //   const updatedDocument = action.payload;
    //   state.list = state.list.map((doc) =>
    //     doc.id === updatedDocument.id ? { ...doc, ...updatedDocument } : doc
    //   );
    //   state.isLoading = false;
    //   state.error = null;
    // });
    // builder.addCase(renameDocument.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
    builder.addCase(downloadDocument.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(downloadDocument.fulfilled, (state, action) => {
      // Handle successful download if needed
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(downloadDocument.rejected, (state, action) => {
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

    builder.addCase(getDocumentsMoveList.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDocumentsMoveList.fulfilled, (state, action) => {
      state.moveList = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getDocumentsMoveList.rejected, (state, action) => {
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
    builder
      .addCase(moveDocument.pending, (state) => {
        state.moveStatus = 'loading';
      })
      .addCase(moveDocument.fulfilled, (state, action) => {
        state.moveStatus = 'succeeded';

        state.folders = action.payload;
      })
      .addCase(moveDocument.rejected, (state, action) => {
        state.moveStatus = 'failed';
        state.error = action.payload;
      });
  },
});
export default documents.reducer;
