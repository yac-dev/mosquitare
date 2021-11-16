import { JOIN_MEETING } from './type';

export const joinMeetingActionCreator = (meeting) => (dispatch, getState) => {
  // ここ、promiseうまく使うしかないわ。
  dispatch({
    type: JOIN_MEETING,
    payload: meeting,
  });
};
