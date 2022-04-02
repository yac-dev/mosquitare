import { GET_DOC_ID } from '../actionCreators/type';

const docReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_DOC_ID:
      return { ...state };
    default:
      return { ...state };
  }
};

export default docReducer;
