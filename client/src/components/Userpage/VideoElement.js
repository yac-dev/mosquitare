import React, { useRef, forwardRef } from 'react';
import { connect } from 'react-redux';

const VideoElement = ({ forwardedRef, ...restProps }) => {
  const videoLoaded = () => {
    restProps.setLoaded((prev) => prev + 1);
  };

  return (
    <>
      <video ref={forwardedRef} style={{ width: '600px', height: '600px' }} onLoadedMetadata={() => videoLoaded()}>
        <source
          type='video/webm'
          src={`data:video/webm;base64,${restProps.currentWatchingConversationState.calledUserVideo}`}
          playsInline
        ></source>
      </video>
    </>
  );
};

const mapStateToProps = (state) => {
  return { currentWatchingConversationState: state.currentWatchingConversationState };
};

export default connect(mapStateToProps)(VideoElement);
