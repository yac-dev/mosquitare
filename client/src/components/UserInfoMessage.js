import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import MessageIcon from '@mui/icons-material/Message';
import { TextField, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import HelpIcon from '@mui/icons-material/Help';
import { styled } from '@mui/system';

import { getMessagesWithUserActionCreator } from '../actionCreators/messagesActionCreator';
import { createMessageActionCreator } from '../actionCreators/messagesActionCreator';
import { alertActionCreator } from '../actionCreators/alertsActionCreator';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 14,
  height: 14,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

const UserInfoMessage = (props) => {
  const [content, setContent] = useState('');
  const [sentMessage, setSentMessage] = useState(false);

  useEffect(() => {
    props.getMessagesWithUserActionCreator(props.user._id);
    // .then(() =>
    // props.updateUnreadToReadActionCreator()
    // ); // unreadからreadに変えるの、やっぱやめた。
  }, [props.user]);

  const handleSendMessage = (recipientId) => {
    if (!content) {
      // props.createCommentActionCreator(content);
      return props.alertActionCreator('Please write a message.', 'error');
      // props.createMessageActionCreator(content, recipientId);
    } else if (!props.authState.currentUser) {
      return props.alertActionCreator('You need to signup or login to comment.', 'error');
    } else if (content && props.authState.currentUser) {
      // alertかな。
      setSentMessage(true);
      props.createMessageActionCreator(content, recipientId, setSentMessage);
      setContent('');
    }
  };

  const renderMessages = () => {
    if (props.messagesWithUserState.length) {
      const messages = props.messagesWithUserState.map((message) => {
        return (
          <div style={{ marginBottom: '5px' }}>
            <div style={{ marginBottom: '5px' }}>
              <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                {message.sender.name}&nbsp;
                {new Date(message.createdAt).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </div>

            <span
              style={{
                // display: 'block',
                backgroundColor: 'rgb(37, 95, 184)',
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '2px',
                color: 'white',
              }}
            >
              {message.content}
            </span>
          </div>
        );
      });
      return <>{messages}</>;
    } else {
      return <div>You don't have any messages with this user.</div>;
    }
  };

  function formatDate(date) {
    const currentMonth = date.getMonth();
    const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
    const currentDate = date.getDate();
    const dateString = currentDate >= 10 ? currentDate : `0${currentDate}`;
    return `${date.getFullYear()}-${monthString}-${currentDate}`;
  }

  const renderMessagesList = () => {
    if (props.messagesWithUserState.length) {
      const messages = props.messagesWithUserState.map((message) => {
        return (
          <>
            <ListItem
              alignItems='flex-start'
              sx={{
                width: '100%',
                backgroundColor: 'rgb(232, 232, 232)',
                borderRadius: '5px',
                border: '1px solid rgb(207, 207, 207)',
                marginBottom: '5px',
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={<SmallAvatar src={message.sender.nationalities[0].flagPics[0]} />}
                >
                  <Avatar
                    // sx={{ width: 85, height: 85 }}
                    alt={message.sender.name}
                    // src={user.photo ? user.photo : ''}
                    src={`${process.env.REACT_APP_S3_BUCKET_IMAGE_LINK}/${message.sender.photo}`}
                  >
                    {message.sender.name}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={`${new Date(message.createdAt).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}
                // primary={formatDate(new Date(message.createdAt))}
                secondary={
                  <React.Fragment>
                    <Typography variant='body2' color='text.secondary'>
                      {message.content}
                    </Typography>
                    {/* <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                    </Typography> */}
                  </React.Fragment>
                }
              />
            </ListItem>
            {/* <Divider /> */}
          </>
        );
      });

      return (
        <>
          <List>{messages}</List>
        </>
      );
    } else {
      return <div>You don't have any messages with this user.</div>;
    }
  };

  const renderIconButton = () => {
    if (sentMessage) {
      return (
        <IconButton
          // onClick={() => handleSendComment(content)}
          // handleSendMessage(props.clickedState.mapUser.user._id)
          disabled
        >
          <SendIcon />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          // onClick={() => handleSendComment(content)}
          onClick={() => handleSendMessage(props.user._id)}
          // handleSendMessage(props.clickedState.mapUser.user._id)
        >
          <SendIcon />
        </IconButton>
      );
    }
  };

  return (
    <div
      className='user-info-language'
      style={{ padding: '10px' }}
      // style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px', marginBottom: '10px' }}
    >
      <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)', marginBottom: '20px' }}>
        <MessageIcon />
        &nbsp; Messages with me &nbsp;
        <Tooltip title='All messages of you and this user will be displayed here.'>
          <HelpIcon />
        </Tooltip>
      </h6>
      <div style={{ width: '100%', padding: '5px' }}>
        <TextField
          id='input-with-icon-textfield'
          label='Write a message'
          placeholder='e.g. Hi!. Why not practice with me on January 1st?'
          multiline
          fullWidth
          value={content}
          onChange={(event) => setContent(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Tooltip title='Send'>
                  {/* <IconButton
                    onClick={() => handleSendMessage(props.user._id)}
                    disabled={`${sentMessage ? true : false}`}
                  >
                    <SendIcon />
                  </IconButton> */}
                  {renderIconButton()}
                </Tooltip>
              </InputAdornment>
            ),
          }}
          variant='standard'
        />
      </div>
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>{renderMessagesList()}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    clickedState: state.clickedUserState,
    messagesWithUserState: Object.values(state.messagesWithUserState.messagesWithUser).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ),
    authState: state.authState,
  };
};

export default connect(mapStateToProps, {
  getMessagesWithUserActionCreator,
  createMessageActionCreator,
  alertActionCreator,
})(UserInfoMessage);
