import React, { useEffect } from 'react';
import { connect } from 'react-redux';
// import ConversationVideo from './ConversationVideo';
import myVideo from './ef392537-cb27-48a3-8905-43467c3eef6b.mp4'; // このやり方だといける。

// components
import ConversationVideos from './ConversationVideos';

// ac
import { loadMeActionCreator } from '../../actionCreators/authActionCreators';

import '../../styles/userpage.css';

const UserPageWrapper = (props) => {
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken);
    }
  }, []); // このuserのviodeを全部s3から持ってくる。
  return (
    <div>
      <div>Container</div>
      <ConversationVideos />
      {/* <video width='320' height='240' src={myVideo} codecs='avc1.4d002a, mp4a.40.2' controls type='video/mp4' /> */}
      {/* <video src='ef392537-cb27-48a3-8905-43467c3eef6b.mp4'></video> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { loadMeActionCreator })(UserPageWrapper);
