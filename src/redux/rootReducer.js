import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage';

import { persistReducer } from 'redux-persist';
import userReducer from './slices/userSlice'
import projectReducer from './slices/projectSlice'
import companyReducer from './slices/companySlice'
import submittalReducer from './slices/submittalSlice'
import templateReducer from './slices/templateSlice'
import workflowReducer from './slices/workflowSlice'

const userPersistConfig = {
  key: 'user',
  storage,
};


const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `userReducer`
  user: persistReducer(userPersistConfig, userReducer),
  company: companyReducer,
  project: projectReducer,
  submittal: submittalReducer,
  template: templateReducer,
  workflow: workflowReducer,
})

export default rootReducer