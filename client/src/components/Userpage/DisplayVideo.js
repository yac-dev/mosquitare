import React, { useState, useContext, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import VideoContext from './contexts/VideoContext';

// mui
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CommentIcon from '@mui/icons-material/Comment';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// components
import Comments from '../Comments';

// css
import '../../styles/userpage.css';

const TranscriptIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(110, 209, 33)',
  '&:hover': {
    backgroundColor: 'rgba(145, 237, 74)',
  },
}));

const CommentIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(230, 222, 0)',
  '&:hover': {
    backgroundColor: 'rgba(255, 247, 25)',
  },
}));

const GTranslateIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(2, 204, 227)',
  '&:hover': {
    backgroundColor: 'rgba(23, 231, 255)',
  },
}));

const NoteIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(201, 0, 0)',
  '&:hover': {
    backgroundColor: 'rgba(245, 22, 22)',
  },
}));

const theme = createTheme({
  breakpoints: {
    values: {
      xxs: 0, // small phone
      xs: 320, // phone
      sm: 768, // tablets
      md: 992, // small laptop
      lg: 1200, // desktop
      // xl: 1536, // large screens
    },
  },
});

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
  const [currentVideoTime, setCurrentVideoTime] = useState();
  // const calledUserVideoRef = useRef();
  // const recievedUserVideoRef = useRef();
  const [openComments, setOpenComments] = useState(false);

  useEffect(() => {
    if (loaded === 2) {
      videoRef1.current.play();
      videoRef2.current.play();
    }
  }, [loaded]);

  // useEffect(() => {
  //   seekbarRef.current.addEventListener('change', () => {
  //     videoRef1.current.currentTime = (videoRef1.current.duration * seekbarRef.current.value) / seekbarRef.current.max;
  //     videoRef2.current.currentTime = (videoRef2.current.duration * seekbarRef.current.value) / seekbarRef.current.max;
  //   });
  // }, []);

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

  // const handleChange = (event) => {
  //   // this.setState({value: event.target.value});
  //   setSeekBarValue(event.target.value);
  // };

  // const playOrPauseHandler = () => {
  //   if (videoRef1.current.paused === true && videoRef2.current.paused === true) {
  //     videoRef1.current.play();
  //     videoRef2.current.play();
  //     setPlayOrPause('pause');
  //   } else {
  //     videoRef1.current.pause();
  //     videoRef2.current.pause();
  //     setPlayOrPause('play');
  //   }
  // };

  return (
    // <>{renderVideoSrc()}</>
    <>
      <div className='displaying-video-wrapper'>
        <video
          className='displaying-video-1'
          // onLoadedMetadata={(event) => loadMeta(event)}
          // onTimeUpdate={() => timeUpdateForVideo1()}
          playsInline
          controls
          // width='640px'
          // height='320px'
        >
          <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.conversation.videoFilename}`} />
        </video>
        {/* <div className='video-seekbar'>
          <input
            className='seekbar'
            ref={seekbarRef}
            type='range'
            min='0'
            max='100'
            step='1'
            value={seekBarValue}
            // onChange={handleChange}
            // width='300px'
          />
        </div> */}
      </div>
      <div className='button-stack-wrapper'>
        <Stack direction='row' spacing={2}>
          <ThemeProvider theme={theme}>
            <Tooltip title='Transcript' arrow>
              <TranscriptIconButton>
                <RecordVoiceOverIcon
                  sx={{
                    width: { md: '30px', lg: '40px' },
                    height: { md: '30px', lg: '40px' },
                  }}
                />
              </TranscriptIconButton>
            </Tooltip>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Tooltip title='Comments' arrow>
              <CommentIconButton onClick={() => setOpenComments(true)}>
                <CommentIcon
                  sx={{
                    width: { md: '30px', lg: '40px' },
                    height: { md: '30px', lg: '40px' },
                  }}
                />
              </CommentIconButton>
            </Tooltip>
          </ThemeProvider>
          <Comments openComments={openComments} setOpenComments={setOpenComments} />
          <ThemeProvider theme={theme}>
            <Tooltip title='Shared note' arrow>
              <NoteIconButton>
                <InsertDriveFileIcon
                  sx={{
                    width: { md: '30px', lg: '40px' },
                    height: { md: '30px', lg: '40px' },
                  }}
                />
              </NoteIconButton>
            </Tooltip>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Tooltip title='Translate (Sorry, not available now 🙅🏻)' arrow>
              <GTranslateIconButton>
                <GTranslateIcon
                  sx={{
                    width: { md: '30px', lg: '40px' },
                    height: { md: '30px', lg: '40px' },
                  }}
                />
              </GTranslateIconButton>
            </Tooltip>
          </ThemeProvider>
        </Stack>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);

const RenderVideo = (props) => {};
