import { combineReducers } from 'redux'

import userReducer from './slices/userSlice'
import projectReducer from './slices/projectSlice'

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `userReducer`
  user: userReducer,
  project: projectReducer,
})

export default rootReducer