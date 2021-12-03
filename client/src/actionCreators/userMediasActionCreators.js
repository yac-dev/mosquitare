import { mosquitareAPI } from '../apis/mosquitare';

import { hangUpCallActionCreator } from './mediaActionCreator';

export const createUserMedia = (blobForVideo, blobForAudio, connectionRef) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const formData = new FormData();
    formData.append('mediaFiles', blobForVideo);
    formData.append('mediaFiles', blobForAudio);
    const createMediaResult = await mosquitareAPI.post(`/userMedias/upload/${userId}`, formData);
    const { userMedia } = createMediaResult.data;
    const callingState = getState().mediaState;
    if (callingState.amICalling) {
      // integrated UserMediaを作る、というかupdateする。ここはcalledUserの方ね。
    } else if (callingState.amIRecieving) {
      // integrated UserMediaを作る、というかupdateする。ここはrecievedUserの方ね。
    }
    dispatch(hangUpCallActionCreator(connectionRef));
  } catch (error) {
    console.log(error);
  }
};
