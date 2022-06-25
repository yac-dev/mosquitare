import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import VideocamIcon from '@mui/icons-material/Videocam';
import TranslateIcon from '@mui/icons-material/Translate';
import DuoIcon from '@mui/icons-material/Duo';

// mui for option
import Badge from '@mui/material/Badge';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import ReplyIcon from '@mui/icons-material/Reply';
import Popover from '@mui/material/Popover';
import { TextField, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
// mui components
import Tooltip from '@mui/material/Tooltip';
import { Stack } from '@mui/material';

// components
import Snackbar from './Snackbar';
import ReplyMessageModal from './ReplyMessageModal';

// action creators
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { createMessageActionCreator } from '../actionCreators/messagesActionCreator';
import { alertActionCreator } from '../actionCreators/alertsActionCreator';

import { clickMessageButtonActionCreator } from '../actionCreators/clickActionCreator';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const CallButton = (props) => {
  // const [exchangeableLanguageTable,setExchangeableLanguageTable ] = useState({langs: {'learning': null,'native': null}})
  const [exchangeableLearningLangs, setExchangeableLearningLangs] = useState([]);
  const [exchangeableNativeLangs, setExchangeableNativeLangs] = useState([]);
  const [mutualLearningLangs, setMutualLearningLangs] = useState([]);
  // const [menuItemDDOMs, setMenuItemDOMs] = useState([]);
  const [content, setContent] = useState('');

  const [sendAnchorEl, setSendAnchorEl] = React.useState(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [showReplyMessageModal, setShowReplyMessageModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

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

  const handleSendClick = (event) => {
    setSendAnchorEl(event.currentTarget);
  };

  const handleSendClose = () => {
    setSendAnchorEl(null);
  };

  const openSend = Boolean(sendAnchorEl);
  const idSend = openSend ? 'simple-popover' : undefined;

  // dropdown用
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const myLearningLangs = store.getState().authState.currentUser.learningLangs;
    const buffer1 = [];
    for (let i = 0; i < myLearningLangs.length; i++) {
      for (let j = 0; j < props.user.nativeLangs.length; j++) {
        // if (myLearningLangs[i]._id === props.user.nativeLangs[j]._id) {
        if (myLearningLangs[i].language._id === props.user.nativeLangs[j].language._id) {
          buffer1.push(myLearningLangs[i].language);
          // setExchangeableLearningLangs((previousState) => [...previousState, myLearningLangs[i]]);
          // 足していく方法だと、userを変えるたびにarrayにたされることになる。毎回初期化するために、bufferを用意する。
        }
      }
    } // O(^2)
    setExchangeableLearningLangs(buffer1);

    const buffer2 = [];
    const myNativeLangs = store.getState().authState.currentUser.nativeLangs;
    for (let i = 0; i < myNativeLangs.length; i++) {
      for (let j = 0; j < props.user.learningLangs.length; j++) {
        // if (myNativeLangs[i]._id === props.user.learningLangs[j]._id) {
        if (myNativeLangs[i].language._id === props.user.learningLangs[j].language._id) {
          buffer2.push(myNativeLangs[i].language);
          // setExchangeableNativeLangs((previousState) => [...previousState, myNativeLangs[i]]);
        }
      }
    } // O(^2)
    setExchangeableNativeLangs(buffer2);

    // const ourLearningLangs = store.getState().authState.currentUser.learningLangs;
    // const bufferForLearning = [];
    // for (let i = 0; i < ourLearningLangs.length; i++) {
    //   for (let j = 0; j < props.user.learningLangs.length; j++) {
    //     // if (myLearningLangs[i]._id === props.user.nativeLangs[j]._id) {
    //     if (ourLearningLangs[i].language._id === props.user.learningLangs[j].language._id) {
    //       bufferForLearning.push(ourLearningLangs[i].language);
    //     }
    //   }
    // } // O(^2)
    // setMutualLearningLangs(bufferForLearning);
  }, [props.user]);

  useEffect(() => {
    let messagesBuffer = [];
    for (let i = 0; i < props.messagesState.length; i++) {
      if (props.messagesState[i].sender._id === props.user._id) {
        // if (!props.messagesState[i].read) {
        messagesBuffer.push(props.messagesState[i]);
        // }
      }
    }
    // setUnreadMessages(unreadMessagesBuffer);
    setBadgeCount(messagesBuffer.length);
  }, [props.user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCallClick = (event, oppositeSocketId, exchangingLanguages) => {
    event.preventDefault();
    // props.setIsPopupOpen(false);
    if (props.mediaState.mediaDisabled) {
      props.alertActionCreator(
        'Please allow your camera and microphone access. And then, refresh the page.',
        'error',
        7000
      );
    } else {
      // const mySocketId = props.authState.currentUser.socketId;
      if (props.setOpenSwipeableDrawer) {
        props.setOpenSwipeableDrawer(false);
      }
      props.setShowCallingModal(true);
      props.callActionCreator(props.socket, oppositeSocketId, exchangingLanguages);
    }
  };

  // showSendMessageModal={props.showSendMessageModal}
  // setShowSendMessageModal={props.setShowSendMessageModal}
  const handleSendMessage = (recipientId) => {
    if (content && props.authState.currentUser) {
      // props.createCommentActionCreator(content);
      props.createMessageActionCreator(content, recipientId);
      setContent('');
    } else if (!props.authState.currentUser) {
      props.alertActionCreator('You need to signup or login to comment.', 'error');
    } else if (!content) {
      // alertかな。
      props.alertActionCreator('Please write a message.', 'error');
    }
  };

  // const renderSendOrReply = () => {
  //   if (badgeCount >= 1) {
  //     return (
  //       <Tooltip title='You have the message from this user.'>
  //         <Badge
  //           badgeContent={badgeCount}
  //           color='success'
  //           sx={{
  //             '& .MuiBadge-badge': {
  //               color: 'white',
  //               backgroundColor: 'rgb(0, 186, 68)',
  //               '&:hover': {
  //                 backgroundColor: 'rgb(0, 158, 58)',
  //               },
  //             },
  //           }}
  //         >
  //           <Button
  //             variant='contained'
  //             // startIcon={<SendIcon />}
  //             onClick={() => props.clickMessageButtonActionCreator(true)}
  //             sx={{
  //               backgroundColor: 'rgb(0, 186, 68)',
  //               '&:hover': {
  //                 backgroundColor: 'rgb(0, 158, 58)',
  //               },
  //             }}
  //           >
  //             {/* Message */}
  //             <EmailIcon />
  //           </Button>
  //         </Badge>
  //       </Tooltip>
  //     );
  //   } else {
  //     return (
  //       <Tooltip title='You can send any messages to this user.'>
  //         <Button
  //           variant='contained'
  //           // startIcon={<SendIcon />}
  //           onClick={() => props.clickMessageButtonActionCreator(true)}
  //           sx={{
  //             backgroundColor: 'rgb(0, 186, 68)',
  //             '&:hover': {
  //               backgroundColor: 'rgb(0, 158, 58)',
  //             },
  //           }}
  //         >
  //           {/* Message */}
  //           <EmailIcon />
  //         </Button>
  //       </Tooltip>
  //     );
  //   }
  // };

  const renderExchangeableLangs = () => {
    if (!props.authState.currentUser) {
      return <div>You need to signup or login to have a conversation.</div>;
    } else {
      const menuItemDOMs = [];
      // const mutualItemsDom = [];
      if (exchangeableLearningLangs.length && exchangeableNativeLangs.length) {
        console.log(exchangeableLearningLangs, exchangeableNativeLangs, 'logging changed');
        for (let i = 0; i < exchangeableLearningLangs.length; i++) {
          for (let j = 0; j < exchangeableNativeLangs.length; j++) {
            menuItemDOMs.push(
              <>
                <MenuItem
                  onClick={(event) => {
                    onCallClick(event, props.user.socketId, [exchangeableLearningLangs[i], exchangeableNativeLangs[j]]);
                    handleClose();
                  }}
                  disableRipple
                >
                  <VideocamIcon />
                  &nbsp;Exchange {exchangeableLearningLangs[i].name} &amp; {exchangeableNativeLangs[j].name}
                  {/* 必ず、callerにとってのlearning langがindex 0に入る。上で送るからね。*/}
                </MenuItem>
              </>
            );
          }
        }

        return (
          <div className='action-button-flexbox' style={{ display: 'flex', gap: '10px' }}>
            <div className='call-button'>
              <Tooltip title='Click to see exchange options.'>
                <Button
                  id='demo-customized-button'
                  aria-controls={open ? 'demo-customized-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  variant='contained'
                  disableElevation
                  disabled={props.user.isAvailableNow ? false : true}
                  onClick={handleClick}
                  // endIcon={<KeyboardArrowDownIcon />}
                  // sx={{ backgroundColor: 'white', color: 'black' }}
                >
                  <VideocamIcon size='large' />
                  <KeyboardArrowDownIcon />
                  {/* &nbsp; Exchange */}
                </Button>
              </Tooltip>
              <StyledMenu
                id='demo-customized-menu'
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {menuItemDOMs}
              </StyledMenu>
            </div>
          </div>
        );
      }
      // else if (mutualLearningLangs.length) {
      //   for (let i = 0; i < mutualLearningLangs.length; i++) {
      //     menuItemDOMs.push(
      //       <>
      //         <MenuItem
      //           onClick={(event) => {
      //             onCallClick(event, props.user.socketId);
      //             handleClose();
      //           }}
      //           disableRipple
      //         >
      //           <PhoneEnabledIcon />
      //           &nbsp;Learn {mutualLearningLangs[i].name} each other
      //           {/* 必ず、callerにとってのlearning langがindex 0に入る。上で送るからね。*/}
      //         </MenuItem>
      //       </>
      //     );
      //   }
      // }
      else {
        return <div>You cannot have a conversation with this user</div>;
      }

      // return (
      //   <div className='action-button-flexbox' style={{ display: 'flex', gap: '10px' }}>
      //     <div className='call-button'>
      //       <Tooltip title='Click to see exchange options.'>
      //         <Button
      //           id='demo-customized-button'
      //           aria-controls={open ? 'demo-customized-menu' : undefined}
      //           aria-haspopup='true'
      //           aria-expanded={open ? 'true' : undefined}
      //           variant='contained'
      //           disableElevation
      //           disabled={props.user.isAvailableNow ? false : true}
      //           onClick={handleClick}
      //           // endIcon={<KeyboardArrowDownIcon />}
      //           // sx={{ backgroundColor: 'white', color: 'black' }}
      //         >
      //           <PhoneEnabledIcon size='large' />
      //           <KeyboardArrowDownIcon />
      //           {/* &nbsp; Exchange */}
      //         </Button>
      //       </Tooltip>
      //       <StyledMenu
      //         id='demo-customized-menu'
      //         MenuListProps={{
      //           'aria-labelledby': 'demo-customized-button',
      //         }}
      //         anchorEl={anchorEl}
      //         open={open}
      //         onClose={handleClose}
      //       >
      //         {menuItemDOMs}
      //       </StyledMenu>
      //     </div>
      //   </div>
      // );
    }
  };

  return (
    <>
      {renderExchangeableLangs()}
      {/* <ReplyMessageModal
        user={props.user}
        unreadMessages={unreadMessages}
        showReplyMessageModal={showReplyMessageModal}
        setShowReplyMessageModal={setShowReplyMessageModal}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      /> */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authState: state.authState,
    mediaState: state.mediaState,
    clickedState: state.clickedUserState,
    messagesState: Object.values(state.messagesState),
  };
};

export default connect(mapStateToProps, {
  callActionCreator,
  createMessageActionCreator,
  alertActionCreator,
  clickMessageButtonActionCreator,
})(CallButton);
