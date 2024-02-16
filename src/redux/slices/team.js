import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch, getState } from '../store';
import { setCurrentTeamId } from './persist';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  teams: [],
};

const slice = createSlice({
  name: 'teams',
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

    // GET TEAMS
    getTeamsSuccess(state, action) {
      state.isLoading = false;
      state.teams = action.payload;
    },

    // COLLABORATORS
    getCollaborators(state, action) {
      const states = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getCollaborators } = slice.actions;

// ----------------------------------------------------------------------

export function addTeam(data, userId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/team', data);
      dispatch(getTeams(userId));
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getTeams(_id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();
      const response = await axios.get(`/api/user/teams/${_id}`);
      // let team_id = localStorage.getItem('team_id');
      let team_id = state.persist.team_id;
      if (!team_id) {
        // localStorage.setItem('team_id', response.data.data.collaborations[0].team._id);
        dispatch(setCurrentTeamId(response.data.data.collaborations[0].team._id));
      }
      dispatch(slice.actions.getTeamsSuccess(response.data.data.collaborations));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
