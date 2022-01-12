import React, { useRef, forwardRef } from 'react';

const VideoElement = forwardRef((props, ref) => {
  const videoLoaded = () => {
    props.setLoaded((prev) => prev++);
  };
  return (
    <>
      <video ref={ref} style={{ width: '600px', height: '600px' }} onLoadedMetadata={() => videoLoaded()}>
        <source
          type='video/webm'
          src={`data:video/webm;base64,${props.currentWatchingConversationState.calledUserVideo}`}
          playsInline
        ></source>
      </video>
    </>
  );
});

export default VideoElement;
