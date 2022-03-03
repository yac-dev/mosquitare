import React, { useState, useContext, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import VideoContext from './contexts/VideoContext';

// mui
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Button from '@mui/material/Button';

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

  const videoRef = useRef();
  const videosRef = useRef([]);
  const videoRef1 = useRef();
  const videoRef2 = useRef();
  const seekbarRef = useRef();
  const [playOrPause, setPlayOrPause] = useState('pause');
  // const calledUserVideoRef = useRef();
  // const recievedUserVideoRef = useRef();

  useEffect(() => {
    if (loaded === 2) {
      videoRef1.current.play();
      videoRef2.current.play();
    }
  }, [loaded]);

  useEffect(() => {
    seekbarRef.current.addEventListener('change', () => {
      videoRef1.current.currentTime = (videoRef1.current.duration * seekbarRef.current.value) / seekbarRef.current.max;
      videoRef2.current.currentTime = (videoRef2.current.duration * seekbarRef.current.value) / seekbarRef.current.max;
    });
    // videoRef1.addEventListener('timeupdate', () => {
    //   seekbarRef.current.value = (videoRef1.current.currentTime / videoRef1.current.duration) * seekbarRef.current.max;
    // });

    // videoRef2.addEventListener('timeupdate', () => {
    //   seekbarRef.current.value = (videoRef2.current.currentTime / videoRef2.current.duration) * seekbarRef.current.max;
    // });
  }, []);

  const loadMeta = (event) => {
    setLoaded((previousState) => previousState + 1);
    // console.log(event.currentTarget.duration);
  };

  // const handleChange = (event, newValue) => {
  //   setSeekBarValue(newValue);
  //   videoRef1.current.currentTime = newValue;
  //   videoRef2.current.currentTime = newValue;
  //   // recievedUserVideoRef.current.currentTime = seekBarValue;
  // };

  const timeUpdateForVideo1 = () => {
    // setSeekBarValue(videoRef1.current.currentTime);
    seekbarRef.current.value = (videoRef1.current.currentTime / videoRef1.current.duration) * seekbarRef.current.max;
  };

  const timeUpdateForVideo2 = () => {
    seekbarRef.current.value = (videoRef2.current.currentTime / videoRef2.current.duration) * seekbarRef.current.max;
  };

  // 2つのvideoに関して、さらにcomponentを作った方がいいかもね。。。このfile内でいいからさ。
  // const renderVideos = (userMedias) => {
  //   const videos = userMedias.map((userMedia, index) => {
  //     return (
  //       <div className='displaying-video-wrapper'>
  //         <video
  //           className='displaying-video-1'
  //           // ref={videoRef}
  //           ref={(ref) => (videosRef.current = [...videosRef.current, ref])}
  //           // ref={refForPlayingVideo1}
  //           onLoadedMetadata={(event) => loadMeta(event)}
  //           controls
  //           onTimeUpdate={() => timeUpdate()}
  //         >
  //           {/* <source src={`${videos.videoRef1.src}#t=0,${minVideoLength}`} /> */}
  //           <source
  //             src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${userMedia.videoFileName}`}
  //           />
  //         </video>
  //       </div>
  //     );
  //   });

  //   return <div className='displaying-videos-wrapper'>{videos}</div>;
  // };

  const handleChange = (event) => {
    // this.setState({value: event.target.value});
    setSeekBarValue(event.target.value);
  };

  const playOrPauseHandler = () => {
    if (videoRef1.current.paused === true && videoRef2.current.paused === true) {
      videoRef1.current.play();
      videoRef2.current.play();
      setPlayOrPause('pause');
    } else {
      videoRef1.current.pause();
      videoRef2.current.pause();
      setPlayOrPause('play');
    }
  };

  return (
    // <>{renderVideoSrc()}</>
    <div className='displaying-videos-wrapper-wrapper'>
      <div className='displaying-videos-wrapper'>
        <div className='displaying-video-wrapper'>
          <video
            className='displaying-video-1'
            ref={videoRef1}
            onLoadedMetadata={(event) => loadMeta(event)}
            onTimeUpdate={() => timeUpdateForVideo1()}
          >
            <source
              src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.userMedias[0].videoFileName}`}
            />
          </video>
        </div>
        <div className='displaying-video-wrapper'>
          <video
            className='displaying-video-2'
            ref={videoRef2}
            onLoadedMetadata={(event) => loadMeta(event)}
            onTimeUpdate={() => timeUpdateForVideo2()}
          >
            <source
              src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.userMedias[1].videoFileName}`}
            />
          </video>
        </div>
      </div>

      {/* ここにcanvasを埋め込むか。 */}
      {/* <canvas id='my-canvas' width='480' height='270'></canvas> */}
      {/* <Slider
        value={seekBarValue}
        onChange={handleChange}
        valueLabelDisplay='auto'
        min={0}
        max={props.conversation.duration}
      /> */}
      <input
        className='seekbar'
        ref={seekbarRef}
        type='range'
        min='0'
        max='100'
        step='1'
        value={seekBarValue}
        onChange={handleChange}
        // width='300px'
      />
      {/* <button onClick={() => playOrPauseHandler()}>{playOrPause}</button> */}
      <Button variant='contained' size='large' onClick={() => playOrPauseHandler()}>
        {playOrPause === 'pause' ? <PauseIcon /> : <PlayArrowIcon />}
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);

const RenderVideo = (props) => {};
