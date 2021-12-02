import { CREATE_INTEGRATED_USER_MEDIA, GET_INTEGRATED_USER_MEDIA_ID } from '../actionCreators/type';

const integratedUserMediasReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_INTEGRATED_USER_MEDIA:
      return { state, integratedUserMediaId: action.payload };
    case GET_INTEGRATED_USER_MEDIA_ID:
      return { state, integratedUserMediaId: action.payload };
    default:
      return state;
  }
};

export default integratedUserMediasReducer;
