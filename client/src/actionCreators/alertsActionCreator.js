import { v4 as uuidv4 } from 'uuid';

export const alertActionCreator = (message, alertType) => (dispatch) => {
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
  }, 5000);
};

export const removeAlertActionCreator = (id) => {
  return {
    type: 'REMOVE_ALERT',
    payload: id,
  };
};
