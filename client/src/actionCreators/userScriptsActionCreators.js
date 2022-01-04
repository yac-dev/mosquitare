import { mosquitareAPI } from '../apis/mosquitare';

export const createUserScriptActionCreator = () => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.post(`/userscripts/${userId}`);
  } catch (error) {
    console.log(error);
  }
};
