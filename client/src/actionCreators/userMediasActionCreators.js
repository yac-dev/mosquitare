import { mosquitareAPI } from '../apis/mosquitare';
import { GET_CALLEDUSER_VIDEO_STREAM, GET_RECIEVEDUSER_VIDEO_STREAM, CREATE_USER_MEDIA } from './type';
import { hangUpCallActionCreator } from './mediaActionCreator';

export const createUserMedia = (blobForVideo, duration) => async (dispatch, getState) => {
  try {
    console.log(blobForVideo); // ここがなぜundefined？？
    // console.log(blobForAudio);
    console.log(duration);
    const userId = getState().authState.currentUser._id;
    const { conversationId } = getState().conversationState;
    const formData = new FormData();
    formData.append('mediaFile', blobForVideo);
    formData.append('duration', duration);
    // formData.append('mediaFiles', blobForAudio);
    // formData.append('conversationId', conversationId); // paramにいれてもいいかも。
    // formData.append('conversationDuration', seconds);
    // formData.append('mediaFiles', blobForLearningLanguage);
    // formData.append('mediaFiles', blobForNativeLanguage);
    const result = await mosquitareAPI.post(`/userMedias/upload/${userId}/${conversationId}`, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
    console.log(result);
    const { userMedia } = result.data;
    dispatch({
      type: CREATE_USER_MEDIA,
      payload: '',
    });
    return Promise.resolve(userMedia);
    // const callingState = getState().mediaState;
    // const { integratedUserMediaId } = getState().integratedUserMediaState;
    // if (callingState.amICalling) {
    //   // usermedia自体を{calledUserMedia: userMedia._id}みたいな感じでpost requestを送る。
    //   await mosquitareAPI.patch(`/integratedusermedias/${integratedUserMediaId}`, {
    //     calledUserMedia: userMedia._id,
    //   });
    //   // integrated UserMediaを作る、というかupdateする。ここはcalledUserの方ね。
    // } else if (callingState.amIRecieving) {
    //   // integrated UserMediaを作る、というかupdateする。ここはrecievedUserの方ね。
    //   await mosquitareAPI.patch(`/integratedusermedias/${integratedUserMediaId}`, {
    //     recievedUserMedia: userMedia._id,
    //   });
    // }
    // dispatch(hangUpCallActionCreator(connectionRef)); // ここもpromisifyだな。
  } catch (error) {
    console.log(error); // koko？？
  }
};

// ここら辺なー。もう少しうまく書けるだろう。
export const getUserMediaActionCreator = (forCalledUserOrRecievedUser) => async (dispatch, getState) => {
  try {
    let fileKey;
    if (forCalledUserOrRecievedUser === 'calledUser') {
      fileKey = getState().currentWatchingConversationState.currentWatchingConversation.calledUserMedia.videoFileName;
      const result = await mosquitareAPI.get(`/userMedias/${fileKey}`);
      const { stream } = result.data;
      console.log(stream);
      dispatch({
        type: GET_CALLEDUSER_VIDEO_STREAM,
        payload: stream,
      });
    } else if (forCalledUserOrRecievedUser === 'recievedUser') {
      fileKey = getState().currentWatchingConversationState.currentWatchingConversation.recievedUserMedia.videoFileName;
      const result = await mosquitareAPI.get(`/userMedias/${fileKey}`);
      const { stream } = result.data;
      console.log('recieved', stream);
      dispatch({
        type: GET_RECIEVEDUSER_VIDEO_STREAM,
        payload: stream,
      });
    }
    // const result = await mosquitareAPI.get(`/userMedias/${fileKey}`);
    // console.log(result);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

// これだ。
export const createLanguageScriptTextFileActionCreator =
  (learningLanguageScript, nativeLanguageScript) => async (dispatch, getState) => {
    let blobForLearningLanguage = new Blob([learningLanguageScript], { type: 'text/plain' });
    let blobForNativeLanguage = new Blob([nativeLanguageScript], { type: 'text/plain' });
    const userId = getState().authState.currentUser._id;
    const formData = new FormData();
    formData.append('textFiles', blobForLearningLanguage);
    formData.append('textFiles', blobForNativeLanguage);
    const result = await mosquitareAPI.post(`/userMedias/upload/languagescripts/${userId}`, formData);
    return Promise.resolve(); //これでいいか。。。
  };
