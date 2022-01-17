import { mosquitareAPI } from '../apis/mosquitare';

export const createUserScriptActionCreator =
  (learningLanguageScript, nativeLanguageScript) => async (dispatch, getState) => {
    try {
      const userId = getState().authState.currentUser._id;
      const blobForLearningLanguage = new Blob(learningLanguageScript, { type: 'text/plain' });
      const blobForNativeLanguage = new Blob(nativeLanguageScript, { type: 'text/plain' });
      const formData = new FormData();
      formData.append('scriptFiles', blobForLearningLanguage);
      formData.append('scriptFiles', blobForNativeLanguage);
      const result = await mosquitareAPI.post(`/userscripts/upload/${userId}`, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      });
      const { userScript } = result.data;
      return Promise.resolve(userScript);
    } catch (error) {
      console.log(error);
    }
  };
