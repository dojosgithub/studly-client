import { combineReducers } from 'redux'

import userReducer from './slices/userSlice'

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `userReducer`
  user: userReducer,
})

export default rootReducer