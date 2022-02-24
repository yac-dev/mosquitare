import React, { useState, useContext, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import VideoContext from './contexts/VideoContext';

// mui
import Slider from '@mui/material/Slider';

// css
import '../../styles/userpage.css';

const DisplayVideo = () => {
  const [loaded, setLoaded] = useState(0);
  const refForPlayingVideo1 = useRef();
  const refForPlayingVideo2 = useRef();
  const videos = useContext(VideoContext);
  const [minVideoLength, setMinVideoLength] = useState(0);
  const [seekBarValue, setSeekBarValue] = useState(0);

  // useEffect(() => {
  //   if (loaded === 2) {
  //     // durationを短い方に合わせる。
  //     const min = Math.min(
  //       Math.floor(refForPlayingVideo1.current.duration),
  //       Math.floor(refForPlayingVideo2.current.duration)
  //     );
  //     console.log(refForPlayingVideo1.current.duration);
  //     console.log(min);
  //     setMinVideoLength(min);
  //     refForPlayingVideo1.current.play();
  //     refForPlayingVideo2.current.play();
  //     // 多分これで同時再生になってくれている。
  //   }
  // }, [loaded]);

  const loadMeta = (event) => {
    // setLoaded((previousState) => previousState + 1);
    console.log(event.currentTarget.duration);
  };

  const handleChange = (event, newValue) => {
    setSeekBarValue(newValue);
    refForPlayingVideo1.current.currentTime = seekBarValue;
    refForPlayingVideo2.current.currentTime = seekBarValue;
  };

  const timeUpdate = () => {
    setSeekBarValue(refForPlayingVideo1.current.currentTime);
  };

  // 二つのvideoのlengthをまずなんかの方法で取得して、短い方をminとかで算出する。それを使って、srcの部分に#t=0,短い方 って感じでやるか。
  return (
    // <>{renderVideoSrc()}</>
    <div className='displaying-videos-wrapper-wrapper'>
      <div className='displaying-videos-wrapper'>
        <div className='displaying-video-wrapper'>
          <video
            className='displaying-video-1'
            ref={refForPlayingVideo1}
            onLoadedMetadata={(event) => loadMeta(event)}
            controls
            // onTimeUpdate={() => timeUpdate()}
          >
            {/* <source src={`${videos.videoRef1.src}#t=0,${minVideoLength}`} /> */}
            <source src={videos.videoRef1.src} />
          </video>
        </div>
        <div className='displaying-video-wrapper'>
          <video
            className='displaying-video-2'
            ref={refForPlayingVideo2}
            onLoadedMetadata={(event) => loadMeta(event)}
            controls
            // onTimeUpdate={() => timeUpdate()}
          >
            {/* <source src={`${videos.videoRef1.src}#t=0,${minVideoLength}`} /> */}
            <source src={videos.videoRef1.src} />
          </video>
        </div>
      </div>
      {/* <Slider value={seekBarValue} onChange={handleChange} valueLabelDisplay='auto' min={0} max={minVideoLength} /> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);
