import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import Peer from 'simple-peer';
// socket events
import { JOIN_MEETING } from '../../actionCreators/socketEvents';
import {
  I_GOT_OTHER_USERS_INFO,
  PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS,
  NEW_USER_JOINED,
} from '../../actionCreators/socketEvents';

// おそらく、reduxでglobalなstateを作る必要がある。meetingに関する。meeting listの'enter this meeting!'みたいなbuttonがあると仮定して、それを押すとreduxのactionが起こって、そのmeetingに関するdata（_idを含めたね）が格納されて、そのstateを参照することになるだろうな。このmemoかなり重要だから、覚えておけ。

// modalのtriggerとなるもの（button）は、worldmapにある前提だからね。

const FullScreenMeetingModal = (props) => {
  // modal そのものに関するstateたち
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  // peerに関するstateたち
  const [peers, setPeers] = useState([]);
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
      // ここのif statementはまた後で考えよう。多分だけど、ifで囲っているとしかとされる可能性がある。
      myVideoRef.current.srcObject = props.mediaState.myVideoStreamObject;

      // meeting room のidは、reduxのglobal stateからとってくることにするよ。
      props.socket.emit(JOIN_MEETING, { meetingId, userInfo: props.authState.currentUser }); // 今回の俺のappの場合は、roomIdだけではなくuserの情報も必要だ。

      props.socket.on(I_GOT_OTHER_USERS_INFO, (usersInTMeeting) => {
        const peersContainer = [];
        usersInTMeeting.forEach((user) => {
          // それぞれのuserへのpeerを作る。
          const peer = new Peer({ initiator: true, trickle: true, stream: props.mediaState.myVideoStreamObject });
          peer.on('signal', (signalData) => {
            props.socket.emit(PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS, {
              signalData,
              mySocketId: props.authState.currentUser.socketId,
              oppositeUserId: user.socketId,
              callerUserInfo: props.authState.currentUser,
            });
          });

          peersRef.current.push({ user, peer });
          peersContainer.push(peer);
        });
        setPeers(peersContainer);
      });

      props.socket.on(NEW_USER_JOINED, (dataFromServer) => {
        const peer = new Peer({ initiator: false, trickle: false, stream: props.mediaState.myVideoStreamObject });
      });
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
