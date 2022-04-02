import { GET_DOC_ID } from './type';

export const getDocIdActionCreator = (docId) => {
  return {
    type: GET_DOC_ID,
    payload: docId,
  };
};
