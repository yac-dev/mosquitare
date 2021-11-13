import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

const FullScreen1on1Modal = (props) => {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  // 「videoRef、oppositeVideoRef, onHangUpClick, switchRender」　をworldmapからprops使って、このcomponentに渡す。
  return (
    <Modal
      className='chat-modal'
      show={show}
      fullscreen={fullscreen}
      onHide={() => setShow(false)}
      style={{ backgroundColor: 'blue' }}
    >
      <Modal.Body style={{ backgroundColor: 'rgb(8, 18, 23)' }}>
        {props.switchRender()}
        <div className='video-container'>
          <div className='video' style={{ marginTop: '100px' }}>
            <video playsInline muted ref={props.myVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
            <video playsInline ref={props.oppositeVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
          </div>
        </div>
        {props.mediaState.callAccepted ? (
          <div className='button-wrapper'>
            <Button negative className='hang-up-button' onClick={() => props.onHangUpClick()}>
              Hang up
            </Button>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default FullScreen1on1Modal;
