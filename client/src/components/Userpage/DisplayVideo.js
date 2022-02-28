import React, { useState, useContext, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import VideoContext from './contexts/VideoContext';

// mui
import Slider from '@mui/material/Slider';

// css
import '../../styles/userpage.css';

// propsでconversationが来る。
const DisplayVideo = (props) => {
  const [loaded, setLoaded] = useState(0);
  // const refForPlayingVideo1 = useRef();
  // const refForPlayingVideo2 = useRef();
  const videos = useContext(VideoContext);
  const [minVideoLength, setMinVideoLength] = useState(0);
  const [seekBarValue, setSeekBarValue] = useState(0);

  const calledUserVideoRef = useRef();
  const recievedUserVideoRef = useRef();

  useEffect(() => {
    if (loaded === 2) {
      calledUserVideoRef.current.play();
      recievedUserVideoRef.current.play();
      // 多分これで同時再生になってくれている。
    }
  }, [loaded]);

  // useEffect(() => {
  //   calledUserVideoRef.current.currentTime = seekBarValue;
  //   recievedUserVideoRef.current.currentTime = seekBarValue;
  // }, [seekBarValue]);

  const loadMeta = (event) => {
    setLoaded((previousState) => previousState + 1);
    // console.log(event.currentTarget.duration);
  };

  const handleChange = (event, newValue) => {
    setSeekBarValue(newValue);
    calledUserVideoRef.current.currentTime = seekBarValue;
    // recievedUserVideoRef.current.currentTime = seekBarValue;
  };

  const timeUpdate = () => {
    setSeekBarValue(calledUserVideoRef.current.currentTime);
  };

  return (
    // <>{renderVideoSrc()}</>
    <div className='displaying-videos-wrapper-wrapper'>
      <div className='displaying-videos-wrapper'>
        <div className='displaying-video-wrapper'>
          <video
            className='displaying-video-1'
            // ref={refForPlayingVideo1}
            ref={calledUserVideoRef}
            onLoadedMetadata={(event) => loadMeta(event)}
            // controls
            onTimeUpdate={() => timeUpdate()}
          >
            {/* <source src={`${videos.videoRef1.src}#t=0,${minVideoLength}`} /> */}
            <source
              src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.calledUserMedia.videoFileName}#t=0,${props.conversation.duration}`}
            />
          </video>
        </div>
        <div className='displaying-video-wrapper'>
          <video
            className='displaying-video-2'
            // ref={refForPlayingVideo2}
            ref={recievedUserVideoRef}
            onLoadedMetadata={(event) => loadMeta(event)}
            // controls
            onTimeUpdate={() => timeUpdate()}
          >
            {/* <source src={`${videos.videoRef1.src}#t=0,${minVideoLength}`} /> */}
            <source
              src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.recievedUserMedia.videoFileName}#t=0,${props.conversation.duration}`}
            />
          </video>
        </div>
      </div>
      {/* ここにcanvasを埋め込むか。 */}
      <canvas id='my-canvas' width='480' height='270'></canvas>
      <Slider
        value={seekBarValue}
        onChange={handleChange}
        valueLabelDisplay='auto'
        min={0}
        max={props.conversation.duration}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);
