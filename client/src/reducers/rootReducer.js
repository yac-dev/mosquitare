import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';
import peerReducer from './peerReducer';
import usersReducer from './usersReducer';
import meetingsReducer from './meetingsReducer';
import meetingReducer from './meetingReducer';
import conversationReducer from './conversationReducer';
import conversationsReducer from './conversationsReducer';
import commentsReducer from './commentsReducer';
// import integratedUserMediasReducer from './integratedUserMediasReducer';
import currentWatchingConversationReducer from './currentWatchingConversationReducer';
import docReducer from './docReducer';
import transcriptsReducer from './transcriptsReducer';
import alertsReducer from './alertsReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
  usersState: usersReducer,
  meetingsState: meetingsReducer,
  meetingState: meetingReducer,
  conversationState: conversationReducer,
  // integratedUserMediaState: integratedUserMediasReducer,
  peerState: peerReducer,
  currentWatchingConversationState: currentWatchingConversationReducer,
  conversationsState: conversationsReducer,
  commentsState: commentsReducer,
  docState: docReducer,
  transcriptsState: transcriptsReducer,
  alertsState: alertsReducer,
});

export default rootReducer;
