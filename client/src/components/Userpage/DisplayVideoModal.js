import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DisplayVideo from './DisplayVideo';
import ResourceTabs from './ResourceTabs';

const VideoDisplayingModal = (props) => {
  return (
    <>
      <Modal
        show={props.showVideoDisplayingModal}
        onHide={() => props.setShowVideoDisplayingModal(false)}
        backdrop='static'
        keyboard={false}
        dialogClassName={'video-displaying-modal'}
      >
        <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 55, 110' }}>
          {/* <Modal.Title>With Jonh!!</Modal.Title> */}
        </Modal.Header>
        <Modal.Body bsPrefix='video-displaying-modal-body'>
          <DisplayVideo conversation={props.conversation} />
          <ResourceTabs />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VideoDisplayingModal;
