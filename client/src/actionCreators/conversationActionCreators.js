import { mosquitareAPI } from '../apis/mosquitare';
import {
  CREATE_CONVERSATION,
  GET_CONVERSATION_ID,
  UPDATE_CONVERSATION_RECIEVED_USER,
  GET_CONVERSATION,
  CREATE_USER_MEDIA,
  CREATE_USER_SCRIPT,
  GET_ALL_CONVERSATIONS,
} from './type';
import { I_SEND_CONVERSATION_ID_TO_MY_PARTNER, MY_CALLED_USER_CREATED_CONVERSATION } from './socketEvents';
import { hangUpCallActionCreator } from './mediaActionCreator';

// こいつを、chatが成立した後にtriggerさせないといかん。
export const createConversationActionCreator = (socket) => async (dispatch, getState) => {
  try {
    const { currentUser } = getState().authState;
    const { exchangingLanguages } = getState().mediaState;
    const result = await mosquitareAPI.post('/conversations', { userId: currentUser._id, genre: exchangingLanguages });
    return new Promise((resolve, reject) => {
      const { conversation } = result.data; // ここでvideoChatのidを受け取ったら、すぐにpeerにあげないと。
      console.log(result);
      console.log(conversation);
      // これも分けたほうがいいなー。細かく分けたいならね。今はいいや。
      // const partnerSocketId = getState().mediaState.callingWith.socketId;
      // socket.emit(I_SEND_CONVERSATION_ID_TO_MY_PARTNER, { to: partnerSocketId, conversationId: conversation._id });
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

// これももう使わない。createUserのbackend側で全部やっちゃうから。
export const updateConversationUserMediaActionCreator = (userMedia) => async (dispatch, getState) => {
  try {
    const callingState = getState().mediaState;
    const { conversationId } = getState().conversationState;
    let result;
    if (callingState.amICalling) {
      // usermedia自体を{calledUserMedia: userMedia._id}みたいな感じでpost requestを送る。
      result = await mosquitareAPI.patch(`/conversations/${conversationId}/usermedia`, {
        calledUserMedia: userMedia._id,
      });
      console.log(result);
      // integrated UserMediaを作る、というかupdateする。ここはcalledUserの方ね。
    } else if (callingState.amIRecieving) {
      // integrated UserMediaを作る、というかupdateする。ここはrecievedUserの方ね。
      result = await mosquitareAPI.patch(`/conversations/${conversationId}/usermedia`, {
        recievedUserMedia: userMedia._id, // これ。promiseが返っていないよな、多分。
      });
      console.log(result);
    }
    dispatch({
      type: CREATE_USER_MEDIA,
      payload: 1,
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

// これももう使わない。
export const updateConversationUserScriptActionCreator = (userScript) => async (dispatch, getState) => {
  try {
    const callingState = getState().mediaState;
    const { conversationId } = getState().conversationState;
    let result;
    if (callingState.amICalling) {
      result = await mosquitareAPI.patch(`/conversations/${conversationId}/userscript`, {
        calledUserScript: userScript._id,
      });
      console.log(result);
      // integrated UserMediaを作る、というかupdateする。ここはcalledUserの方ね。
    } else if (callingState.amIRecieving) {
      // integrated UserMediaを作る、というかupdateする。ここはrecievedUserの方ね。
      result = await mosquitareAPI.patch(`/conversations/${conversationId}/userscript`, {
        recievedUserScript: userScript._id, // これと
      });
      console.log(result);
    }
    dispatch({
      type: CREATE_USER_SCRIPT,
      payload: 1,
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

// これももう使わない。
// export const updateConversationDurationAndGenreActionCreator = (duration) => async (dispatch, getState) => {
//   try {
//     const { conversationId } = getState().conversationState;
//     const genre = getState().mediaState.exchangingLanguages; // arrray;
//     const result = await mosquitareAPI.patch(`/conversations/${conversationId}/durationandgenre`, { duration, genre });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const sendConversationIdActionCreator = (socket) => (dispatch, getState) => {
  try {
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    const { conversationId } = getState().conversationState; // updateuserでもそうだったけど、この時点ではconversationがまだstoreのなかに入ってないんだよな。
    socket.emit(I_SEND_CONVERSATION_ID_TO_MY_PARTNER, { to: partnerSocketId, conversationId });
    dispatch({
      type: CREATE_CONVERSATION, // ここら辺の名前なー。後で直さないとな。
      payload: conversationId,
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

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
export const updateConversationUsersActionCreator = () => async (dispatch, getState) => {
  try {
    const recievedUserId = getState().authState.currentUser._id;
    // const { conversationId } = getState().conversationState;
    // console.log(conversationId); // then chainしても、この段階で直前で更新したredux stateをここで使えないんだな。。。。
    const { conversationId } = getState().conversationState;
    // console.log(getState().conversationState);
    const result = await mosquitareAPI.post(`/conversations/${conversationId}`, { userId: recievedUserId });
    // const { conversation } = result.data;
    // dispatch({
    //   type: UPDATE_CONVERSATION_RECIEVED_USER,
    //   payload: conversation._id,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const getConversationActionCreator = (conversationId) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get(`/conversations/${conversationId}`);
    const { conversation } = result.data;
    dispatch({
      type: GET_CONVERSATION,
      payload: conversation,
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

// updateUserStreamActionCreator
// createVideoAndStoreInConversationAC
// export const createVideoAndStoreInConversationActionCreator =
//   (blobForVideo, blobForAudio, connectionRef) => async (dispatch, getState) => {
//     try {
//       const state = getState().mediaState;
//       const { videoChatId } = getState().videoChatState;
//       let result;
//       // const postData = { calledUserStream: blob };
//       // console.log(postData);
//       const formData = new FormData();
//       formData.append('mediaFiles', blobForVideo); // api側のmulterで、こういうpropertyで設定している。 ここでcreateVideoのapi requestをするようにする。
//       formData.append('mediaFiles', blobForAudio);
//       if (state.amICalling) {
//         // bodyによって分けるって面倒くさいな。caller用のvideo提出endpoint、reciever用のvideo提出endpointってわけた方がいいかもしれないな。
//         result = await mosquitareAPI.post(`/videochats/upload/caller/${videoChatId}`, formData, {
//           headers: { 'Content-type': 'multipart/form-data' },
//         });
//       } else if (state.amIRecieving) {
//         result = await mosquitareAPI.post(`/videochats/upload/reciever/${videoChatId}`, formData, {
//           headers: { 'Content-type': 'multipart/form-data' },
//         });
//       }
//       console.log(result); // これundefinedだった？？
//       dispatch(hangUpCallActionCreator(connectionRef)); // 引数に、
//     } catch (error) {
//       console.log(error);
//     }
//   };

// export const getConversationsActionCreator = () => async (dispatch, getState) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getAllConversationsActionCreator = () => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get('/conversations');

    console.log(result.data);
    const { allConversations } = result.data;
    dispatch({
      type: GET_ALL_CONVERSATIONS,
      payload: allConversations,
    });
  } catch (error) {
    console.log(error);
  }
};
