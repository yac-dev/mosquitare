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

// ac
import { getMyMessagesActionCreator } from '../actionCreators/messagesActionCreator';
import { clickMessageUserActionCreator } from '../actionCreators/clickActionCreator';

const InboxModal = (props) => {
  const [clickedMail, setClickedMail] = useState();

  useEffect(() => {
    props.getMyMessagesActionCreator();
  }, []);

  const handleClickOpen = (user) => {
    props.clickMessageUserActionCreator(user);
    props.setShowMessageModal(true);
  };

  const handleClose = () => {
    props.setShowInboxModal(false);
  };

  const renderMessages = () => {
    if (props.messagesState.length) {
      const messages = props.messagesState.map((message) => {
        return (
          <>
            <div style={{ cursor: 'pointer' }} onClick={() => handleClickOpen(message.sender)}>
              <ListItem alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar alt={message.sender.name} />
                </ListItemAvatar>
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
                      <div>{message.createdAt}</div>
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
    if (props.modalState.showInbox) {
      return (
        <>
          <div style={{ backgroundColor: 'red', position: 'absolute', top: '50px', right: '30px' }}>
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
  return { modalState: state.modalState, messagesState: Object.values(state.messagesState) };
};

export default connect(mapStateToProps, { getMyMessagesActionCreator, clickMessageUserActionCreator })(InboxModal);
