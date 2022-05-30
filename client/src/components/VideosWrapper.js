import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
// import { Button } from 'semantic-ui-react';

import '../styles/1on1.css';

// react bootstrap
import { Modal } from 'react-bootstrap';
// mui
import TranslateIcon from '@mui/icons-material/Translate';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// import HandshakeIcon from '@mui/icons-material/Handshake';
import SendIcon from '@mui/icons-material/Send';
import NoteIcon from '@mui/icons-material/Note';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CircularProgress from '@mui/material/CircularProgress';
import PortraitIcon from '@mui/icons-material/Portrait';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

// call recieve側
import { answerCallActionCreator2 } from '../actionCreators/mediaActionCreator';
import { getConversationIdFromCalledUserActionCreator } from '../actionCreators/conversationActionCreators';
import { updateConversationUsersActionCreator } from '../actionCreators/conversationActionCreators';

// call した側
import { completeConnectionWithMyPartnerActionCreator1 } from '../actionCreators/mediaActionCreator';
import { createConversationActionCreator } from '../actionCreators/conversationActionCreators';
import { sendConversationIdActionCreator } from '../actionCreators/conversationActionCreators';

// 共通
import { updateUserConversationStateActionCreator } from '../actionCreators/authActionCreators';
import { updateUserConversationsActionCreator } from '../actionCreators/authActionCreators';

// call始まり
import { alertActionCreator } from '../actionCreators/alertsActionCreator';

// call 終わり
import { hangUpCallActionCreator } from '../actionCreators/mediaActionCreator';
import { disconnectCallActionCreator } from '../actionCreators/mediaActionCreator';
import { updateUserConversationToFalseActionCreator } from '../actionCreators/authActionCreators';

// components
import SnackBar from './Snackbar';

// styles for mui
const LogoutIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(255, 0, 0)',
  '&:hover': {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
}));

const SwitchLangIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(110, 209, 33)',
  '&:hover': {
    backgroundColor: 'rgba(145, 237, 74)',
  },
}));

const MicIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(42, 198, 209)',
  '&:hover': {
    backgroundColor: 'rgba(17, 235, 250)',
  },
}));

const ColorButton = styled(Button)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(35, 63, 105)',
  '&:hover': {
    backgroundColor: 'rgb(39, 78, 138)',
  },
}));

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(237, 85, 85)',
  '&:hover': {
    backgroundColor: 'rgb(245, 27, 27)',
  },
}));

const CenterIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(24, 237, 84)',
  '&:hover': {
    backgroundColor: 'rgb(56, 255, 112)',
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

const actions = [
  // { icon: <SendIcon />, name: 'Chat', operation: 'Chat', color: 'rgb(52, 173, 0)', hoverColor: 'rgb(66, 219, 0)' },
  // {
  //   icon: <RecordVoiceOverIcon />,
  //   name: 'Transcript',
  //   operation: 'Transcript',
  //   color: ' rgb(219, 219, 18)',
  //   hoverColor: 'rgb(252, 252, 3)',
  // },
  {
    // color orange
    // 255,140,0 hover 255, 170, 66
    // color light blue
    // 0, 221, 255 hover 77, 231, 255
    icon: <NoteIcon />,
    name: 'Shared Doc',
    operation: 'SharedDoc',
    color: 'rgb(255,140,0)',
    hoverColor: 'rgb(255, 170, 66)',
  },
  {
    // color purple
    icon: <SupervisedUserCircleIcon />,
    name: 'Partner Information',
    operation: 'PartnerUserInfo',
    color: 'rgb(179, 0, 255)',
    hoverColor: 'rgb(205, 100, 250)',
  },
  {
    // color yellow
    icon: <PortraitIcon />,
    name: 'My Screen',
    operation: 'YourScreen',
    color: 'rgb(255, 217, 0)',
    hoverColor: 'rgb(255, 228, 77)',
  },
  // {
  //   icon: <GTranslateIcon />,
  //   name: 'Google Translate (Sorry, not available now.)',
  //   operation: 'GTranslate',
  //   color: 'rgb(38, 189, 235)',
  //   hoverColor: 'rgb(0, 195, 255)',
  // },
  // {
  //   icon: <ScreenShareIcon />,
  //   name: 'Screen Share (Sorry, not available now.)',
  //   operation: 'ScreenShare',
  //   color: 'rgb(189, 8, 62)',
  //   hoverColor: 'rgb(235, 38, 96)',
  // },

  // {
  //   icon: <TextSnippetIcon />,
  //   name: 'Cheat Sheet (Sorry, not available now.)',
  //   operation: 'CheatSheet',
  //   color: 'rgb(225, 234, 237)',
  //   hoverColor: 'rgb(255, 255, 255)',
  // },
  // {
  //   icon: <BorderColorIcon />,
  //   name: 'Whiteboard Share (Sorry, not available now.)',
  //   operation: 'WhiteboardShare',
  //   color: 'rgb(196, 99, 39)',
  //   hoverColor: 'rgb(237, 112, 33)',
  // },
];

// const useStyles = makeStyles({
//   tooltip: {
//     fontSize: 30,
//   },
// });

const VideosWrapper = (props) => {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState('down');
  const [openMyScreen, setOpenMyScreen] = useState(false);
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  // const classes = useStyles();
  const [show, setShow] = useState(false);

  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);

  const myVideoRef = useRef();
  const oppositeVideoRef = useRef();
  const connectionRef = useRef();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onWidgetIconClick = (event, operation) => {
    event.preventDefault();
    // setOpen(false);
    // if (operation === 'Chat') {
    //   props.setOpenChatComponent(true);
    // }
    // if (operation === 'Transcript') {
    //   props.setOpenTranscriptComponent(true);
    // }
    if (operation === 'SharedDoc') {
      props.setOpenDoc(true);
      props.socket.emit('OUR_DOC_IS_OPENED', { to: props.mediaState.callingWith.socketId });
    }
    if (operation === 'PartnerUserInfo') {
      props.setOpenPartnerUserInfo(true);
    }
    if (operation === 'YourScreen') {
      setOpenMyScreen(true);
    }
    setOpen(!open);
  };

  useEffect(() => {
    if (props.show1on1) {
      if (props.mediaState.amIRecieving) {
        props.answerCallActionCreator2(props.socket, myVideoRef, oppositeVideoRef, connectionRef).then(() => {
          return props.updateUserConversationStateActionCreator();
        });
      } else if (props.mediaState.amICalling) {
        props
          .completeConnectionWithMyPartnerActionCreator1(props.socket, myVideoRef, oppositeVideoRef, connectionRef)
          .then(() => {
            return props.updateUserConversationStateActionCreator();
          })
          .then(() => {
            return props.createConversationActionCreator();
          })
          .then(() => {
            return props.sendConversationIdActionCreator(props.socket);
          })
          .then(() => {
            return props.updateUserConversationsActionCreator();
          });
      }
    }
  }, [props.show1on1]);

  // callした側でもこれ実行されているね。。。
  // call受けた側で実行される。
  useEffect(() => {
    props
      .getConversationIdFromCalledUserActionCreator(props.socket)
      .then(() => {
        return props.updateUserConversationsActionCreator();
      })
      .then(() => {
        return props.updateConversationUsersActionCreator();
      });
  }, []);

  useEffect(() => {
    return () => {
      props.updateUserConversationToFalseActionCreator();
    };
  }, []);

  useEffect(() => {
    if (props.show1on1) {
      props.alertActionCreator(
        'Please wait for a few seconds. Establishing a connection with your partner.',
        'info',
        7000
      );
      setTimeout(() => {
        props.alertActionCreator(`OK! Let's talk in ${props.mediaState.currentLanguage.name} at first!`, 'success');
      }, 7000);
    }
  }, [props.show1on1]);

  // ここの構造。に段階で面倒臭いんだよ。改善しよう。
  // useEffect(() => {
  //   if (props.mediaState.apiCallResult === 2) {
  //     props.hangUpCallActionCreator(); //これだけだと、下ですぐにmodalを閉じて、api callをさまたげることになる。
  //     props.setShow1on1(false);
  //     props.updateUserConversationToFalseActionCreator();
  //   }
  // }, [props.mediaState.apiCallResult]); // これ、どういう目的で作った。。。？

  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <SnackBar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
  };

  const onHangUpClick = () => {
    // 1, callacceptedを閉じるっていう具合かね。callacceptedがfalseを引き金に、mediarecorderとspeechrecognitionも停止する。
    // 2, modalを閉じる。
    // modalを閉じてからだと、そもそもsubtitleとmediaRecorder共に、useEffect効かんわ。まあ当然だな。callAcceptedを閉じてから、modalを閉じないとな。
    // props.disconnectCallActionCreator(connectionRef);

    // そうか、そもそもcallAcceptedをfalseにした時点で、もうmodalが表示されないようになっているんだ。
    // props.setShow1on1(false);
    // props.updateUserConversationToFalseActionCreator();
    props.hangUpCallActionCreator(props.socket);
    setShow(false);
    connectionRef.current.destroy();
    props.setShow1on1(false);
    props.setShowRatingModal(true);
    // props.setShowAfterFinishingModal(true);
    // props.hangUpCallActionCreator();
    // props.hangUpCallActionCreator(); //これだけだと、下ですぐにmodalを閉じて、api callをさまたげることになる。
    // window.location = '/worldmap'; // まあこれでいいのかね。
  };

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  // Are you absolutely sure you want to finish this conversation?
  return (
    <>
      <div className='videos-wrapper'>
        {renderAlerts()}
        <video className='partner-video' playsInline ref={oppositeVideoRef} autoPlay />
        <Draggable onDrag={handleDrag} cancel='.btn'>
          <div className={`myvideo-wrapper ${openMyScreen ? undefined : 'hidden'}`}>
            <CloseIconButton onClick={() => setOpenMyScreen(false)}>
              <CloseIcon size='large' />
            </CloseIconButton>
            <video className='myvideo' playsInline muted ref={myVideoRef} autoPlay />
          </div>
        </Draggable>

        <div className='buttons-wrapper'>
          <Stack direction={'row'} spacing={3} alignItems='baseline'>
            <ThemeProvider theme={theme}>
              <SpeedDial
                ariaLabel='SpeedDial controlled open example'
                // sx={{
                //   position: 'absolute',
                //   top: { xxs: '0px', xs: '5px', sm: '10px', md: '20px', lg: '20px' },
                //   left: { xxs: '0px', xs: '5px', sm: '10px', md: '20px', lg: '20px' },
                // }}
                icon={<WidgetsIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                direction={direction}
                FabProps={{
                  // sx: {
                  //   bgcolor: 'rgb(110, 209, 33)',
                  //   '&:hover': {
                  //     bgcolor: 'rgb(145, 237, 74)',
                  //   },
                  // },
                  size: 'small',
                }}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    // tooltipOpen
                    FabProps={{
                      sx: {
                        bgcolor: action.color,
                        '&:hover': {
                          bgcolor: action.hoverColor,
                        },
                      },
                    }}
                    onClick={(event) => onWidgetIconClick(event, action.operation)}
                  />
                ))}
              </SpeedDial>
            </ThemeProvider>
            <ThemeProvider theme={theme}>
              <Tooltip title='Finish Call'>
                <LogoutIconButton onClick={() => setShow(true)}>
                  <LogoutIcon
                    sx={{ color: 'white', fontSize: { xxs: '15px', xs: '15px', sm: '20px', md: '20px', lg: '20px' } }}
                  />
                </LogoutIconButton>
              </Tooltip>
            </ThemeProvider>
          </Stack>
        </div>
        {/*
        <div className='buttons-wrapper'>
          <Stack direction={'row'} spacing={3} alignItems='baseline'>
            <ThemeProvider theme={theme}>
              <Tooltip title='Finish Call'>
                <LogoutIconButton onClick={() => setShow(true)}>
                  <LogoutIcon
                    sx={{ color: 'white', fontSize: { xxs: '15px', xs: '15px', sm: '20px', md: '20px', lg: '20px' } }}
                  />
                </LogoutIconButton>
              </Tooltip>
            </ThemeProvider>
          </Stack>
        </div> */}
        {/* <SwitchLangIconButton>
              <TranslateOutlinedIcon style={{ color: 'white', fontSize: '30px' }} />
            </SwitchLangIconButton> */}
        <div className='switch-button'>
          {/* <ThemeProvider theme={theme}>
            <Tooltip title='Status and Transcript'>
              <Button
                variant='contained'
                startIcon={<RecordVoiceOverIcon />}
                onClick={() => props.setOpenLanguageStatusAndTranscript(true)}
                sx={{
                  height: { xxs: '30px', xs: '30px', sm: '40px', md: '40px', lg: '40px' },
                  fontSize: { xxs: '10px', xs: '10px', sm: '12px', md: '16px', lg: '16px' },
                }}
              >
                {`Let's talk in ${props.mediaState.currentLanguage.name} ! `}
              </Button>
            </Tooltip>
          </ThemeProvider> */}
          <Tooltip title='Click to see the language status and transcripts!!'>
            <CenterIconButton onClick={() => props.setOpenLanguageStatusAndTranscript(true)}>
              <RecordVoiceOverIcon style={{ color: 'white' }} />
            </CenterIconButton>
          </Tooltip>
        </div>
      </div>
      <Modal show={show} onHide={() => setShow(false)} backdrop='static' keyboard={false}>
        <Modal.Body>
          <div style={{ color: 'black' }}>Are you sure you want to finish this conversation?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={() => onHangUpClick()}>Finish</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, alertsState: state.alertsState };
};

export default connect(mapStateToProps, {
  answerCallActionCreator2,
  getConversationIdFromCalledUserActionCreator,
  updateConversationUsersActionCreator,
  completeConnectionWithMyPartnerActionCreator1,
  updateUserConversationStateActionCreator,
  createConversationActionCreator,
  sendConversationIdActionCreator,
  updateUserConversationsActionCreator,
  hangUpCallActionCreator,
  disconnectCallActionCreator,
  updateUserConversationToFalseActionCreator,
  alertActionCreator,
})(VideosWrapper);
