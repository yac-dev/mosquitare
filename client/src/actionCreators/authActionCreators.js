import { mosquitareAPI } from '../apis/mosquitare';
import history from '../history';
import { SIGNUP, LOAD_POSITION } from './type';

export const signupActionCreator = (formData) => async (dispatch) => {
  try {
    const result = await mosquitareAPI.post('/users/signup', formData);
    localStorage.setItem('mosquitare token', result.data.jwtToken);
    console.log(result);
    console.log(result.data.jwtToken);

    dispatch({
      type: SIGNUP,
      payload: result.data, // → user prop
    });

    history.push('/worldmap');
  } catch (error) {
    console.log(error);
  }
};

export const loadPositionActionCreator = () => (dispatch) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
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

      // lng: Number(position.coords.longitude.toFixed(1)),
      // lat: Number(position.coords.latitude.toFixed(1)),
    },
    (rejected) => {
      console.log(rejected);
    }
  );
};
