import React from 'react';
import Video from './Video';
import myVideo from './ef392537-cb27-48a3-8905-43467c3eef6b.mp4'; // このやり方だといける。

const Container = (props) => {
  return (
    <div>
      <div>This is a container</div>
      {/* <Video /> */}

      {/* <video
        src='3cd2559b-204b-46a0-a4fc-35a889c9e5af.mp4'
        playsInline
        muted
        autoPlay
        style={{ width: '600px', borderRadius: '20px' }}
      /> */}
      <video width='320' height='240' src={myVideo} codecs='avc1.4d002a, mp4a.40.2' controls type='video/mp4' />
      {/* <video src='ef392537-cb27-48a3-8905-43467c3eef6b.mp4'></video> */}
    </div>
  );
};

export default Container;
