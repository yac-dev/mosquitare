import React from 'react';
import Video from './Video';
import myVideo from './ef392537-cb27-48a3-8905-43467c3eef6b.mp4'; // このやり方だといける。
import IntegratedVideos from './IntegratedVideos';

const UserPageContainer = (props) => {
  return (
    <div>
      <div>This is a container</div>
      <IntegratedVideos />
      <video width='320' height='240' src={myVideo} codecs='avc1.4d002a, mp4a.40.2' controls type='video/mp4' />
      {/* <video src='ef392537-cb27-48a3-8905-43467c3eef6b.mp4'></video> */}
    </div>
  );
};

export default UserPageContainer;
