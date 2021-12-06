import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_INTEGRATED_USER_MEDIA, GET_INTEGRATED_USER_MEDIA_ID } from './type';
import {
  I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER,
  MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA,
} from './socketEvents';

//  mediaActionCreator callActionCreatorの中で使っている。
// 一つの関数で多くのことやりすぎね。やばい。
export const createIntegratedUserMediaActionCreator = (socket) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/integratedusermedias'); // dataは何も送らない。ただdocumentを作るだけ。
    return new Promise((resolve, reject) => {
      const { integratedUserMedia } = result.data;
      console.log(integratedUserMedia);
      dispatch({
        type: CREATE_INTEGRATED_USER_MEDIA,
        payload: integratedUserMedia._id, // このidは、会話終わりまで保持していなきゃいけないっていうことだ。
      });
      resolve();
      // const partnerSocketId = getState().mediaState.callingWith.socketId;
      // socket.emit(I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, {
      //   to: partnerSocketId,
      //   integratedUserMediaId: integratedUserMedia._id,
      // });
    });
    // このタイミングでconversationの方もupdateする。{integratedUserMediaId: integratedUserMedia._id}をpost dataとしてね。
    // ここなー。promisifyの実験してみようかねー。。。ここか。
  } catch (error) {
    console.log(error);
  }
};

export const sendIntegratedUserMediaActionCeator = (socket) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    const { integratedUserMediaId } = getState().integratedUserMediaState;
    socket.emit(I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, {
      to: partnerSocketId,
      integratedUserMediaId: integratedUserMediaId,
    });
    resolve();
  });
};

// これ、あとでconversationACの方に変える。
export const updateConversationIntegratedUserMediaActionCreator = () => async (dispatch, getState) => {
  try {
    const { conversationId } = getState().conversationState;
    const { integratedUserMediaId } = getState().integratedUserMediaState;
    const result = await mosquitareAPI.patch(`/conversations/integratedusermedia/${conversationId}`, {
      integratedUserMedia: integratedUserMediaId,
    });
    const { conversation } = result.data;
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_CONVERSATION_INTEGRATED_USER_MEDIA',
        payload: conversation._id,
      });
      resolve();
    });
  } catch (error) {
    console.log(error);
  }
};

export const getIntegratedUserMediaIdFromCalledUserActionCreator = (socket) => async (dispatch, getState) => {
  try {
    socket.on(MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA, (dataFromServer) => {
      dispatch({
        type: GET_INTEGRATED_USER_MEDIA_ID,
        payload: dataFromServer.integratedUserMediaId,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
