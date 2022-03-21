import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
// import { Button } from 'semantic-ui-react';

import '../styles/1on1.css';

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
import SendIcon from '@mui/icons-material/Send';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import BorderColorIcon from '@mui/icons-material/BorderColor';
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

// call 終わり
import { hangUpCallActionCreator } from '../actionCreators/mediaActionCreator';
import { disconnectCallActionCreator } from '../actionCreators/mediaActionCreator';
import { updateUserConversationToFalseActionCreator } from '../actionCreators/authActionCreators';

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
  { icon: <SendIcon />, name: 'Chat', operation: 'Chat', color: 'rgb(52, 173, 0)', hoverColor: 'rgb(66, 219, 0)' },
  // {
  //   icon: <RecordVoiceOverIcon />,
  //   name: 'Transcript',
  //   operation: 'Transcript',
  //   color: ' rgb(219, 219, 18)',
  //   hoverColor: 'rgb(252, 252, 3)',
  // },
  {
    icon: <PortraitIcon />,
    name: 'Your Screen',
    operation: 'YourScreen',
    color: 'rgb(16, 60, 235)',
    hoverColor: 'rgb(16, 107, 235)',
  },
  {
    icon: <SupervisedUserCircleIcon />,
    name: 'Partner Information',
    operation: 'PartnerInfomation',
    color: 'rgb(126, 87, 194)',
    hoverColor: 'rgb(157, 115, 230)',
  },
  {
    icon: <ScreenShareIcon />,
    name: 'Screen Share (Sorry, not available now.)',
    operation: 'ScreenShare',
    color: 'rgb(189, 8, 62)',
    hoverColor: 'rgb(235, 38, 96)',
  },
  // {
  //   icon: <GTranslateIcon />,
  //   name: 'Google Translate (Sorry, not available now.)',
  //   operation: 'GTranslate',
  //   color: 'rgb(38, 189, 235)',
  //   hoverColor: 'rgb(0, 195, 255)',
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

  const myVideoRef = useRef();
  const oppositeVideoRef = useRef();
  const connectionRef = useRef();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onWidgetIconClick = (event, operation) => {
    event.preventDefault();
    // setOpen(false);
    if (operation === 'Chat') {
      props.setOpenChatComponent(true);
    }
    if (operation === 'Transcript') {
      props.setOpenTranscriptComponent(true);
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
          .completeConnectionWithMyPartnerActionCreator1(myVideoRef, oppositeVideoRef, connectionRef)
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

  // ここの構造。に段階で面倒臭いんだよ。改善しよう。
  // useEffect(() => {
  //   if (props.mediaState.apiCallResult === 2) {
  //     props.hangUpCallActionCreator(); //これだけだと、下ですぐにmodalを閉じて、api callをさまたげることになる。
  //     props.setShow1on1(false);
  //     props.updateUserConversationToFalseActionCreator();
  //   }
  // }, [props.mediaState.apiCallResult]); // これ、どういう目的で作った。。。？

  const onHangUpClick = () => {
    // 1, callacceptedを閉じるっていう具合かね。callacceptedがfalseを引き金に、mediarecorderとspeechrecognitionも停止する。
    // 2, modalを閉じる。
    // modalを閉じてからだと、そもそもsubtitleとmediaRecorder共に、useEffect効かんわ。まあ当然だな。callAcceptedを閉じてから、modalを閉じないとな。
    // props.disconnectCallActionCreator(connectionRef);

    // そうか、そもそもcallAcceptedをfalseにした時点で、もうmodalが表示されないようになっているんだ。
    // props.setShow1on1(false);
    // props.updateUserConversationToFalseActionCreator();
    connectionRef.current.destroy();
    props.setShow1on1(false);
    // props.hangUpCallActionCreator(); //これだけだと、下ですぐにmodalを閉じて、api callをさまたげることになる。
  };

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  // Are you absolutely sure you want to finish this conversation?
  return (
    <>
      <div className='videos-wrapper'>
        <video className='partner-video' playsInline ref={oppositeVideoRef} autoPlay />
        <Draggable onDrag={handleDrag} cancel='.btn'>
          <div className={`myvideo-wrapper ${openMyScreen ? undefined : 'hidden'}`}>
            <CloseIconButton onClick={() => setOpenMyScreen(false)}>
              <CloseIcon size='large' />
            </CloseIconButton>
            <video className='myvideo' playsInline muted ref={myVideoRef} autoPlay />
          </div>
        </Draggable>
        <ThemeProvider theme={theme}>
          <SpeedDial
            ariaLabel='SpeedDial controlled open example'
            sx={{
              position: 'absolute',
              top: { xxs: '0px', xs: '5px', sm: '10px', md: '20px', lg: '20px' },
              left: { xxs: '0px', xs: '5px', sm: '10px', md: '20px', lg: '20px' },
            }}
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

        <div className='buttons-wrapper'>
          <Stack direction={'row'} spacing={3} alignItems='baseline'>
            {/* <Tooltip title='Check Status!!'>
              <SwitchLangIconButton onClick={() => props.setOpenLanguageStatus(true)}>
                <TranslateOutlinedIcon style={{ color: 'white' }} />
              </SwitchLangIconButton>
            </Tooltip> */}
            <ThemeProvider theme={theme}>
              <Tooltip title='Finish Call'>
                <LogoutIconButton onClick={() => onHangUpClick()}>
                  <LogoutIcon
                    sx={{ color: 'white', fontSize: { xxs: '15px', xs: '15px', sm: '20px', md: '20px', lg: '20px' } }}
                  />
                </LogoutIconButton>
              </Tooltip>
            </ThemeProvider>
            {/* <Tooltip title='Volume'>
              <MicIconButton>
                <MicIcon size='large' />
              </MicIconButton>
            </Tooltip> */}
          </Stack>
        </div>
        <div className='switch-button'>
          <ThemeProvider theme={theme}>
            <Tooltip title='Status and Transcript'>
              {/* <SwitchLangIconButton>
              <TranslateOutlinedIcon style={{ color: 'white', fontSize: '30px' }} />
            </SwitchLangIconButton> */}
              <Button
                variant='contained'
                startIcon={<RecordVoiceOverIcon />}
                onClick={() => props.setOpenLanguageStatusAndTranscript(true)}
                disableRipple
                sx={{
                  height: { xxs: '30px', xs: '30px', sm: '40px', md: '40px', lg: '40px' },
                  fontSize: { xxs: '10px', xs: '10px', sm: '12px', md: '16px', lg: '16px' },
                }}
              >
                {`Let&lsquo;s talk in ${props.mediaState.currentLanguage.name} ! `}
              </Button>
            </Tooltip>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
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
})(VideosWrapper);
