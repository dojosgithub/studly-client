import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import { persistReducer } from 'redux-persist';
import { projectTransform } from './projectTransform';
//
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import companyReducer from './slices/companySlice';
import submittalReducer from './slices/submittalSlice';
import rfiReducer from './slices/rfiSlice';
import planRoomReducer from './slices/planRoomSlice';
import meetingMinutesReducer from './slices/meetingMinutesSlice';
import dailyLogsReducer from './slices/dailyLogsSlice';
import documentsReducer from './slices/documentsSlice';
//
import templateReducer from './slices/templateSlice';
import workflowReducer from './slices/workflowSlice';
import inviteReducer from './slices/inviteSlice';

const userPersistConfig = {
  key: 'user',
  storage,
};

const projectPersistConfig = {
  key: 'project',
  storage,
  transforms: [projectTransform], // Include the transform here
};

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `userReducer`
  user: persistReducer(userPersistConfig, userReducer),
  project: persistReducer(projectPersistConfig, projectReducer),

  // company: persistReducer(companyPersistConfig, companyReducer),
  // project: projectReducer,
  company: companyReducer,
  submittal: submittalReducer,
  rfi: rfiReducer,
  planRoom: planRoomReducer,
  meetingMinutes: meetingMinutesReducer,
  dailyLogs: dailyLogsReducer,
  documents: documentsReducer,
  template: templateReducer,
  workflow: workflowReducer,
  invite: inviteReducer,
});

export default rootReducer;
