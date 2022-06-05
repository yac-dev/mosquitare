import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
import Snackbar from '../Snackbar';
//ac
import { createLikeActionCreator } from '../../actionCreators/likesActionCreator';
import { getConversationLikesActionCreator } from '../../actionCreators/likesActionCreator';
import { setToPrivateActionCreator } from '../../actionCreators/conversationPrivacySettingsActionCreator';

// css
import '../../styles/userpage.css';
import { alertActionCreator } from '../../actionCreators/alertsActionCreator';

import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 599 });
  return isMobile ? children : null;
};

const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

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
  const { user0Id, user1Id } = useParams();
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

  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false); // これなんだろね。なんでこのmuiらしきもんがある？？

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (loaded === 2) {
      videoRef1.current.play();
      videoRef2.current.play();
    }
  }, [loaded]);

  useEffect(() => {
    props.getConversationLikesActionCreator(props.conversation._id);
  }, []);

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

  const timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  };

  const setToPrivate = () => {
    if (props.conversation.isPublic) {
      if (
        JSON.stringify(user0Id) === JSON.stringify(props.authState.currentUser._id) ||
        JSON.stringify(user1Id) === JSON.stringify(props.authState.currentUser._id)
      ) {
        props.setToPrivateActionCreator(props.conversation._id);
        setShow(false);
      } else {
        props.alertActionCreator("You don't have a permission to change this conversation setting.", 'error');
      }
    } else {
      console.log('No way');
    }
  };

  const setToPublic = () => {
    if (!props.conversation.isPublic) {
    } else {
      console.log('no way');
    }
  };

  const onPublicOrPrivateClick = () => {
    if (
      JSON.stringify(user0Id) === JSON.stringify(props.authState.currentUser._id) ||
      JSON.stringify(user1Id) === JSON.stringify(props.authState.currentUser._id)
    ) {
      setShow(true);
    } else {
      props.alertActionCreator("You don't have a permission to change this conversation setting.", 'error');
    }
  };

  const renderPublicOrPrivate = () => {
    if (props.conversation.isPublic) {
      return (
        <div>
          <Tooltip title='Anybody in this app can watch this conversation.' arrow>
            <IconButton onClick={() => setShow(true)}>
              <VisibilityIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </div>
      );
    } else {
      return (
        <div>
          <Tooltip title='Only you and your partner can watch this conversation.' arrow>
            <IconButton>
              <VisibilityOffIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </div>
      );
    }
  };

  const onLikeClick = (conversationId) => {
    if (!props.authState.currentUser) {
      props.alertActionCreator('Please signup or login to use!', 'info', 7000);
    } else {
      if (props.likesState[props.authState.currentUser._id]) {
        props.alertActionCreator('You have already liked this conversation.', 'info');
      } else {
        props.createLikeActionCreator(conversationId);
      }
    }
  };

  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <Snackbar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
  };

  const renderGenre = (genre) => {
    return (
      <>
        {/* <LanguageIcon /> */}
        Exchanged&nbsp;{genre[0].name} &amp; {genre[1].name}
      </>
    );
  };

  return (
    // <>{renderVideoSrc()}</>
    <>
      <Default>
        <div
          className='displaying-video-wrapper'
          style={{ width: '100vw', margin: '0 auto', backgroundColor: 'rgb(0, 55, 110)' }}
        >
          <div style={{ display: 'flex', padding: '20px' }}>
            <div className='users-information' style={{ display: 'flex', gap: '20px', flex: 7 }}>
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
            {/* <div>{props.conversation.genre}</div> */}
            {/* {renderGenre(props.conversation.genre)} */}
            <div
              className='status-info'
              style={{ display: 'flex', gap: '20px', flex: 3, justifyContent: 'center', alignItems: 'center' }}
            >
              <div>
                {/* <IconButton>
                <CalendarTodayIcon sx={{ color: 'white' }} />
              </IconButton> */}
                {timeSince(new Date(props.conversation.createdAt))} ago
              </div>
              {renderPublicOrPrivate()}
            </div>
          </div>
          <video
            className='displaying-video-1'
            playsInline
            controls
            disablePictureInPicture
            controlslist='nodownload noplaybackrate'
            // width='640px'
            height='500px'
            // style={{ marginBottom: '20px' }}
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
          <div
            className='video-apps'
            style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '10px' }}
          >
            <div>
              <Tooltip title='Like' arrow>
                <IconButton onClick={() => onLikeClick(props.conversation._id)}>
                  <ThumbUpAltIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              {Object.values(props.likesState).length}&nbsp;likes
            </div>
            <div>
              <Tooltip title='Write a comment' arrow>
                <IconButton onClick={() => setOpenComments(true)}>
                  <CommentIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              {props.commentsState.length}&nbsp;Comments
            </div>
            <div>
              <Tooltip title='Conversation transcript' arrow>
                <IconButton onClick={() => setOpenTranscripts(true)}>
                  <RecordVoiceOverIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              Transcript
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
                  <GroupsIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              Contributors
            </div>
            {/* <div>
            <Tooltip title='Google Translate (Under construction 🚜🛠 Please wait a bit.)' arrow>
              <IconButton>
                <GTranslateIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            Translate
          </div> */}

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
          {renderAlerts()}
          <Modal show={show} onHide={() => setShow(false)} backdrop='static' keyboard={false}>
            <Modal.Body>
              <div style={{ color: 'black' }}>
                <h3 style={{ textAlign: 'center' }}>⚠️ Are you sure you want to set this conversation to private?</h3>
                <br />
                You can't get any comments, feedbacks or transcription updates if you hide this conversation.
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShow(false)}>No</Button>
              <Button onClick={() => setToPrivate()}>Yes</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Default>
      <Mobile>
        <div>
          <div className='users-information' style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
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
            // className='displaying-video-1'
            playsInline
            controls
            disablePictureInPicture
            controlslist='nodownload noplaybackrate'
            width='100%'
            // width='640px'
            // height='320px'
            // style={{ marginBottom: '20px' }}
          >
            <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.conversation.videoFilename}`} />
          </video>
          <div
            className='video-apps'
            style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px' }}
          >
            <div>
              <Tooltip title='Like' arrow>
                <IconButton onClick={() => onLikeClick(props.conversation._id)}>
                  <ThumbUpAltIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              {Object.values(props.likesState).length}&nbsp;
            </div>
            <div>
              <Tooltip title='Write a comment' arrow>
                <IconButton onClick={() => setOpenComments(true)}>
                  <CommentIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              {props.commentsState.length}
            </div>
            <div>
              <Tooltip title='Conversation transcript' arrow>
                <IconButton onClick={() => setOpenTranscripts(true)}>
                  <RecordVoiceOverIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <IconButton onClick={() => setOpenFetchedDocEditor(true)}>
                <InsertDriveFileIcon sx={{ color: 'white' }} />
              </IconButton>
            </div>
            <div>
              <Tooltip title='Under construction 🚜🛠 Please wait a bit.' arrow>
                <IconButton>
                  <GroupsIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </div>
            {/* <div>
            <Tooltip title='Google Translate (Under construction 🚜🛠 Please wait a bit.)' arrow>
              <IconButton>
                <GTranslateIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
            Translate
          </div> */}

            <div>
              <Tooltip title='Under construction 🚜🛠 Please wait a bit.' arrow>
                <IconButton>
                  <ShareIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Transcripts openTranscripts={openTranscripts} setOpenTranscripts={setOpenTranscripts} />

          <Comments openComments={openComments} setOpenComments={setOpenComments} />

          <FetchedDocEditor
            openFetchedDocEditor={openFetchedDocEditor}
            setOpenFetchedDocEditor={setOpenFetchedDocEditor}
          />
        </div>
      </Mobile>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authState: state.authState,
    commentsState: Object.values(state.commentsState),
    likesState: state.likesState,
    alertsState: state.alertsState,
  };
};

export default connect(mapStateToProps, {
  createLikeActionCreator,
  getConversationLikesActionCreator,
  alertActionCreator,
  setToPrivateActionCreator,
})(DisplayVideo);
