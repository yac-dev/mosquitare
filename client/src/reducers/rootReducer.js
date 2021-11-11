import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';
import usersReducer from './usersReducer';
import meetingsReducer from './meetingsReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
  usersState: usersReducer,
  meetingsState: meetingsReducer,
});

export default rootReducer;
