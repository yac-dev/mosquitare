import { GET_DOC_ID } from '../actionCreators/type';

const INITIAL_STATE = {};

const docReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DOC_ID:
      return { ...state, id: action.payload };
    case 'GET_DOC':
      return { ...state, docNow: action.payload };
    default:
      return { ...state };
  }
};

export default docReducer;
