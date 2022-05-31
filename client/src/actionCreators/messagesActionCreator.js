import { mosquitareAPI } from '../apis/mosquitare';
import { alertActionCreator } from './alertsActionCreator';

export const createMessageActionCreator = (content, recipientId) => async (dispatch, getState) => {
  try {
    const senderId = getState().authState.currentUser._id;
    // const messageSpaceId = getState().messageSpace._id;
    const result = await mosquitareAPI.post(`/messages/${senderId}/${recipientId}`, { content });
    const { message } = result.data;
    // alertを出すようにするか。
    console.log(message);
    dispatch({
      type: 'CREATE_MESSAGE',
      payload: message,
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

export const updateUnreadToReadActionCreator = (messages) => async (dispatch, getState) => {
  try {
    // const messageIds = messages.forEach((message) => message._id);
    const unreadingMessageIds = [];
    // const unreadUserMessages = getState().messagesWithUserState;
    const unreadUserMessages = Object.values(getState().messagesWithUserState);
    for (let i = 0; i < unreadUserMessages.length; i++) {
      if (unreadUserMessages[i].recipient._id === getState().authState.currentUser._id && !unreadUserMessages[i].read) {
        unreadingMessageIds.push(unreadUserMessages[i]._id);
      }
    }
    // messages
    const result = await mosquitareAPI.patch('/messages/unreadtoread', { unreadingMessageIds });
    dispatch({
      type: 'READ_MESSAGES',
      payload: unreadingMessageIds,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessagesWithUserActionCreator = (userId) => async (dispatch, getState) => {
  try {
    const myId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.post('/messages/user', { userId, myId });
    const { allMessages } = result.data;
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'GET_MESSAGES_WITH_USER',
        payload: allMessages,
      });
      resolve();
    });
  } catch (error) {
    console.log(error);
  }
};

export const cleanupMessagesWithUserActionCreator = () => {
  return {
    type: 'CLEANUP_MESSAGES_WITH_USER',
    payload: '',
  };
};
