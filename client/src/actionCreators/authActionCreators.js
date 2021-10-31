import { mosquitareAPI } from '../apis/mosquitare';
import history from '../history';
import { SIGNUP, LOAD_POSITION, ADD_USER_GLOBALLY, LOAD_ME } from './type';

// loadmeで使うaction creator. loadPositionはすでにここにあるね。
import { getSocketIdActionCreator } from './mediaActionCreator';

export const signupActionCreator = (formData) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/users/signup', formData);
    localStorage.setItem('mosquitare token', result.data.jwtToken);

    dispatch({
      type: SIGNUP,
      payload: result.data, // → user prop
    });

    // ここから、globalなusersのstateへの登録が始まる。
    const { authState } = getState();
    // ここで、tokenとかのpropertyを消すように整形しよう。後でね。
    dispatch({
      type: ADD_USER_GLOBALLY,
      payload: authState,
    });

    history.push('/worldmap');
  } catch (error) {
    console.log(error);
  }
};

export const loadPositionActionCreator = () => async (dispatch) => {
  let position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const { longitude } = position.coords;
  const { latitude } = position.coords;
  const userPosition = {
    lng: Number(longitude.toFixed(1)),
    lat: Number(latitude.toFixed(1)),
  };
  dispatch({
    type: LOAD_POSITION,
    payload: userPosition,
  });

  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     const { longitude } = position.coords;
  //     const { latitude } = position.coords;

  //     const userPosition = {
  //       lng: Number(longitude.toFixed(1)),
  //       lat: Number(latitude.toFixed(1)),
  //     };

  //     dispatch({
  //       type: LOAD_POSITION,
  //       payload: userPosition,
  //     });

  //     // lng: Number(position.coords.longitude.toFixed(1)),
  //     // lat: Number(position.coords.latitude.toFixed(1)),
  //   },
  //   (rejected) => {
  //     console.log(rejected);
  //   }
  // );
};

export const loadMeActionCreator = (jwtToken, socket) => async (dispatch, getState) => {
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

    // console.log(getState().authState.currentUserPosition);
    dispatch(getSocketIdActionCreator(socket));
    dispatch(loadPositionActionCreator()); // 多分、このタイミングだと時間がかかってるんだろな。
    const { authState } = getState();
    console.log(authState); // currentPositionがnullになるときならない時色々だな。。。
    dispatch({
      type: ADD_USER_GLOBALLY,
      payload: authState,
    });
  } catch (error) {
    console.log(error);
  }
};
