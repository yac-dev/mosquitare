import { mosquitareAPI } from '../apis/mosquitare';
import { alertActionCreator } from './alertsActionCreator';

export const createMessageActionCreator = (content, recipientId) => async (dispatch, getState) => {
  try {
    const senderId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.post(`/messages/${senderId}/${recipientId}`, { content });
    const { message } = result.data;
    // alertを出すようにするか。
    dispatch({
      type: 'CREATE_MESSAGE',
      payload: '',
    });

    dispatch(alertActionCreator(`Your message has been sent!`, 'success'));
  } catch (error) {
    console.log(error);
  }
};

export const getMyMessagesActionCreator = () => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.post('/messages/mine', { userId });
    const { messages } = result.data;
    dispatch({
      type: 'GET_MY_MESSAGES',
      payload: messages,
    });
  } catch (error) {
    console.log(error);
  }
};
