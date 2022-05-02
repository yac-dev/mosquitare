import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';

// ac

const ReplyMessageModal = (props) => {
  useEffect(() => {
    // ここで、props.unreadMessagesたちをread: trueにしていくようにするか。
    // props.updateUnreadToRead(props.unreadMessages);
  }, []);

  const renderUnreadMessages = () => {
    const unreadMessages = props.unreadMessages.map((message) => {
      if (message.sender._id === props.user._id) {
        return (
          <div>
            <p>{message.sender.name}</p>
            <p>{message.content}</p>
            <p>{message.createdAt}</p>
          </div>
        );
      }
    });

    return <>{unreadMessages}</>;
  };
  return (
    <Dialog open={props.showReplyMessageModal} onClose={() => props.setShowReplyMessageModal(false)}>
      <DialogTitle>Reply </DialogTitle>
      <DialogContent>
        <DialogContentText>{renderUnreadMessages()}</DialogContentText>
        <TextField
          autoFocus
          value={props.message}
          onChange={(event) => props.setReplyMessage(event.target.value)}
          margin='dense'
          id='name'
          label='Message'
          type='text'
          fullWidth
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={() => handleClose()}>Cancel</Button> */}
        {/* <Button variant='contained' startIcon={<SendIcon />} onClick={() => handleSendMessage()}> */}
        Reply
        {/* </Button> */}
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return { clickedState: state.clickedUserState, messagesState: Object.values(state.messagesState) };
};

export default connect(mapStateToProps, {})(ReplyMessageModal);
