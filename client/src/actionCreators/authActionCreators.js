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
} from './type';

// loadmeで使うaction creator. loadPositionはすでにここにあるね。
import { getSocketIdActionCreator } from './mediaActionCreator';
// import { socket } from '../components/WorldMap';
import { I_GOT_SOCKET_ID } from './socketEvents';

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

    loadPositionActionCreator().then((result) => {
      const { longitude } = result.coords;
      const { latitude } = result.coords;

      // const userPosition = {
      //   lng: Number(longitude.toFixed(1)),
      //   lat: Number(latitude.toFixed(1)),
      // };
      const userPosition = {
        lng: longitude,
        lat: latitude,
      };

      dispatch({
        type: LOAD_POSITION,
        payload: userPosition,
      });

      let { authState } = getState();
      // globalな方のstateにおける自分の情報を変える。
      dispatch({
        type: UPDATE_USER_POSITION_IN_GLOBAL,
        payload: { authState, userPosition },
      });

      // authState = getState().authState;

      // socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
      //   console.log(socketIdFromServer);
      //   dispatch({
      //     type: UPDATE_USER_SOCKETID_IN_GLOBAL,
      //     payload: { authState, socketIdFromServer },
      //   });
      // });

      // const { authState } = getState(); // うん。一気にやる必要ないかな。。。多分。。。

      // dispatch({
      //   type: ADD_USER_GLOBALLY,
      //   payload: authState,
      // });
    });

    // console.log(authState); // currentPositionがnullになるときならない時色々だな。。。
  } catch (error) {
    console.log(error);
  }
};
