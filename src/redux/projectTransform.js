import { createTransform } from 'redux-persist';


const projectObj = {
  name: '',
  trades: [],
  workflow: {
    name: '',
    statuses: [],
    returnDate: '',
  },
}
const initialState = {
  list: [],

  current: null,
  create: { ...projectObj },
  subcontractors: {
    list: [],
  },
  inviteUsers: {
    internal: [],
    external: [],
  },
  users: [], 
  isLoading: false,
  error: null
}

// Transformation to persist/rehydrate only the 'current' field
export const projectTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState, key) => ({ current: inboundState.current }),
  
  // Only persist the 'current' field
  // transform state being rehydrated
  (outboundState, key) =>  ({ ...initialState, current: outboundState.current }),
    // Return the outbound state as is. You could also merge this with initial state
    // if needed, depending on your application requirements.
  // define which reducers this transform gets called for.
  { whitelist: ['project'] }
);
