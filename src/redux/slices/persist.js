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
  team_id: null,
  project_id: null,
};

const slice = createSlice({
  name: 'persist',
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
    setCurrentTeamId(state, action) {
      state.isLoading = false;
      state.team_id = action.payload;
      state.project_id = null;
    },

    setCurrentProjectId(state, action) {
      state.isLoading = false;
      state.project_id = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setCurrentTeamId, setCurrentProjectId } = slice.actions;

// ----------------------------------------------------------------------
