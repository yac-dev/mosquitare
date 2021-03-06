import { mosquitareAPI } from '../apis/mosquitare';
import history from '../history';
import { SIGNUP, LOAD_ME, LOGIN, LOGOUT, UPDATE_CONVERSATION_STATE, UPDATE_CONVERSATION_TO_FALSE } from './type';
import { alertActionCreator } from './alertsActionCreator';

import store from '../store';
import { getUsersActionCreator } from './usersActionCreator';

export const signupActionCreator = (formData) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/users/signup', formData);
    console.log('signup side', result);
    localStorage.setItem('mosquitare token', result.data.jwtToken);
    localStorage.setItem('after signup', true);

    dispatch({
      type: SIGNUP,
      payload: result.data,
    });
    // const jwtToken = localStorage.getItem('mosquitare token');
    // store.dispatch(loadMeAndUpdateActionCreator(jwtToken, ''));
    // history.push('/worldmap'); //この流れダメ。結局、ページリロードしないからsocketが働かないんだわ。
    window.location = '/';
  } catch (error) {
    console.log(error);
    // dispatch(alertActionCreator('You got an error. Please write your info again.'));
  }
};

export const loginActionCreator = (formData) => async (dispatch) => {
  try {
    const result = await mosquitareAPI.post('/users/login', formData);
    localStorage.setItem('mosquitare token', result.data.jwtToken);
    console.log(result);
    dispatch({
      type: LOGIN,
      payload: result.data,
    });
    localStorage.setItem('after login', true);
    window.location = '/';
  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.message;
    console.log(errorMessage);
    dispatch(alertActionCreator('Something wrong with your email or password. Please try again.', 'error', 7000));
  }
};

export const loadMeActionCreator = (jwtToken) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get('/users/loadme', {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    const { user } = result.data;
    return new Promise((resolve, reject) => {
      dispatch({
        type: LOAD_ME,
        payload: { user, jwtToken },
      });
      resolve(user);
    });
  } catch (error) {
    console.log(error);
  }
};

export const loadMeAndUpdateActionCreator = (jwtToken, socketId) => async (dispatch, getState) => {
  try {
    console.log('load me side before finish');
    const result = await mosquitareAPI.patch(
      '/users/loadmeandupdate',
      { socketId },
      {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return new Promise((resolve, reject) => {
      const { user } = result.data;
      dispatch({
        type: LOAD_ME,
        payload: { user, jwtToken },
      });
      resolve();
    });
  } catch (error) {
    console.log(error);
  }
};

export const logoutActionCreator = () => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.patch(`/users/${userId}/logout`); // ここではbodyはいらない
    // いや。ここでは、isOnlineをfalseにしなきゃいけない。
    localStorage.removeItem('mosquitare token');
    dispatch({
      type: LOGOUT,
      payload: '',
    });
    // history.push('/');
    window.location = '/';
  } catch (error) {
    console.log(error);
  }
};

export const updateUserConversationStateActionCreator = () => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.patch(`/users/${userId}/conversation`);
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_CONVERSATION_STATE,
        payload: '',
      });
      resolve();
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateUserConversationToFalseActionCreator = () => async (dispatch, getState) => {
  try {
    console.log('to false working???y');
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.patch(`/users/${userId}/conversationtofalse`);
    dispatch({
      type: UPDATE_CONVERSATION_TO_FALSE,
      payload: '',
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

export const updateUserConversationsActionCreator = () => async (dispatch, getState) => {
  try {
    // conversationのidを持っておいて、ここにbodyとしてupdateしていくことにする。これを、completeCallの後のcreateConversationの後にthen chainしていく。
    // const userId = getState().authState.currentUser._id;
    // const result = await mosquitareAPI.patch(`/users//${userId}`);
    const userId = getState().authState.currentUser._id;
    const { conversationId } = getState().conversationState;
    const result = await mosquitareAPI.patch(`/users/${userId}/conversations`, { conversationId });
    dispatch({
      type: 'PUSH_CONVERSATION',
      payload: result.data,
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};

export const updateUserMyLangsStatusActionCreator =
  (learningLangLength, nativeLangLength) => async (dispatch, getState) => {
    try {
      // const languageAndLengthTable = { learningLang: {}, nativeLang: {} };
      // let countTable = {};
      // 基本、index0にlearning langのidが来るようにする。
      let countDatas = [{}, {}];
      const userId = getState().authState.currentUser._id;
      const { exchangingLanguages } = getState().mediaState;
      if (getState().mediaState.amICalling) {
        // const learningLanguageId = exchangingLanguages[0]._id;
        // const nativeLanguageId = exchangingLanguages[1]._id;
        // countTable[learningLanguageId] = learningLangLength;
        // countTable[nativeLanguageId] = nativeLangLength;
        countDatas[0]['id'] = exchangingLanguages[0]._id;
        countDatas[0]['words'] = learningLangLength;
        countDatas[1]['id'] = exchangingLanguages[1]._id;
        countDatas[1]['words'] = nativeLangLength;
        // languageAndLengthTable['learningLang']['_id'] = exchangingLanguages[0]._id;
        // languageAndLengthTable['learningLang']['length'] = learningLangLength;
        // languageAndLengthTable['nativeLang']['_id'] = exchangingLanguages[1]._id;
        // languageAndLengthTable['nativeLang']['length'] = nativeLangLength;
      } else if (getState().mediaState.amIRecieving) {
        // languageAndLengthTable['nativeLang']['_id'] = exchangingLanguages[0]._id;
        // languageAndLengthTable['nativeLang']['length'] = nativeLangLength;
        // languageAndLengthTable['learningLang']['_id'] = exchangingLanguages[1]._id;
        // languageAndLengthTable['learningLang']['length'] = learningLangLength;
        // const nativeLanguageId = exchangingLanguages[0]._id;
        // const learningLanguageId = exchangingLanguages[1]._id;
        // countTable[learningLanguageId] = learningLangLength;
        // countTable[nativeLanguageId] = nativeLangLength;
        countDatas[0]['id'] = exchangingLanguages[1]._id;
        countDatas[0]['words'] = learningLangLength;
        countDatas[1]['id'] = exchangingLanguages[0]._id;
        countDatas[1]['words'] = nativeLangLength;
      }
      mosquitareAPI.patch(`/users/${userId}/langsstatus`, { countDatas });
      // ここやろう。
      dispatch({
        type: 'SEND_LANGUAGE_STATUS',
        payload: '',
      });
    } catch (error) {
      console.log(error);
    }
  };

export const clickUserActionCreator = (user) => {
  return {
    type: 'CLICK_USER',
    payload: user,
  };
};

// なんかエラーある。
export const updateUserImageActionCreator = (fileBlob) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const formData = new FormData();
    formData.append('image', fileBlob);
    const result = await mosquitareAPI.patch(`/users/${userId}/image`, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
    const { user } = result.data;
    dispatch({
      type: 'UPDATE_USER_IMAGE',
      paylaod: user,
    });
    window.location = '/';
  } catch (error) {
    console.log(error);
  }
};
