import { mosquitareAPI } from '../apis/mosquitare';

import { hangUpCallActionCreator } from './mediaActionCreator';

export const createUserMedia = (blobForVideo, blobForAudio, connectionRef) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const formData = new FormData();
    formData.append('mediaFiles', blobForVideo);
    formData.append('mediaFiles', blobForAudio);
    const createMediaResult = await mosquitareAPI.post(`/userMedias/upload/videoandaudio/${userId}`, formData);
    const { userMedia } = createMediaResult.data;
    const callingState = getState().mediaState;
    if (callingState.amICalling) {
      // usermedia自体を{calledUserMedia: userMedia._id}みたいな感じでpost requestを送る。
      // integrated UserMediaを作る、というかupdateする。ここはcalledUserの方ね。
    } else if (callingState.amIRecieving) {
      // integrated UserMediaを作る、というかupdateする。ここはrecievedUserの方ね。
    }
    // dispatch(hangUpCallActionCreator(connectionRef)); // ここもpromisifyだな。
  } catch (error) {
    console.log(error);
  }
};

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
