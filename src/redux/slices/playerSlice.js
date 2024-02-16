// redux-toolkit
import { createSlice } from '@reduxjs/toolkit';
// utils
import { axiosInstance as axios } from 'src/utils/axios';
// store
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  player: {},
  timeTravelPlayer: 0,
  timeTravelPlayerCount: 0,
};

const slice = createSlice({
  name: 'player',
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

    // SET DATA
    setPlayerData(state, action) {
      state.isLoading = false;
      state.player = action.payload;
    },

    // SET ASSET
    setPlayerAsset(state, action) {
      state.isLoading = false;
      state.player.asset = action.payload;
    },

    // SET COMMENTS
    setPlayerComments(state, action) {
      state.isLoading = false;
      state.player.comments = action.payload;
    },

    // SET PLAYER TIME TRAVEL
    setTimeTravelPlayer(state, action) {
      state.timeTravelPlayerCount += 1;
      state.timeTravelPlayer = action.payload;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, hasError, setPlayerData, setPlayerAsset, setPlayerComments, setTimeTravelPlayer } = slice.actions;

// ----------------------------------------------------------------------

// For All Data
export function getPlayerData(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let asset;
      let comments;
      await axios.get(`/api/asset/${id}`).then(async (response) => {
        asset = response.data;
        await axios.get(`/api/comment/${id}`).then((res) => {
          comments = res.data
          dispatch(slice.actions.setPlayerData({
            asset: asset.data,
            comments: comments.data
          }));
        })

      })

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// For Asset Only
export function getPlayerAsset(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get(`/api/asset/${id}`).then(async (response) => {
        dispatch(slice.actions.setPlayerAsset(response.data.data));
      })

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// For Comments Only
export function getPlayerComments(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get(`/api/comment/${id}`).then((response) => {
        dispatch(slice.actions.setPlayerComments(response.data.data));
      })

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// For Player Time Travel To Timestamp
export function getTimeTravelPlayer(timeStamp) {
  return () => {
    dispatch(slice.actions.setTimeTravelPlayer(timeStamp));
  };
}
