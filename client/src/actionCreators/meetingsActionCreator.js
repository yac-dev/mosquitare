import { mosquitareAPI } from '../apis/mosquitare';
import { GET_MEETINGS, CREATE_MEETING } from './type';

export const getMeetingsActionCreator = () => async (dispatch) => {
  try {
    const result = await mosquitareAPI.get('/meetings');
    const { meetings } = result.data;
    console.log(meetings);

    dispatch({
      type: GET_MEETINGS,
      payload: meetings,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createMeetingActionCreator = (formData) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/meetings', formData);
    console.log(result);
    const { meeting } = result.data;

    dispatch({
      type: CREATE_MEETING,
      payload: meeting,
    });
  } catch (error) {
    console.log(error);
  }
};
