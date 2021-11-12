import React from 'react';
import { Modal } from 'react-bootstrap';

import CreateMeetingForm from '../Meeting/CreateMeetingForm';

const VerticallyCenteredModal = (props) => {
  return (
    <Modal {...props} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <CreateMeetingForm socket={props.socket} onHide={props.onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default VerticallyCenteredModal;
