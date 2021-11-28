import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReviewForm from '../ReviewForm';

const ReviewModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        Launch static backdrop modal
      </Button>

      <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
        <Modal.Header>
          <Modal.Title>Leave the review!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewForm />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReviewModal;
