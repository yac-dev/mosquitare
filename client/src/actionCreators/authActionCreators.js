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
    console.log('working???');
    const result = await mosquitareAPI.post('/users/login', formData);
    localStorage.setItem('mosquitare token', result.data.jwtToken);
    console.log(result);
    dispatch({
      type: LOGIN,
      payload: result.data,
    });
    window.location = '/worldmap';
  } catch (error) {
    console.log(error.message);
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
