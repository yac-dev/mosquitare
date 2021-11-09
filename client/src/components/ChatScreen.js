import React, { useEffect, useState, useRef } from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

import { connect } from 'react-redux';

const ChatScreen = (props) => {
  const [open, setOpen] = useState(false);

  let myVideo = useRef();
  let oppositeVideo = useRef();
  const connectionRef = useRef();
  // console.log(props.location.state);
  // myVideo.current.srcObject = props.mediaState.myVideoStreamObject;
  // myVideo = props.location.state[0];
  // myVideo.current.srcObject = 0;

  // oppositeVideo = props.location.state[1];
  // oppositeVideo.current.srcObject = 0;

  useEffect(() => {
    myVideo.current.srcObject = props.mediaState.myVideoStreamObject;
  }, []);

  return (
    <>
      <div className='video-container'>
        <div className='video'>
          <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
          {/* <div>{props.mediaState.mySocketId}</div> */}
        </div>
        <div className='video'>
          <video playsInline ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
        </div>
      </div>
      <label>Opposite ID to call</label>
      <input
      // value={oppositeSocketId}
      //  onChange={(e) => setOppositeSocketId(e.target.value)}
      />
      <button
      // onClick={() => props.callActionCreator(socket, Peer, oppositeSocketId, oppositeVideo, connectionRef)}
      >
        Call
      </button>
      <div>
        <div className='caller'>
          <h1>Someone is calling...</h1>
          <button>Answer</button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, {})(ChatScreen);
