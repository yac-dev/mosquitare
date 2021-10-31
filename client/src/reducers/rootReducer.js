import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';
import globalUsersReducer from './globalUsersReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
  globalUsersState: globalUsersReducer,
});

export default rootReducer;
