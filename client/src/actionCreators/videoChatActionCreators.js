import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_VIDEO_CHAT, GET_VIDEO_CHAT_ID } from './type';
import { I_SEND_VIDEO_CHAT_ID_TO_MY_PARTNER, MY_CALLER_CREATED_VIDEO_CHAT_DOCUMENT } from './socketEvents';
import { hangUpCallActionCreator } from './mediaActionCreator';

// こいつを、chatが成立した後にtriggerさせないといかん。
export const createVideoChatActionCreator = (callerUserId, socket) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/videochats', { callerUserId });
    const { videoChat } = result.data; // ここでvideoChatのidを受け取ったら、すぐにpeerにあげないと。
    console.log(result);
    console.log(videoChat);

    // ここら辺の名前も変えなきゃいけない。めちゃくちゃ分かりづらいわ。「最初のままずっと行こう、変えない」精神が、結局今の日本なんですよ。変える、更新することは体力も頭も使うが、長期的に見てどんないいことがあるか、ちゃんと考えないといかんのですよ。
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    socket.emit(I_SEND_VIDEO_CHAT_ID_TO_MY_PARTNER, { to: partnerSocketId, videoChatId: videoChat._id });
    dispatch({
      type: CREATE_VIDEO_CHAT, // ここら辺の名前なー。後で直さないとな。
      payload: videoChat._id,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getVideoChatIdFromCallerActionCreator = (socket) => (dispatch, getState) => {
  try {
    socket.on(MY_CALLER_CREATED_VIDEO_CHAT_DOCUMENT, (dataFromServer) => {
      dispatch({
        type: GET_VIDEO_CHAT_ID,
        payload: dataFromServer.videoChatId,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserStreamActionCreator = (blob, connectionRef) => async (dispatch, getState) => {
  try {
    console.log('updating viode chattttt!!');
    const state = getState().mediaState;
    const { videoChatId } = getState().videoChatState;
    let result;
    // const postData = { calledUserStream: blob };
    // console.log(postData);
    const formData = new FormData();
    formData.append('videoFile', blob); // api側のmulterで、こういうpropertyで設定している。
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
