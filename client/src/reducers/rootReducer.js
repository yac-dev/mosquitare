import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';
import usersReducer from './usersReducer';
import meetingsReducer from './meetingsReducer';
import meetingReducer from './meetingReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
  usersState: usersReducer,
  meetingsState: meetingsReducer,
  meetingState: meetingReducer,
});

export default rootReducer;
