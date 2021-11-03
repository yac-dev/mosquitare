import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
  usersState: usersReducer,
});

export default rootReducer;
