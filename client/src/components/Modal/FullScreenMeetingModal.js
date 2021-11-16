import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { Modal } from 'react-bootstrap';
import Peer from 'simple-peer';
// socket events
import { JOIN_MEETING } from '../../actionCreators/socketEvents';
import {
  I_GOT_OTHER_USERS_INFO,
  PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS,
  NEW_USER_JOINED,
  // OTHER_USERS_ARE_RETURNING_SIGNAL,
  I_ACCEPT_A_PARTICIPANT_AND_SEND_A_SIGNAL,
  I_GOT_A_RETURN_SIGNAL_FROM_PEER,
} from '../../actionCreators/socketEvents';

import OtherPeersVideo from './OtherPeersVideo';

// おそらく、reduxでglobalなstateを作る必要がある。meetingに関する。meeting listの'enter this meeting!'みたいなbuttonがあると仮定して、それを押すとreduxのactionが起こって、そのmeetingに関するdata（_idを含めたね）が格納されて、そのstateを参照することになるだろうな。このmemoかなり重要だから、覚えておけ。

// modalのtriggerとなるもの（button）は、worldmapにある前提だからね。

const FullScreenMeetingModal = (props) => {
  // peerに関するstateたち
  const [peers, setPeers] = useState([]);
  const myVideoRef = useRef();
  const peersRef = useRef([]); // 最終的に、電話かけた側がsignalを確約するために使う。

  useEffect(() => {
    // const meetingId = props.meetingState._id
    // if (props.mediaState) {
    // ここのif statementはまた後で考えよう。多分だけど、ifで囲っているとしかとされる可能性がある。

    // myVideoRef.current.srcObject = props.mediaState.myVideoStreamObject; //相変わらず、

    // 少なくとも、ここでemitしてはいけないな。joinを押した後に、このeventをemitすべきですね。
    // props.socket.emit(JOIN_MEETING, { meetingId, userInfo: props.authState.currentUser }); // 今回の俺のappの場合は、roomIdだけではなくuserの情報も必要だ。

    props.socket.on(I_GOT_OTHER_USERS_INFO, (usersInThisMeetingExceptParticipant) => {
      const currentUser = store.getState().authState.currentUser;
      const myVideoStreamObject = store.getState().mediaState.myVideoStreamObject;
      // console.log(currentUser);
      // console.log(myVideoStreamObject);
      myVideoRef.current.srcObject = myVideoStreamObject; // このためにも、videoのcomponentを作っておかないとね。ここなら大丈夫だと、思いたい。
      // console.log(props.authState.currentUser); // なんでここがnullになるんだ？？
      const peersContainer = [];
      // console.log(usersInThisMeetingExceptParticipant);
      usersInThisMeetingExceptParticipant.forEach((user) => {
        // それぞれのuserへのpeerを作る。
        console.log('yesss sendiiiing...'); // ここに関しては一回しか実行されていない。ちゃんと。おそらく、↓のpeer.on()の部分に何かが。
        // const peer = new Peer({ initiator: true, trickle: true, stream: props.mediaState.myVideoStreamObject });
        // peer.on('signal', (signalData) => {
        //   props.socket.emit(PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS, {
        //     signalData,
        //     // mySocketId: props.authState.currentUser.socketId, これ、多分いらない。
        //     oppositeUserInfo: user,
        //     // callerUserInfo: props.authState.currentUser,
        //     callerUserInfo: currentUser,
        //   });
        // });
        const peer = createPeer(user, currentUser, myVideoStreamObject, props.socket); // 関数作るだけで挙動が全くちげー。なんだこれ。。。videoもparticipantじゃない方に複数表示されるようになったし。

        peersRef.current.push({ userInfo: user, peer: peer }); // 最終的にこのpeerとの通信を確約しなきゃだからね。これが必要。
        peersContainer.push(peer);
      });
      setPeers(peersContainer);
    });

    // ここがなぜか5回おきる謎現象。。。ここは別に一回であるはずなんですよ。server側で何が起きているか見ようか。
    // 上で関数化することで謎の5回現象を消せたが、participant側には、既にいたpeerのvideoが表示されていなかった。多分、emitがうまく出来ていない。
    props.socket.on(NEW_USER_JOINED, (dataFromServer) => {
      console.log('new user part working??');
      const peerInfo = store.getState().authState.currentUser;
      const myVideoStreamObject = store.getState().mediaState.myVideoStreamObject;
      const peer = new Peer({ initiator: false, trickle: false, stream: myVideoStreamObject });
      peer.on('signal', (signalData) => {
        props.socket.emit(I_ACCEPT_A_PARTICIPANT_AND_SEND_A_SIGNAL, {
          signalData,
          callerUserInfo: dataFromServer.callerUserInfo, //ここに加えて、部屋の中の誰がacceptしたのか、その情報も送らないといけないな。
          peerInfo: peerInfo, // ここだめですねー。。
        });
      });
      peer.signal(dataFromServer.signalData);
      peersRef.current.push({
        userInfo: dataFromServer.callerUserInfo,
        peer: peer,
      });
      setPeers((users) => [...users, peer]);
    });

    // 次はここ。
    props.socket.on(I_GOT_A_RETURN_SIGNAL_FROM_PEER, (dataFromServer) => {
      const element = peersRef.current.find((p) => p.userInfo.socketId === dataFromServer.peerInfo.socketId);
      console.log(element);
      element.peer.signal(dataFromServer.signalData);
      peers.forEach((peer) => {
        peer.on('stream', (stream) => {});
      });
    });
    // }
  }, []);

  // なんで関数にすると動くようになったんだろね。。。
  const createPeer = (oppositeUser, currentUser, stream, socket) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (signalData) => {
      socket.emit(PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS, {
        signalData,
        oppositeUserInfo: oppositeUser,
        callerUserInfo: currentUser,
      });
    });
    return peer;
  };

  const peersVideoRender = () => {
    const videos = peers.map((peer) => {
      return <OtherPeersVideo peer={peer} />;
    });
    return <>{videos}</>;
  };

  console.log(peersRef);

  return (
    <>
      <Modal
        show={props.showMeeting}
        fullscreen={props.fullScreenMeetingModal}
        onHide={() => props.setShowMeeting(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <video playsInline muted ref={myVideoRef} autoPlay />
          {peersVideoRender()}
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, authState: state.authState, meetingState: state.meetingState };
};

export default connect(mapStateToProps)(FullScreenMeetingModal);
