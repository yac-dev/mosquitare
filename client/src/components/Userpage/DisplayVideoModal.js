import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import DisplayVideo from './DisplayVideo';
import ResourceTabs from './ResourceTabs';

// ac
import { cleanUpComments } from '../../actionCreators/commentsActionCreator';
import { cleanUpTranscripts } from '../../actionCreators/transcriptsActionCreator';

// mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

const VideoDisplayingModal = (props) => {
  const handleCloseModal = () => {
    props.setShowVideoDisplayingModal(false);
    // ここで、reducerを掃除する。commentsとtranscrits, docを綺麗にする。
    props.cleanUpComments();
    props.cleanUpTranscripts();
  };

  const renderModal = () => {
    if (props.conversationState.currentConversation) {
      return (
        <>
          <Modal
            show={props.showVideoDisplayingModal}
            // onHide={() => handleCloseModal()}
            backdrop='static'
            keyboard={false}
            dialogClassName={'video-displaying-modal'}
            centered
          >
            {/* <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 55, 110' }}>
            <Modal.Title>With Jonh!!</Modal.Title>
          </Modal.Header> */}
            <Modal.Body bsPrefix='video-displaying-modal-body'>
              {/* <div className='modal-inner-wrapper'> */}
              <div className='conversation-video-header'>
                <Stack direction='row' spacing={1}>
                  <Avatar alt={props.conversationState.currentConversation.users[0].name} />
                  <Avatar alt={props.conversationState.currentConversation.users[1].name} />
                </Stack>
                <div className='conversation-video-close-button' onClick={() => handleCloseModal()}>
                  <i className='fa fa-close' style={{ fontSize: '20px', color: 'white', cursor: 'pointer' }}></i>
                </div>
              </div>
              <DisplayVideo conversation={props.conversation} />
              {/* </div> */}
              {/* <ResourceTabs /> */}
            </Modal.Body>
          </Modal>
        </>
      );
    } else {
      return null;
    }
  };
  return <>{renderModal()}</>;
};

const mapStateToProps = (state) => {
  return { conversationState: state.conversationState };
};

export default connect(mapStateToProps, { cleanUpComments, cleanUpTranscripts })(VideoDisplayingModal);
