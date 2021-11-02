import React from 'react';
import './ModalChat.css';

import { connect } from 'react-redux';

const ModalChat = (props) => {
  return (
    <div className='modalBackground'>
      <div className='modalContainer'>
        <div className='titleCloseBtn'>
          <button
            onClick={() => {
              props.setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className='video-container'>
          <div className='video'>
            <video playsInline muted ref={props.myVideo} autoPlay style={{ width: '300px' }} />
            <div>{props.mediaState.mySocketId}</div>
          </div>
          <div className='video'>
            <video playsInline ref={props.oppositeVideo} autoPlay style={{ width: '300px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps)(ModalChat);
