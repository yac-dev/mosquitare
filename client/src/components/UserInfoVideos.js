import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getUserConversationsActionCreator } from '../actionCreators/conversationActionCreators';
import { selectVideoActionCreator } from '../actionCreators/conversationActionCreators';

import UserInfoVideo from './UserInfoVideo';

const UserInfoVideos = (props) => {
  useEffect(() => {
    props.getUserConversationsActionCreator(props.user._id);
  }, []);

  const onVideoClick = (conversation) => {
    // ここで、reduxのacをdispatchする。conversation
    props.selectVideoActionCreator(conversation);
    props.setShowVideoModal(true);
  };

  // selected videoをreduxに入れて、その
  const renderUserVideos = () => {
    if (props.conversationsState.length) {
      const userVideos = props.conversationsState.map((conversation, index) => {
        return (
          <>
            <div onClick={() => onVideoClick(conversation)} key={index} style={{ cursor: 'pointer' }}>
              <video width='200'>
                <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${conversation.videoFilename}`} />
              </video>
            </div>
          </>
        );
      });

      return <>{userVideos}</>;
    } else {
      return <p>No data</p>;
    }
  };

  return (
    <div class='user-videos-wrapper' style={{ padding: '10px' }}>
      <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)', marginBottom: '20px' }}>Public videos</h6>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', overflow: 'auto' }}>{renderUserVideos()}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { conversationsState: Object.values(state.conversationsState) };
};

export default connect(mapStateToProps, { getUserConversationsActionCreator, selectVideoActionCreator })(
  UserInfoVideos
);
