import { mosquitareAPI } from '../apis/mosquitare';
import history from '../history';
import { SIGNUP, LOAD_ME, LOGIN, LOGOUT, UPDATE_CONVERSATION_STATE, UPDATE_CONVERSATION_TO_FALSE } from './type';

import store from '../store';
import { getUsersActionCreator } from './usersActionCreator';

export const signupActionCreator = (formData) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/users/signup', formData);
    console.log('signup side', result);
    localStorage.setItem('mosquitare token', result.data.jwtToken);

    dispatch({
      type: SIGNUP,
      payload: result.data,
    });
    // const jwtToken = localStorage.getItem('mosquitare token');
    // store.dispatch(loadMeAndUpdateActionCreator(jwtToken, ''));
    // history.push('/worldmap'); //この流れダメ。結局、ページリロードしないからsocketが働かないんだわ。
    window.location = '/worldmap';
  } catch (error) {
    console.log(error);
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
    window.location = '/worldmap';
  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.message;
    console.log(errorMessage);
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
    dispatch({
      type: LOAD_ME,
      payload: { user, jwtToken },
    });
  } catch (error) {
    console.log(error);
  }
};

// このLOAD_MEが複数回起こる原因は何なの？そもそもuseEffectで設定をしているのに。。。→多分変なバグだろう。実際には、serverを何回も起こすなんてしないから、まあそんなに気にする必要もないだろう。
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
    history.push('/');
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
      const languageAndLengthTable = { learningLang: {}, nativeLang: {} };
      const userId = getState().authState.currentUser._id;
      const { exchangingLanguages } = getState().mediaState;
      if (getState().mediaState.amICalling) {
        languageAndLengthTable['learningLang']['_id'] = exchangingLanguages[0]._id;
        languageAndLengthTable['learningLang']['length'] = learningLangLength;
        languageAndLengthTable['nativeLang']['_id'] = exchangingLanguages[1]._id;
        languageAndLengthTable['nativeLang']['length'] = nativeLangLength;
      } else if (getState().mediaState.amIRecieving) {
        languageAndLengthTable['nativeLang']['_id'] = exchangingLanguages[0]._id;
        languageAndLengthTable['nativeLang']['length'] = nativeLangLength;
        languageAndLengthTable['learningLang']['_id'] = exchangingLanguages[1]._id;
        languageAndLengthTable['learningLang']['length'] = learningLangLength;
      }
      const result = await mosquitareAPI.patch(`/users/${userId}/langsstatus`, { languageAndLengthTable });
      console.log(result);
      return Promise.resolve();
    } catch (error) {
      console.log(error);
    }
  };
