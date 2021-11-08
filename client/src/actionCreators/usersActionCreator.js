import { mosquitareAPI } from '../apis/mosquitare';
import { GET_USERS } from './type';

export const getUsersActionCreator = () => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get('/users');
    const { users } = result.data;

    dispatch({
      type: GET_USERS,
      payload: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateConversationStateActionCreator = () => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id; //postのbodyはいらないな。ただ、booleanをtrueにするだけだ。
    const result = await mosquitareAPI.patch(`/users/${userId}/conversation`);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
