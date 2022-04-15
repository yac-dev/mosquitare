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
import Avatar from '@mui/material/Avatar';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Badge from '@mui/material/Badge';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';

// components
import Comments from '../Comments';
import Transcripts from '../Transcripts';
import FetchedDocEditor from '../FetchedDocEditor';

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

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 17,
  height: 17,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

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
  const [openTranscripts, setOpenTranscripts] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [openFetchedDocEditor, setOpenFetchedDocEditor] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <div
        className='displaying-video-wrapper'
        style={{ width: '80vw', margin: '0 auto', backgroundColor: 'rgb(0, 55, 110)' }}
      >
        <div className='users-information' style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div
            className='user-info-at-video'
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={<SmallAvatar src={props.conversation.users[0].nationalities[0].flagPics[0]} />}
            >
              <Avatar sx={{ cursor: 'pointer' }}>{props.conversation.users[0].name}</Avatar>
            </Badge>
          </div>
          <div
            className='user-info-at-video'
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={<SmallAvatar src={props.conversation.users[1].nationalities[0].flagPics[0]} />}
            >
              <Avatar sx={{ cursor: 'pointer' }}>{props.conversation.users[1].name}</Avatar>
            </Badge>
          </div>
        </div>
        <video
          className='displaying-video-1'
          playsInline
          controls
          disablePictureInPicture
          controlslist='nodownload noplaybackrate'
          // width='640px'
          // height='320px'
          style={{ marginBottom: '20px' }}
        >
          <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.conversation.videoFilename}`} />
        </video>
        {/* <div className='users-information'>
          <div
            className='user-info-at-video'
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={props.conversation.users[0].nationalities[0].flagPics[0]}
              style={{ width: '30px', height: '20px' }}
            />
            &nbsp; <Avatar>{props.conversation.users[0].name}</Avatar>&nbsp;
          </div>
          <div
            className='user-info-at-video'
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={props.conversation.users[1].nationalities[0].flagPics[0]}
              style={{ width: '30px', height: '20px' }}
            />
            &nbsp; <Avatar>{props.conversation.users[0].name}</Avatar>&nbsp;
          </div>
          <div
            className='user-info-at-video'
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}
          >
            <img
              src={props.conversation.users[1].nationalities[0].flagPics[0]}
              style={{ width: '30px', height: '20px' }}
            />
            &nbsp;<Avatar>{props.conversation.users[1].name}</Avatar>&nbsp;
            <img
              src={props.conversation.users[1].nationalities[0].flagPics[0]}
              style={{ width: '30px', height: '20px' }}
            />
          </div>
        </div> */}
        <div className='video-apps' style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div>
            <IconButton>
              <CalendarTodayIcon sx={{ color: 'white' }} />
            </IconButton>
            {props.conversation.createdAt}
          </div>
          {/* <div>
            <Tooltip title='Under construction 🚜🛠 Please wait a bit.' arrow>
              <IconButton>
                <VisibilityIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            1k
          </div> */}

          <div>
            <Tooltip title='Under construction 🚜🛠 Please wait a bit.' arrow>
              <IconButton>
                <ThumbUpAltIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            10
          </div>
          <div>
            <Tooltip title='Contributors ( Under construction 🚜🛠 Please wait a bit.)' arrow>
              <IconButton>
                <GroupsIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            10
          </div>
          <div>
            <IconButton onClick={() => setOpenTranscripts(true)}>
              <RecordVoiceOverIcon sx={{ color: 'white' }} />
            </IconButton>
            Transcript
          </div>
          <div>
            <IconButton onClick={() => setOpenComments(true)}>
              <CommentIcon sx={{ color: 'white' }} />
            </IconButton>
            Comments
          </div>
          <div>
            <IconButton onClick={() => setOpenFetchedDocEditor(true)}>
              <InsertDriveFileIcon sx={{ color: 'white' }} />
            </IconButton>
            Doc
          </div>

          <div>
            <Tooltip title='Under construction 🚜🛠 Please wait a bit.' arrow>
              <IconButton>
                <GTranslateIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            Translate
          </div>
          <div>
            <Tooltip title='Under construction 🚜🛠 Please wait a bit.' arrow>
              <IconButton>
                <ShareIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            Share
          </div>
        </div>

        <Transcripts openTranscripts={openTranscripts} setOpenTranscripts={setOpenTranscripts} />

        <Comments openComments={openComments} setOpenComments={setOpenComments} />

        <FetchedDocEditor
          openFetchedDocEditor={openFetchedDocEditor}
          setOpenFetchedDocEditor={setOpenFetchedDocEditor}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);
