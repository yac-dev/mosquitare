import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { closeVideoActionCreator } from '../actionCreators/conversationActionCreators';
import '../styles/selectedVideo.css';

const SelectedVideoModal = (props) => {
  const onClose = () => {
    closeVideoActionCreator();
    props.setShowVideoModal(false);
  };

  const renderModal = () => {
    if (props.selectedVideoState.video) {
      return (
        <Modal
          show={props.showVideoModal}
          onHide={() => props.setShowVideoModal(false)}
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 55, 110' }}></Modal.Header>
          <Modal.Body bsPrefix='select-video'>
            <button onClick={() => onClose()}>Close</button>
            <video playsInline controls width='300'>
              <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.selectedVideoState.video.videoFilename}`} />
            </video>
          </Modal.Body>
        </Modal>
      );
    }
  };

  return (
    <>
      {/* <Modal
          show={props.showVideoModal}
          onHide={() => props.setShowVideoModal(false)}
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 55, 110' }}></Modal.Header>
          <Modal.Body bsPrefix='select-video'>
            <button onClick={() => onClose()}>Close</button>
            <video playsInline controls width='300'>
              <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.selectedVideoState.video.videoFilename}`} />
            </video>
          </Modal.Body>
        </Modal> */}

      <Modal
        show={props.showVideoModal}
        onHide={() => props.setShowVideoModal(false)}
        backdrop='static'
        keyboard={false}
        dialogClassName={'video-displaying-modal'}
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 55, 110' }}></Modal.Header>
        <Modal.Body>
          <div className='modal-inner-wrapper'>
            <video playsInline controls style={{ width: '100%' }}>
              <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.selectedVideoState.video.videoFilename}`} />
            </video>
          </div>
        </Modal.Body>
      </Modal>
      {/* <Modal
        show={props.showVideoModal}
        onHide={() => props.setShowVideoModal(false)}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton style={{ backgroundColor: 'rgb(0, 55, 110' }}></Modal.Header>
        <Modal.Body bsPrefix='select-video'>
          <button onClick={() => onClose()}>Close</button>
          <video playsInline controls width='300'>
            <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.selectedVideoState.video.videoFilename}`} />
          </video>
        </Modal.Body>
      </Modal> */}
    </>
  );
};

const mapStateToProps = (state) => {
  return { selectedVideoState: state.selectedVideoState };
};

export default connect(mapStateToProps, { closeVideoActionCreator })(SelectedVideoModal);
