import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
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
  surfaces: [],
  screens: [],
  stages: [],
  designStageData: {
    dropedScreens: [],
    stageURL: null,
    // historyStep: 0,
  },
  filters: {
    status: 'all',
    createdAt: null,
  },
};

const slice = createSlice({
  name: 'stage',
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

    // GET SURFACES
    getSurfacesSuccess(state, action) {
      state.isLoading = false;
      state.surfaces = action.payload;
    },

    // GET SCREENS
    getScreenSuccess(state, action) {
      state.isLoading = false;
      state.screens = action.payload;
    },

    // GET STAGES
    getStagesSuccess(state, action) {
      state.isLoading = false;
      state.stages = action.payload;
    },

    // SET SURFACE
    setSurfaceData(state, action) {},

    setDropedScreens(state, action) {
      state.designStageData.dropedScreens = action.payload;
    },

    setDropedScreenUsingIndex(state, action) {
      let { index, absPos } = action.payload;
      let changedDropedScreens = cloneDeep(state.designStageData.dropedScreens);
      // changedDropedScreens[index].position.originalX = absPos.x - 100;
      // changedDropedScreens[index].position.originalY = absPos.y - 200;
      changedDropedScreens[index].position.originalX = absPos.x;
      changedDropedScreens[index].position.originalY = absPos.y;
      // console.log('changedDropedScreens', changedDropedScreens);
      state.designStageData.dropedScreens = changedDropedScreens;
    },

    setStageUrl(state, action) {
      state.designStageData.stageURL = action.payload;
    },

    // setHistoryStep(state, action) {
    //   state.designStageData.historyStep = action.payload;
    // },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSurfaceData, setDropedScreens, setDropedScreenUsingIndex, setStageUrl } =
  slice.actions;

// ----------------------------------------------------------------------

export function addSurface(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/stages/surfaces', data);
      dispatch(getSurfaces());
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getSurfaces() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();

      let id = state.persist.project_id;
      const response = await axios.get(`/api/stages/surfaces/${id}`);
      dispatch(slice.actions.getSurfacesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addScreen(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/stages/screens', data);
      dispatch(getScreens());
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getScreens() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();

      let id = state.persist.project_id;
      const response = await axios.get(`/api/stages/screens/${id}`);
      dispatch(slice.actions.getScreenSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addStage(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/stages', data);
      dispatch(getStages());
      return { error: null };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { error };
    }
  };
}

export function getStages() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      let state = getState();

      let id = state.persist.project_id;
      const response = await axios.get(`/api/stages/${id}`);
      dispatch(slice.actions.getStagesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
