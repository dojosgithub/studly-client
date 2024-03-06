import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from "./rootReducer";
import { signOut } from "./slices/userSlice";

// const persistConfig = {
//   key: 'root',
//   storage,
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});


const persistor = persistStore(store)


const logoutRedux = () => {
  persistor.purge(); // Remove persisted state for 'user' slice
  // Dispatch any additional logout actions here
  dispatch(signOut())
};


const { dispatch, getState } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, getState, useSelector, useDispatch, logoutRedux };
