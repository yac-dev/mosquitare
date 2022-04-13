import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// components
import DisplayVideo from './UserPage/DisplayVideo';
import SnackBar from './Snackbar';

// mui components
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

// ac
import { loadMeActionCreator } from '../actionCreators/authActionCreators';
import { getConversationActionCreator } from '../actionCreators/conversationActionCreators';

const DisplayingConversationVideo = (props) => {
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken);
      // props.getUserConversations(user.conversations._id);
      // .then((user) => {
      //   props.getConversation(user.id)
      // });
    }
  }, []);

  useEffect(() => {
    props.getConversationActionCreator(props.match.params.conversationId);
  }, []);

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

  const renderMyConversation = () => {
    if (props.conversationState.conversation) {
      return (
        <>
          {/* <div className='conversation-video-header'>
              <Stack direction='row' spacing={1}>
                <Avatar>{props.conversationState.conversation.users[0].name}</Avatar>
                <Avatar>{props.conversationState.conversation.users[1].name}</Avatar>
              </Stack>
            </div> */}
          <DisplayVideo conversation={props.conversationState.conversation} />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {renderAlerts()}
      {renderMyConversation()}
    </>
    // <>hey</>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    // conversationState: state.conversationsState[ownProps.match.params.conversationId],
    authState: state.authState,
    conversationState: state.conversationState,
    alertsState: state.alertsState,
  };
};

export default connect(mapStateToProps, { loadMeActionCreator, getConversationActionCreator })(
  DisplayingConversationVideo
);
