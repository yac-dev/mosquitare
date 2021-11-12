import { mosquitareAPI } from '../apis/mosquitare';
import { GET_MEETINGS } from './type';

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

export const createMeetingRoomActionCreator = (formData) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/meetings');
    const { meeting } = result.data;
    dispatch({
      type: 'CREATE_MEETING_ROOM',
      payload: meeting,
    });
  } catch (error) {
    console.log(error);
  }
};
