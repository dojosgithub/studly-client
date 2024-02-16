import { createSlice } from '@reduxjs/toolkit';
// import sum from 'lodash/sum';
// import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch, getState } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  assets: [],
  assetsNavigation: [
    {
      name: 'Home',
      id: 'home',
    },
  ],
  filters: {
    status: 'all',
    createdAt: null,
  },
  showShareAsset: false,
  sharedAssetIds: [],
};

const slice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET ASSETS
    getAssetsSuccess(state, action) {
      state.isLoading = false;
      state.assets = action.payload;
    },

    // GET ASSET
    setAssetsNavigationForward(state, action) {
      state.assetsNavigation.push(action.payload);
    },

    // GET ASSET
    setAssetsNavigationBackward(state, action) {
      state.assetsNavigation = state.assetsNavigation.slice(0, action.payload + 1);
    },

    initializeAssetsNavigation(state, action) {
      state.assetsNavigation = [
        {
          name: 'Home',
          id: 'home',
        },
      ];
    },

    // SET SHARE
    setShowShareAsset(state, action) {
      state.showShareAsset = action.payload;
    },

    // SET SHARE IDs
    setSharedAssetIDs(state, action) {
      if (action.payload === 'clear') {
        state.sharedAssetIds = [];
      } else if (state.sharedAssetIds.includes(action.payload)) {
        state.sharedAssetIds = state.sharedAssetIds.filter((asset) => asset !== action.payload);
      } else {
        state.sharedAssetIds.push(action.payload);
      }
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setAssetsNavigationForward,
  setAssetsNavigationBackward,
  initializeAssetsNavigation,
  setShowShareAsset,
  setSharedAssetIDs,
} = slice.actions;

// ----------------------------------------------------------------------

export function addAsset(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/asset', data);
      dispatch(getAssets());
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getAssets(filter = 'all') {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();
      let currentNavigation = state.asset.assetsNavigation[state.asset.assetsNavigation.length - 1];
      // let id = currentNavigation.id == 'home' ? '617010150cfaad00163ec657' : currentNavigation.id;
      let id = currentNavigation.id == 'home' ? state.persist.project_id : currentNavigation.id;
      const response = await axios.post(`/api/child/${id}`, { filters: { status: filter } });
      dispatch(slice.actions.getAssetsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function goForward(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/child/${data.id}`, { filters: { status: 'all' } });
      dispatch(slice.actions.setAssetsNavigationForward(data));
      dispatch(slice.actions.getAssetsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function goBackward(index, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/child/${id}`, { filters: { status: 'all' } });
      dispatch(slice.actions.setAssetsNavigationBackward(index));
      dispatch(slice.actions.getAssetsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCurrentFolderId() {}

export function getThumbnailUrl(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = `api/asset/upload/thumbnail`;
      const response = await axios.post(url, data);
      return { url: response.data.location, key: response.data.key };
    } catch (error) {
      console.log(error);
    }
  };
}

// Fix this function / async thunk
export function getUploadParametersAction(data) {
  async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = `api/asset/upload/s3-sign-url`;

      const response = await axios.post(url, data);

      return {
        method: 'PUT',
        url: response.data.url,
        fields: response.fields,
        headers: {
          'Content-Type': data.contentType,
        },
      };
    } catch (error) {
      console.log(error);
    }
  };
}

export function uploadVideoAssets(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`api/asset/upload`, data);
      dispatch(getAssets());
    } catch (error) {
      console.log(error);
    }
  };
}

export function getShowShareAsset(state) {
  return () => {
    dispatch(slice.actions.setShowShareAsset(state));
    if (!state) {
      dispatch(getSharedAssetIDs('clear'));
    }
  };
}

export function getSharedAssetIDs(id) {
  return () => {
    dispatch(slice.actions.setSharedAssetIDs(id));
  };
}
