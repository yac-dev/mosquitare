import { mosquitareAPI } from '../apis/mosquitare';

export const createIntegratedUserMediaActionCreator = () => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.post('/integratedusermedias');
    const integratedUserMediaId = result.data._id;
    dispatch({
      type: 'CREATE_INTEGRATED_USER_MEDIA',
      payload: integratedUserMediaId,
    });
  } catch (error) {
    console.log(error);
  }
};
