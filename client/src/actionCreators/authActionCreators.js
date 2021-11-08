import { mosquitareAPI } from '../apis/mosquitare';
import history from '../history';
import {
  SIGNUP,
  LOAD_POSITION,
  ADD_USER_GLOBALLY,
  LOAD_ME,
  GET_SOCKET_ID,
  UPDATE_USER_POSITION_IN_GLOBAL,
  UPDATE_USER_SOCKETID_IN_GLOBAL,
  LOGIN,
  LOGOUT,
  UPDATE_CONVERSATION_STATE,
  UPDATE_CONVERSATION_TO_FALSE,
} from './type';

// loadmeで使うaction creator. loadPositionはすでにここにあるね。
import { getSocketIdActionCreator } from './mediaActionCreator';
// import { socket } from '../components/WorldMap';
import { I_GOT_SOCKET_ID } from './socketEvents';
import store from '../store';
import { getUsersActionCreator } from './usersActionCreator';

export const signupActionCreator = (formData) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/users/signup', formData);
    console.log('signup side', result);
    localStorage.setItem('mosquitare token', result.data.jwtToken);

    dispatch({
      type: SIGNUP,
      payload: result.data, // → user prop
    });
    // この後どうするかだね。

    // ここから、globalなusersのstateへの登録が始まる。
    // const { authState } = getState(); // 結局、ここも必要ないな。
    // ここで、tokenとかのpropertyを消すように整形しよう。後でね。

    // dispatch({
    //   type: ADD_USER_GLOBALLY,
    //   payload: authState,
    // }); // 結局ここも必要ないや。

    history.push('/worldmap');
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
    history.push('/worldmap');
  } catch (error) {
    console.log(error.message);
  }
};

export const loadPositionActionCreator = (dispatch) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  // const { longitude } = position.coords;
  // const { latitude } = position.coords;

  // const userPosition = {
  //   lng: Number(longitude.toFixed(1)),
  //   lat: Number(latitude.toFixed(1)),
  // };

  // dispatch({
  //   type: LOAD_POSITION,
  //   payload: userPosition,
  // });
};

//   );
// });

// let position = await new Promise((resolve, reject) => {
//   navigator.geolocation.getCurrentPosition(resolve, reject);
// });
// const { longitude } = position.coords;
// console.log(longitude);
// const { latitude } = position.coords;
// console.log(latitude);
// const userPosition = {
//   lng: Number(longitude.toFixed(1)),
//   lat: Number(latitude.toFixed(1)),
// };
// dispatch({
//   type: LOAD_POSITION,
//   payload: userPosition,
// });

// // navigator.geolocation.getCurrentPosition(
// //   (position) => {
// //     const { longitude } = position.coords;
// //     const { latitude } = position.coords;

// //     const userPosition = {
// //       lng: Number(longitude.toFixed(1)),
// //       lat: Number(latitude.toFixed(1)),
// //     };

// //     dispatch({
// //       type: LOAD_POSITION,
// //       payload: userPosition,
// //     });

// //     // lng: Number(position.coords.longitude.toFixed(1)),
// //     // lat: Number(position.coords.latitude.toFixed(1)),
// //   },
// //   (rejected) => {
// //     console.log(rejected);
// //   }
// // );

// export const loadPositionActionCreator = () => (dispatch) => {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { longitude } = position.coords;
//       const { latitude } = position.coords;

//       const userPosition = {
//         lng: Number(longitude.toFixed(1)),
//         lat: Number(latitude.toFixed(1)),
//       };

//       dispatch({
//         type: LOAD_POSITION,
//         payload: userPosition,
//       });
//     },
//     (rejected) => {
//       console.log(rejected);
//     }
//   );

//   // let position = await new Promise((resolve, reject) => {
//   //   navigator.geolocation.getCurrentPosition(resolve, reject);
//   // });
//   // const { longitude } = position.coords;
//   // console.log(longitude);
//   // const { latitude } = position.coords;
//   // console.log(latitude);
//   // const userPosition = {
//   //   lng: Number(longitude.toFixed(1)),
//   //   lat: Number(latitude.toFixed(1)),
//   // };
//   // dispatch({
//   //   type: LOAD_POSITION,
//   //   payload: userPosition,
//   // });

//   // // navigator.geolocation.getCurrentPosition(
//   // //   (position) => {
//   // //     const { longitude } = position.coords;
//   // //     const { latitude } = position.coords;

//   // //     const userPosition = {
//   // //       lng: Number(longitude.toFixed(1)),
//   // //       lat: Number(latitude.toFixed(1)),
//   // //     };

//   // //     dispatch({
//   // //       type: LOAD_POSITION,
//   // //       payload: userPosition,
//   // //     });

//   // //     // lng: Number(position.coords.longitude.toFixed(1)),
//   // //     // lat: Number(position.coords.latitude.toFixed(1)),
//   // //   },
//   // //   (rejected) => {
//   // //     console.log(rejected);
//   // //   }
//   // // );
// };

// and Updateだな。これは。
export const loadMeAndUpdateActionCreator = (jwtToken, socketId) => async (dispatch, getState) => {
  try {
    // const socketId = getState().authState.socketId;
    // console.log(socketId);
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
    const { user } = result.data;

    dispatch({
      type: LOAD_ME,
      payload: { user, jwtToken },
    });

    console.log('load me side after dispatching');
    // この中でgetsocketとかをやらないといけないんだな。
    // store.dispatch(getSocketIdActionCreator());
    store.dispatch(getUsersActionCreator());
    // loadPositionActionCreator().then((result) => {
    //   const { longitude } = result.coords;
    //   const { latitude } = result.coords;

    //   // const userPosition = {
    //   //   lng: Number(longitude.toFixed(1)),
    //   //   lat: Number(latitude.toFixed(1)),
    //   // };
    //   const userPosition = {
    //     lng: longitude,
    //     lat: latitude,
    //   };

    //   dispatch({
    //     type: LOAD_POSITION,
    //     payload: userPosition,
    //   });

    //   let { authState } = getState();
    //   // globalな方のstateにおける自分の情報を変える。
    //   dispatch({
    //     type: UPDATE_USER_POSITION_IN_GLOBAL,
    //     payload: { authState, userPosition },
    //   });

    //   // authState = getState().authState;

    //   // socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
    //   //   console.log(socketIdFromServer);
    //   //   dispatch({
    //   //     type: UPDATE_USER_SOCKETID_IN_GLOBAL,
    //   //     payload: { authState, socketIdFromServer },
    //   //   });
    //   // });

    //   // const { authState } = getState(); // うん。一気にやる必要ないかな。。。多分。。。

    //   // dispatch({
    //   //   type: ADD_USER_GLOBALLY,
    //   //   payload: authState,
    //   // });
    // });

    // console.log(authState); // currentPositionがnullになるときならない時色々だな。。。
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
    dispatch({
      type: UPDATE_CONVERSATION_STATE,
      payload: '',
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
  } catch (error) {
    console.log(error);
  }
};
