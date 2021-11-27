import React from 'react';

const Video = (props) => {
  return (
    <div>
      <video
        src='uploadedFiles/3cd2559b-204b-46a0-a4fc-35a889c9e5af.mp4'
        playsInline
        muted
        autoPlay
        style={{ width: '600px', borderRadius: '20px' }}
      ></video>
      <video src='uploadedFiles/ef392537-cb27-48a3-8905-43467c3eef6b.mp4'></video>
    </div>
  );
};

export default Video;
