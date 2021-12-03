import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_INTEGRATED_USER_MEDIA, GET_INTEGRATED_USER_MEDIA_ID } from './type';
import {
  I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER,
  MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA,
} from './socketEvents';

//  mediaActionCreator callActionCreatorの中で使っている。
export const createIntegratedUserMediaActionCreator = (socket) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/integratedusermedias'); // dataは何も送らない。ただdocumentを作るだけ。
    const { integratedUserMedia } = result.data;
    dispatch({
      type: CREATE_INTEGRATED_USER_MEDIA,
      payload: integratedUserMedia._id, // このidは、会話終わりまで保持していなきゃいけないっていうことだ。
    });
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    socket.emit(I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, {
      to: partnerSocketId,
      integratedUserMediaId: integratedUserMedia._id,
    });
    // このタイミングでconversationの方もupdateする。{integratedUserMediaId: integratedUserMedia._id}をpost dataとしてね。
    // ここなー。promisifyの実験してみようかねー。。。
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
