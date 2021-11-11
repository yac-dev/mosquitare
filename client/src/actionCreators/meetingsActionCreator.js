import { mosquitareAPI } from '../apis/mosquitare';
import { GET_MEETINGS } from './type';

export const getMeetingsActionCreator = () => async (dispatch) => {
  try {
    const result = await mosquitareAPI.get('/meetings');
    const { meetings } = result.data;

    dispatch({
      type: GET_MEETINGS,
      payload: meetings,
    });
  } catch (error) {
    console.log(error);
  }
};
