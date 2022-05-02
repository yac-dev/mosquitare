import React from 'react';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';

import { createMessageActionCreator } from '../actionCreators/messagesActionCreator';

const SendMessageModal = (props) => {
  const handleClickOpen = () => {
    // setOpen(true);
  };

  const handleSendMessage = () => {
    if (props.message && props.authState.currentUser) {
      // props.createCommentActionCreator(content);
      props.createMessageActionCreator(props.message, props.clickedState.mapUser.user._id);
      props.setMessage('');
    } else if (!props.authState.currentUser) {
      props.alertActionCreator('You need to signup or login to comment.', 'error');
    } else if (!props.message) {
      // alertかな。
      props.alertActionCreator('Please write a message.', 'error');
    }
  };

  const handleClose = () => {
    // setOpen(false);
    props.setShowSendMessageModal(false);
    props.setMessage('');
  };

  // message={message}
  // setMessage={setMessage}

  return (
    <Dialog open={props.showSendMessageModal} onClose={() => props.setShowSendMessageModal(false)}>
      <DialogTitle>Write a message to </DialogTitle>
      <DialogContent>
        <DialogContentText>
          e.g. Hello I'm John! I saw your profile. Do you wnat to talk and practice with me?
        </DialogContentText>
        <TextField
          autoFocus
          value={props.message}
          onChange={(event) => props.setMessage(event.target.value)}
          margin='dense'
          id='name'
          label='Message'
          type='text'
          fullWidth
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button variant='contained' startIcon={<SendIcon />} onClick={() => handleSendMessage()}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState, clickedState: state.clickedUserState };
};

export default connect(mapStateToProps, { createMessageActionCreator })(SendMessageModal);
