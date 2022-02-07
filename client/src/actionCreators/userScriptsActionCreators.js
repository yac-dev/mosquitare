import { mosquitareAPI } from '../apis/mosquitare';

export const createUserScriptActionCreator =
  (conversationTranscript, learningLanguageScript, nativeLanguageScript) => async (dispatch, getState) => {
    try {
      const userId = getState().authState.currentUser._id;
      // const conversationTranscriptJSON = JSON.stringify(conversationTranscript);
      // console.log(conversationTranscriptJSON); // []を含めて、json化してしまっているな。これがerrorの原因になっている。
      const blobForConversationTranscript = new Blob(conversationTranscript, { type: 'text/plain' });
      const blobForLearningLanguage = new Blob(learningLanguageScript, { type: 'text/plain' });
      const blobForNativeLanguage = new Blob(nativeLanguageScript, { type: 'text/plain' });
      //本当は、全部のscriptをjsonで送りたい。その方が楽、後々ね。ただ、今はとりあえず、text fileで送ろう。
      const formData = new FormData();
      formData.append('scriptFiles', blobForConversationTranscript);
      formData.append('scriptFiles', blobForLearningLanguage);
      formData.append('scriptFiles', blobForNativeLanguage);
      const result = await mosquitareAPI.post(`/userscripts/upload/${userId}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          // 'Content-type': 'application/json',
        },
      });
      console.log(result);
      const { userScript } = result.data;
      return Promise.resolve(userScript);
    } catch (error) {
      console.log(error);
    }
  };

// とりあえずまず、acceptで試してみるか。
// export const updateUserScriptConversationTranscriptActionCreator =
//   (conversationTranscript) => async (dispatch, getState) => {
//     const conversationTranscriptJSON = JSON.stringify(conversationTranscript);
//     const userId = getState().authState.currentUser._id;
//     const blobForConversationTranscriptJSON = new Blob([conversationTranscriptJSON], { type: 'application/json' });
//     const formData = new FormData();
//     formData.append('scriptFiles', blobForConversationTranscriptJSON);
//     const result = await mosquitareAPI.post(`/userscripts/upload/${userId}`, formData, {
//       headers: { 'Content-type': 'application/json' }, // jsonデータを送る場合は、そもそもこのheadersが合わなかったと言うことか。
//     });
//     console.log(result);
//     const { userScript } = result.data;
//     return Promise.resolve(userScript);
//   };
