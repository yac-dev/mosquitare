import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import VideocamIcon from '@mui/icons-material/Videocam';
import TranslateIcon from '@mui/icons-material/Translate';
import DuoIcon from '@mui/icons-material/Duo';

// mui for option
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import Popover from '@mui/material/Popover';
import { TextField, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// mui components
import Tooltip from '@mui/material/Tooltip';

// action creators
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { createMessageActionCreator } from '../actionCreators/messagesActionCreator';
import { alertActionCreator } from '../actionCreators/alertsActionCreator';

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
  // const [menuItemDDOMs, setMenuItemDOMs] = useState([]);
  const [content, setContent] = useState('');

  const [sendAnchorEl, setSendAnchorEl] = React.useState(null);

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
    const mySocketId = props.authState.currentUser.socketId;
    if (props.setOpenSwipeableDrawer) {
      props.setOpenSwipeableDrawer(false);
    }
    props.setShowCallingModal(true);
    props.callActionCreator(props.socket, mySocketId, oppositeSocketId, exchangingLanguages);
  };

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

  const renderExchangeableLangs = () => {
    const menuItemDOMs = [];
    if (exchangeableLearningLangs.length && exchangeableNativeLangs.length) {
      console.log(exchangeableLearningLangs, exchangeableNativeLangs);
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
                {exchangeableLearningLangs[i].name} &amp; {exchangeableNativeLangs[j].name}
                {/* 必ず、callerにとってのlearning langがindex 0に入る。上で送るからね。*/}
              </MenuItem>
            </>
          );
        }
      }

      return (
        <div className='action-button-flexbox' style={{ display: 'flex', gap: '10px' }}>
          <div className='call-button'>
            <Button
              id='demo-customized-button'
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              variant='contained'
              disableElevation
              disabled={props.user.isAvailableNow ? false : true}
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
              // sx={{ backgroundColor: 'white', color: 'black' }}
            >
              <VideocamIcon size='large' />
              &nbsp; Exchange now
            </Button>
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
          <Button
            variant='contained'
            startIcon={<SendIcon />}
            onClick={handleSendClick}
            sx={{
              backgroundColor: 'rgb(0, 186, 68)',
              '&:hover': {
                backgroundColor: 'rgb(0, 158, 58)',
              },
            }}
          >
            Send a message
          </Button>
          <Popover
            id={idSend}
            open={openSend}
            anchorEl={sendAnchorEl}
            onClose={handleSendClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {/* dummyのdivを作っておく。*/}
            <div style={{ width: '300px', height: '100%', padding: '5px' }}>
              <TextField
                id='input-with-icon-textfield'
                label='Write a short message'
                placeholder='e.g. Do you want to talk with me on January 1st?'
                multiline
                fullWidth
                value={content}
                onChange={(event) => setContent(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Tooltip title='Send'>
                        <IconButton>
                          <SendIcon onClick={() => handleSendMessage(props.user._id)} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                variant='standard'
              />
            </div>
          </Popover>
        </div>
      );
    } else {
      return <div>You cannot have a conversation with this user</div>;
    }
  };

  return <>{renderExchangeableLangs()}</>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { callActionCreator, createMessageActionCreator, alertActionCreator })(
  CallButton
);
