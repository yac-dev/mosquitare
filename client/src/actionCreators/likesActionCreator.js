import { mosquitareAPI } from '../apis/mosquitare';

export const createLikeActionCreator = (conversationId) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.post(`/likes`, { userId, conversationId });
    const { like } = result.data;
    dispatch({
      type: 'CREATE_LIKE',
      payload: like,
    });
  } catch (error) {
    console.log(error);
  }
};

export const aggregateAllLikesActionCreator = () => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get('/likes/aggregateall');
    const { allLikesStat } = result.data; // {stats: [{id: 2}, {id: 5}]}って感じになるだろう。
    // const { stats } = allLikesStat;
    console.log(allLikesStat);
    dispatch({
      type: 'GET_ALL_LIKES_STAT',
      payload: allLikesStat,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getConversationLikesActionCreator = (conversationId) => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get(`/likes/${conversationId}`);
    const { likes } = result.data;
    dispatch({
      type: 'GET_CONVERSATION_LIKES',
      payload: likes,
    });
  } catch (error) {
    console.log(error);
  }
};
