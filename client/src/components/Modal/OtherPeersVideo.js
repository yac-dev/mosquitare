import React, { useEffect, useRef } from 'react';

const OtherPeersVideo = (props) => {
  const otherPeerVideoRef = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      otherPeerVideoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <>
      <video playsInline ref={otherPeerVideoRef} autoPlay />
    </>
  );
};

export default OtherPeersVideo;
