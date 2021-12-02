import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_CONVERSATION, GET_CONVERSATION_ID } from './type';
import { I_SEND_CONVERSATION_ID_TO_MY_PARTNER, MY_CALLED_USER_CREATED_CONVERSATION } from './socketEvents';
import { hangUpCallActionCreator } from './mediaActionCreator';

// こいつを、chatが成立した後にtriggerさせないといかん。
export const createConversationActionCreator = (calledUserId, socket) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/', { calledUser: calledUserId });
    const { conversation } = result.data; // ここでvideoChatのidを受け取ったら、すぐにpeerにあげないと。
    console.log(result);
    console.log(conversation);

    // ここら辺の名前も変えなきゃいけない。めちゃくちゃ分かりづらいわ。「最初のままずっと行こう、変えない」精神が、結局今の日本なんですよ。変える、更新することは体力も頭も使うが、長期的に見てどんないいことがあるか、ちゃんと考えないといかんのですよ。
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    socket.emit(I_SEND_CONVERSATION_ID_TO_MY_PARTNER, { to: partnerSocketId, conversationId: conversation._id });
    dispatch({
      type: CREATE_CONVERSATION, // ここら辺の名前なー。後で直さないとな。
      payload: conversation._id,
    });
  } catch (error) {
    console.log(error);
  }
}; // 名前を変える。

export const getConversationIdFromCalledUserActionCreator = (socket) => (dispatch, getState) => {
  try {
    socket.on(MY_CALLED_USER_CREATED_CONVERSATION, (dataFromServer) => {
      dispatch({
        type: GET_CONVERSATION_ID,
        payload: dataFromServer.videoChatId,
      });
    });
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