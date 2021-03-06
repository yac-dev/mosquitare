import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

// ac
import { getMyMessagesActionCreator } from '../actionCreators/messagesActionCreator';
import { clickMessageActionCreator } from '../actionCreators/clickActionCreator';
import { showInboxModalActionCreator } from '../actionCreators/modalActionCreator';
import { clickNavMessageIconActionCreator } from '../actionCreators/clickActionCreator';

const InboxModal = (props) => {
  const [clickedMail, setClickedMail] = useState();

  useEffect(() => {
    props.getMyMessagesActionCreator();
  }, []);

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

  const handleClickOpen = (message) => {
    props.clickMessageActionCreator(message);
    // props.clickNavMessageIconActionCreator(false);
    // props.setShowMessageModal(true);
  };

  const handleClose = () => {
    props.setShowInboxModal(false);
  };

  const renderMessages = () => {
    if (props.messagesState.length) {
      const messages = props.messagesState.map((message) => {
        return (
          <>
            <div style={{ cursor: 'pointer' }} onClick={() => handleClickOpen(message)}>
              <ListItem alignItems='flex-start'>
                {message.read ? (
                  <ListItemAvatar>
                    <Avatar
                      alt={message.sender.name}
                      src={`${process.env.REACT_APP_S3_BUCKET_IMAGE_LINK}/${message.sender.photo}`}
                    />
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar>
                    <Badge
                      color='secondary'
                      sx={{
                        '& .MuiBadge-badge': {
                          color: 'white',
                          backgroundColor: 'red',
                        },
                      }}
                      variant='dot'
                    >
                      <Avatar
                        alt={message.sender.name}
                        src={`${process.env.REACT_APP_S3_BUCKET_IMAGE_LINK}/${message.sender.photo}`}
                      />
                    </Badge>
                  </ListItemAvatar>
                )}
                {/* <ListItemAvatar>
                  <Avatar alt={message.sender.name} />
                </ListItemAvatar> */}
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                        {message.sender.name}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                        {message.content}
                      </Typography>
                      {/* <div>{timeSince(new Date(message.createdAt))} ago</div> */}
                      {/* <div>{`${new Date(message.createdAt).toLocaleString('en-GB', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`}</div> */}
                      <div>
                        {`${new Date(message.createdAt).toLocaleString('en-US', {
                          // month: 'long',
                          // day: '2-digit',
                          // hour: '2-digit',
                          // minute: '2-digit',
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          year: 'numeric',
                        })}`}
                      </div>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant='inset' component='li' />
            </div>
          </>
        );
      });

      return <List sx={{ width: '100%', bgcolor: 'background.paper' }}>{messages}</List>;
    }
  };

  const renderInboxModal = () => {
    if (props.clickedState.navMessageIcon.clicked) {
      return (
        <>
          <div
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              top: '50px',
              right: '30px',
              overflow: 'auto',
              maxHeight: '500px',
              maxWidth: '300px',
            }}
          >
            {renderMessages()}
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  return <>{renderInboxModal()}</>;
};

const mapStateToProps = (state) => {
  return {
    modalState: state.modalState,
    messagesState: Object.values(state.messagesState),
    clickedState: state.clickedUserState,
  };
};

export default connect(mapStateToProps, {
  getMyMessagesActionCreator,
  clickMessageActionCreator,
  showInboxModalActionCreator,
  clickNavMessageIconActionCreator,
})(InboxModal);
