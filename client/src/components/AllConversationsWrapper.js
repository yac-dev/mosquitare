import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// components
import Conversation from './UserPage/Conversation';

// ac
import { loadMeActionCreator } from '../actionCreators/authActionCreators';
import { getAllConversationsActionCreator } from '../actionCreators/conversationActionCreators';

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

  const renderConversations = () => {
    const conversationList = props.conversationsState.map((conversation) => {
      return (
        <>
          <Conversation conversation={conversation} />
        </>
      );
    });

    return <>{conversationList}</>;
  };

  return (
    <div>
      <div>All Videos</div>
      {renderConversations()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { conversationsState: Object.values(state.conversationsState) };
};

export default connect(mapStateToProps, { loadMeActionCreator, getAllConversationsActionCreator })(
  AllConversationsWrapper
);
