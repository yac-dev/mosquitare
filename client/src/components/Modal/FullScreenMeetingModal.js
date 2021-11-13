import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
// socket events
import { JOIN_MEETING } from '../../actionCreators/socketEvents';

// おそらく、reduxでglobalなstateを作る必要がある。meetingに関する。meeting listの'enter this meeting!'みたいなbuttonがあると仮定して、それを押すとreduxのactionが起こって、そのmeetingに関するdata（_idを含めたね）が格納されて、そのstateを参照することになるだろうな。このmemoかなり重要だから、覚えておけ。

// modalのtriggerとなるもの（button）は、worldmapにある前提だからね。

const FullScreenMeetingModal = (props) => {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const myVideoRef = useRef();
  const peersRef = useRef([]);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint); // ここのargumentは、trueになるだろね。
    setShow(true);
  }

  useEffect(() => {
    // const meetingId = props.meetingState._id
    const meetingId = 1;
    if (props.mediaState) {
      myVideoRef.current.srcObject = props.mediaState.myVideoStreamObject;
      // meeting room のidは、reduxのglobal stateからとってくることにするよ。
      props.socket.emit(JOIN_MEETING, { meetingId, userInfo: props.authState.currentUser }); // 今回の俺のappの場合は、roomIdだけではなくuserの情報も必要だ。
    }
  }, []);

  return (
    <>
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal body content</Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, authState: state.authState };
};

export default connect(mapStateToProps)(FullScreenMeetingModal);
