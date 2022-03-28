import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import ConversationVideo from './ConversationVideo';
// import myVideo from './ef392537-cb27-48a3-8905-43467c3eef6b.mp4'; // このやり方だといける。

// mui
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// components
import MyConversations from './MyConversations';

// ac
import { loadMeActionCreator } from '../../actionCreators/authActionCreators';
import { getMyConversationsActionCreator } from '../../actionCreators/conversationActionCreators';

// css
import '../../styles/userpage.css';

const UserPageWrapper = (props) => {
  // const promisify = (jwtToken) => {
  //   return new Promise((resolve, reject) => {
  //     props.loadMeActionCreator(jwtToken);
  //   });
  // };
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken).then((user) => {
        props.getMyConversationsActionCreator(user.conversations);
      });
      // props.getUserConversations(user.conversations._id);
      // .then((user) => {
      //   props.getConversation(user.id)
      // });
    }
  }, []); // このuserのviodeを全部s3から持ってくる。

  const renderMyConversations = () => {
    if (props.conversationsState) {
      return (
        <>
          <MyConversations myConversations={props.conversationsState} />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className='userpage-wrapper-wrapper'>
      <h2 style={{ margin: '20px' }}>
        <VideoLibraryIcon size='large' /> &nbsp; Library
      </h2>
      <div className='userpage-wrapper'>
        {renderMyConversations()}
        {/* <video width='320' height='240' src={myVideo} codecs='avc1.4d002a, mp4a.40.2' controls type='video/mp4' /> */}
        {/* <video src='ef392537-cb27-48a3-8905-43467c3eef6b.mp4'></video> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { conversationsState: Object.values(state.conversationsState) };
};

export default connect(mapStateToProps, { loadMeActionCreator, getMyConversationsActionCreator })(UserPageWrapper);
