import { createSlice } from '@reduxjs/toolkit';
// import sum from 'lodash/sum';
// import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch, getState } from '../store';
import { getSharedAssetIDs } from './assets';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  shows: [],
  playlists: [],
  show: null,
  filters: {
    status: 'all',
    createdAt: null,
  },
};

const slice = createSlice({
  name: 'show',
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

    // GET SHOWS
    getShowsSuccess(state, action) {
      state.isLoading = false;
      state.shows = action.payload;
    },

    // GET SHOW
    getShowSuccess(state, action) {
      state.isLoading = false;
      state.show = action.payload;
    },

    getPlaylistsSuccess(state, action) {
      state.isLoading = false;
      state.playlists = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getShowSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function addSurface(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/asset', data);
      // dispatch(getAssets());
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getShows() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();

      let id = state.persist.project_id;
      const response = await axios.post(`/api/show/${id}`);
      dispatch(slice.actions.getShowsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getShow(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/show/${id}`);
      dispatch(slice.actions.getShowSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPlayLists(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/playlist/${id}`);
      dispatch(slice.actions.getPlaylistsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createPlaylist(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/playlist`, data);
      // dispatch(slice.actions.getShowSuccess(response.data.data));
      dispatch(getSharedAssetIDs('clear'));
      dispatch(slice.actions.getPlaylistsSuccess(response.data.data));
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function deletePlaylist(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/playlist/${id}`);
      // dispatch(slice.actions.getShowSuccess(response.data.data));
      dispatch(slice.actions.getPlaylistsSuccess(response.data.data));
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function updateShow(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/show/${id}`, data);
      dispatch(slice.actions.getShowSuccess(response.data.data));
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function createShow(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/show`, data);
      dispatch(slice.actions.getShowSuccess(response.data.data));
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}
