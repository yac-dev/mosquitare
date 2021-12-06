import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';
import peerReducer from './peerReducer';
import usersReducer from './usersReducer';
import meetingsReducer from './meetingsReducer';
import meetingReducer from './meetingReducer';
import conversationReducer from './conversationReducer';
import integratedUserMediasReducer from './integratedUserMediasReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
  usersState: usersReducer,
  meetingsState: meetingsReducer,
  meetingState: meetingReducer,
  conversationState: conversationReducer,
  integratedUserMediaState: integratedUserMediasReducer,
  peerState: peerReducer,
});

export default rootReducer;
