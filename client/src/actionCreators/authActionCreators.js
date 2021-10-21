import { mosquitareAPI } from '../apis/mosquitare';
import { SIGNUP } from './type';

export const signupActionCreator = () => async (dispatch) => {
  try {
    const response = await mosquitareAPI.post('/users/signup');
    dispatch({
      type: SIGNUP,
      payload: response,
    });
  } catch (error) {}
};
