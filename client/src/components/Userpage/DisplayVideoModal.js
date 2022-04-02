import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DisplayVideo from './DisplayVideo';
import ResourceTabs from './ResourceTabs';

// mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

const VideoDisplayingModal = (props) => {
  return (
    <>
      <Modal
        show={props.showVideoDisplayingModal}
        onHide={() => props.setShowVideoDisplayingModal(false)}
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
              <Avatar alt={props.conversation.users[0]} />
              <Avatar alt={props.conversation.users[1]} />
            </Stack>
            <div className='conversation-video-close-button' onClick={() => props.setShowVideoDisplayingModal(false)}>
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
};

export default VideoDisplayingModal;
