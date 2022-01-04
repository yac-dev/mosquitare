import { mosquitareAPI } from '../apis/mosquitare';

import { hangUpCallActionCreator } from './mediaActionCreator';

export const createUserMedia = (blobForVideo, blobForAudio) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const formData = new FormData();
    formData.append('mediaFiles', blobForVideo);
    formData.append('mediaFiles', blobForAudio);
    // formData.append('mediaFiles', blobForLearningLanguage);
    // formData.append('mediaFiles', blobForNativeLanguage);
    const createMediaResult = await mosquitareAPI.post(`/userMedias/upload/${userId}`, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
    const { userMedia } = createMediaResult.data;
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
