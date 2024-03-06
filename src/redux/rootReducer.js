import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage';

import { persistReducer } from 'redux-persist';
import userReducer from './slices/userSlice'
import projectReducer from './slices/projectSlice'

const userPersistConfig = {
  key: 'user',
  storage,
};


const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `userReducer`
  user: persistReducer(userPersistConfig, userReducer),
  project: projectReducer,
})

export default rootReducer