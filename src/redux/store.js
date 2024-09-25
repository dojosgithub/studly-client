import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistStore } from 'redux-persist';
import rootReducer from './rootReducer';
import { signOut } from './slices/userSlice';
import { resetProjectState } from './slices/projectSlice';
import { resetCompanyState } from './slices/companySlice';
import { resetSubmittalState } from './slices/submittalSlice';
import { resetRfiState } from './slices/rfiSlice';
import { resetTemplateState } from './slices/templateSlice';
import { resetWorkflowState } from './slices/workflowSlice';
import { resetInviteState } from './slices/inviteSlice';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
});

const persistor = persistStore(store);

const logoutRedux = () => {
  persistor.purge(); // Remove persisted state for 'user' slice
  // Dispatch any additional logout actions here
  dispatch(resetCompanyState());
  dispatch(resetProjectState());
  dispatch(resetSubmittalState());
  dispatch(resetRfiState());
  dispatch(resetTemplateState());
  dispatch(resetWorkflowState());
  dispatch(resetInviteState());

  dispatch(signOut());
};

const { dispatch, getState } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, getState, useSelector, useDispatch, logoutRedux };
