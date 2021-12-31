import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_CONVERSATION, GET_CONVERSATION_ID, UPDATE_CONVERSATION_RECIEVED_USER } from './type';
import { I_SEND_CONVERSATION_ID_TO_MY_PARTNER, MY_CALLED_USER_CREATED_CONVERSATION } from './socketEvents';
import { hangUpCallActionCreator } from './mediaActionCreator';

// こいつを、chatが成立した後にtriggerさせないといかん。
export const createConversationActionCreator = (socket) => async (dispatch, getState) => {
  try {
    const { currentUser } = getState().authState;
    const result = await mosquitareAPI.post('/conversations', { calledUser: currentUser._id });
    return new Promise((resolve, reject) => {
      const { conversation } = result.data; // ここでvideoChatのidを受け取ったら、すぐにpeerにあげないと。
      console.log(result);
      console.log(conversation);
      // これも分けたほうがいいなー。細かく分けたいならね。今はいいや。
      const partnerSocketId = getState().mediaState.callingWith.socketId;
      socket.emit(I_SEND_CONVERSATION_ID_TO_MY_PARTNER, { to: partnerSocketId, conversationId: conversation._id });
      dispatch({
        type: CREATE_CONVERSATION, // ここら辺の名前なー。後で直さないとな。
        payload: conversation._id,
      });
      resolve(); // promise返す。意図的に。
    });
  } catch (error) {
    console.log(error);
  }
}; // 名前を変える。

export const getConversationIdFromCalledUserActionCreator = (socket) => (dispatch, getState) => {
  try {
    return new Promise((resolve, reject) => {
      socket.on(MY_CALLED_USER_CREATED_CONVERSATION, (dataFromServer) => {
        dispatch({
          type: GET_CONVERSATION_ID,
          payload: dataFromServer.conversationId,
        });
        resolve(dataFromServer.conversationId);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// conversationIdをもらったらこれを実行する。上の続きだな。
export const updateConversationRecievedUserActionCreator = (conversationId) => async (dispatch, getState) => {
  try {
    const recievedUserId = getState().authState.currentUser._id;
    // const { conversationId } = getState().conversationState;
    // console.log(getState().conversationState);
    const result = await mosquitareAPI.post(`/conversations/${conversationId}`, { recievedUser: recievedUserId });
    // const { conversation } = result.data;
    // dispatch({
    //   type: UPDATE_CONVERSATION_RECIEVED_USER,
    //   payload: conversation._id,
    // });
  } catch (error) {
    console.log(error);
  }
};

// updateUserStreamActionCreator
// createVideoAndStoreInConversationAC
export const createVideoAndStoreInConversationActionCreator =
  (blobForVideo, blobForAudio, connectionRef) => async (dispatch, getState) => {
    try {
      const state = getState().mediaState;
      const { videoChatId } = getState().videoChatState;
      let result;
      // const postData = { calledUserStream: blob };
      // console.log(postData);
      const formData = new FormData();
      formData.append('mediaFiles', blobForVideo); // api側のmulterで、こういうpropertyで設定している。 ここでcreateVideoのapi requestをするようにする。
      formData.append('mediaFiles', blobForAudio);
      if (state.amICalling) {
        // bodyによって分けるって面倒くさいな。caller用のvideo提出endpoint、reciever用のvideo提出endpointってわけた方がいいかもしれないな。
        result = await mosquitareAPI.post(`/videochats/upload/caller/${videoChatId}`, formData, {
          headers: { 'Content-type': 'multipart/form-data' },
        });
      } else if (state.amIRecieving) {
        result = await mosquitareAPI.post(`/videochats/upload/reciever/${videoChatId}`, formData, {
          headers: { 'Content-type': 'multipart/form-data' },
        });
      }
      console.log(result); // これundefinedだった？？
      dispatch(hangUpCallActionCreator(connectionRef)); // 引数に、
    } catch (error) {
      console.log(error);
    }
  };

// export const getConversationsActionCreator = () => async (dispatch, getState) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };
