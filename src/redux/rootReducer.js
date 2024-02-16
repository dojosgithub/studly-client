import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import teamReducer from './slices/team';
import projectReducer from './slices/project';
import assetReducer from './slices/assets';
import playerReducer from './slices/player';
import stageReducer from './slices/stage';
import showReducer from './slices/show';
import persistStateReducer from './slices/persist';
import userReducer from './slices/user';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const statePersistConfig = {
  key: 'persist',
  storage,
  keyPrefix: 'redux-',
  // whitelist: ['sortBy', 'checkout'],
};

const appReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  team: teamReducer,
  project: projectReducer,
  asset: assetReducer,
  player: playerReducer,
  product: persistReducer(productPersistConfig, productReducer),
  stage: stageReducer,
  show: showReducer,
  persist: persistReducer(statePersistConfig, persistStateReducer),
  user: userReducer,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === 'user/logout') {
    state = undefined;
    storage.removeItem('persist:root');
    storage.removeItem('persist:persist');
  }

  return appReducer(state, action);
};

export { rootPersistConfig, rootReducer };
