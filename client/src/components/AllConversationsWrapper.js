import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// components
import Conversation from './UserPage/Conversation';

// mui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

// ac
import { loadMeActionCreator } from '../actionCreators/authActionCreators';
import { getAllConversationsActionCreator } from '../actionCreators/conversationActionCreators';
import { aggregateAllLikesActionCreator } from '../actionCreators/likesActionCreator';
import { aggregateAllCommentsActionCreator } from '../actionCreators/commentsActionCreator';

// css
import '../styles/allConversations.css';

const AllConversationsWrapper = (props) => {
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken);
    }
  }, []); // このuserのviodeを全部s3から持ってくる。

  useEffect(() => {
    props.getAllConversationsActionCreator();
  }, []);

  useEffect(() => {
    props.aggregateAllLikesActionCreator();
    props.aggregateAllCommentsActionCreator();
  }, []);

  const renderConversations = () => {
    const conversationList = props.conversationsState.map((conversation) => {
      if (!conversation.videoFilename || conversation.users.length !== 2 || !conversation.isPublic) {
        return null;
      } else {
        return (
          <>
            <Conversation
              conversation={conversation}
              // likes={props.allLikesStatState[conversation._id]}
              // comments={props.allCommentsStatState[conversation._id]}
            />
          </>
        );
      }
    });

    return <>{conversationList}</>;
  };

  const renderLoading = () => {
    if (!props.conversationsState.length) {
      return (
        <>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Stack sx={{ width: '70%' }} spacing={2}>
                <LinearProgress color='secondary' />
                <LinearProgress color='success' />
                <LinearProgress color='inherit' />
              </Stack>
            </div>
            Loading videos...
          </div>
        </>
      );
    }
  };

  return (
    <div className='all-conversations-wrapper-wrapper'>
      <h2 style={{ margin: '20px' }}>Public Library</h2>
      {renderLoading()}
      <div className='all-conversations-wrapper'>{renderConversations()}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    conversationsState: Object.values(state.conversationsState),
    allLikesStatState: state.allLikesStatState,
    allCommentsStatState: state.allCommentsStatState,
  };
};

export default connect(mapStateToProps, {
  loadMeActionCreator,
  getAllConversationsActionCreator,
  aggregateAllLikesActionCreator,
  aggregateAllCommentsActionCreator,
})(AllConversationsWrapper);
