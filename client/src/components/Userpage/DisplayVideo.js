import React, { useState, useContext, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import VideoContext from './contexts/VideoContext';

const DisplayVideo = () => {
  const [loaded, setLoaded] = useState(0);
  const refForPlayingVideo1 = useRef();
  const refForPlayingVideo2 = useRef();
  const videos = useContext(VideoContext);

  useEffect(() => {
    if (loaded === 2) {
      refForPlayingVideo1.current.play();
      refForPlayingVideo2.current.play();
      // 多分これで同時再生になってくれている。
    }
  }, [loaded]);

  return (
    // <>{renderVideoSrc()}</>
    <div className='videos-wrapper'>
      <video
        className='displaying-video-1'
        ref={refForPlayingVideo1}
        onLoadedMetadata={() => setLoaded((previousState) => previousState + 1)}
        controls
      >
        <source src={videos.videoRef1.src} />
      </video>
      <video
        className='displaying-video-2'
        ref={refForPlayingVideo2}
        onLoadedMetadata={() => setLoaded((previousState) => previousState + 1)}
        controls
      >
        <source src={videos.videoRef2.src} />
      </video>
    </div>
  ); // これ、一つのvideo tagで囲うかvideo tag二使いてやるか、違いあるかね。
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);
