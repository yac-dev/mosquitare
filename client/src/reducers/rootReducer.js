import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaRudecer';

const rootReducer = combineReducers({
  authState: authReducer,
  mediaState: mediaReducer,
});

export default rootReducer;
