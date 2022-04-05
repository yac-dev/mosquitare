import { v4 as uuidv4 } from 'uuid';

export const alertActionCreator =
  (message, alertType, duration = 5000) =>
  (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: 'SET_ALERT',
      payload: { id, message, alertType },
    });

    setTimeout(() => {
      dispatch({
        type: 'REMOVE_ALERT',
        payload: id,
      });
    }, duration);
  };

export const removeAlertActionCreator = (id) => {
  return {
    type: 'REMOVE_ALERT',
    payload: id,
  };
};
