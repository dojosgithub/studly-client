import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch, getState } from '../store';
import { setCurrentProjectId } from './persist';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  projects: [],
};

const slice = createSlice({
  name: 'projects',
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

    // GET PROJECTS
    getProjectsSuccess(state, action) {
      state.isLoading = false;
      state.projects = action.payload;
    },

    // GET PROJECTS
    getProjectsRole(state, action) {
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getProjectsRole } = slice.actions;

// ----------------------------------------------------------------------

export function addProject(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();
      const response = await axios.post('/api/project', data);
      dispatch(getProjects(state.persist.team_id));
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getProjects(team_id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();
      // const response = await axios.get('/api/project/team-projects/617010140cfaad00163ec655');
      const response = await axios.get(`/api/project/team-projects/${team_id}`);
      // let project_id = localStorage.getItem('project_id');
      let project_id = state.persist.project_id;
      if (!project_id) {
        // localStorage.setItem('project_id', response.data.data[0]._id);
        dispatch(setCurrentProjectId(response.data.data[0]._id));
      }
      dispatch(slice.actions.getProjectsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
