import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { getMessagesWithUserActionCreator } from '../actionCreators/messagesActionCreator';
import { clickMessageButtonActionCreator } from '../actionCreators/clickActionCreator';
import { createMessageActionCreator } from '../actionCreators/messagesActionCreator';
import { alertActionCreator } from '../actionCreators/alertsActionCreator';
// import { updateUnreadToReadActionCreator } from '../actionCreators/messagesActionCreator';

// mui component
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import Popover from '@mui/material/Popover';
import { TextField, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// mui components
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

const MessageWindow = (props) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    props.getMessagesWithUserActionCreator(props.clickedState.mapUser.user._id);
    // .then(() =>
    // props.updateUnreadToReadActionCreator()
    // ); // unreadからreadに変えるの、やっぱやめた。
  }, [props.clickedState.mapUser.user]);

  // useEffect(() => {
  //   if(props.messagesWithUserState.length){
  //     const myUnreadMessages = props.messagesWithUserState.filter((message) => message.recipient._id === props.authState.currentUser._id)
  //   }

  // }, [props.clickedState.mapUser.user]);

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

  const renderMessages = () => {
    if (props.messagesWithUserState.length) {
      const messages = props.messagesWithUserState.map((message) => {
        return (
          <div style={{ marginBottom: '5px' }}>
            <span style={{ backgroundColor: 'rgb(196, 196, 196)', padding: '2px', borderRadius: '5px' }}>
              {message.sender.name}
            </span>
            <span
              style={{
                display: 'block',
                backgroundColor: 'rgb(196, 196, 196)',
                borderRadius: '5px',
                padding: '2px',
                marginBottom: '2px',
              }}
            >
              {message.content}
            </span>
            <span style={{ display: 'block', backgroundColor: 'rgb(196, 196, 196)', borderRadius: '5px' }}>
              {timeSince(new Date(message.createdAt))} ago
            </span>
          </div>
        );
      });

      return <>{messages}</>;
    } else {
      return <div>No messages here.</div>;
    }
  };

  const render = () => {
    if (props.clickedState.mapUser) {
      return (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '555px',
            height: '400px',
            width: '300px',
            color: 'black',
            padding: '10px',
            // backgroundColor: 'blue',
            backgroundColor: 'rgb(37, 95, 184)',
          }}
        >
          <div style={{ height: '100%', backgroundColor: 'rgb(232, 232, 232)', padding: '5px' }}>
            <div
              className='message-window-header'
              style={{ display: 'flex', height: '15%', justifyContent: 'space-between' }}
            >
              <Avatar alt={props.clickedState.mapUser.user.name} src='/static/images/avatar/1.jpg' />
              <p>{props.clickedState.mapUser.user.name}</p>
              <i
                className='fa fa-close'
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => props.clickMessageButtonActionCreator(false)}
              ></i>
            </div>
            <div style={{ width: '100%', height: '15%' }}>
              <TextField
                id='input-with-icon-textfield'
                label='Write a message'
                placeholder='Practice with me on January 1st?'
                fullWidth
                value={content}
                onChange={(event) => setContent(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Tooltip title='Send'>
                        <IconButton>
                          <SendIcon onClick={() => handleSendMessage(props.clickedState.mapUser.user._id)} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                variant='standard'
              />
            </div>
            <div style={{ height: '70%', overflow: 'auto' }}>{renderMessages()}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return <>{render()}</>;
};

const mapStateToProps = (state) => {
  return {
    clickedState: state.clickedUserState,
    messagesWithUserState: Object.values(state.messagesWithUserState.messagesWithUser),
    authState: state.authState,
  };
};

export default connect(mapStateToProps, {
  getMessagesWithUserActionCreator,
  clickMessageButtonActionCreator,
  createMessageActionCreator,
  alertActionCreator,
})(MessageWindow);
