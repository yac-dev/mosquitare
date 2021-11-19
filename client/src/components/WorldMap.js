import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
// components
import '../styles/worldmap.css';
import '../styles/meeting.css';
import Dimer from './Dimer'; //ここ必要ないかな。
import ConfirmationCard from './ConfirmationCard'; // ここも必要なくなるかな。
import MeetingsList from './Meeting/MeetingsList';
import FullScreen1on1Modal from './Modal/FullScreen1on1Modal';
import VerticallyCenteredModal from './Modal/VerticallyCenteredModal';
import FullScreenMeetingModal from './Modal/FullScreenMeetingModal';

// socketio
import { io } from 'socket.io-client';

// action creators
import { loadMeAndUpdateActionCreator } from '../actionCreators/authActionCreators';
import { getMediaActionCreator } from '../actionCreators/mediaActionCreator';
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { listenCallActionCreator } from '../actionCreators/mediaActionCreator';
import { answerCallActionCreator } from '../actionCreators/mediaActionCreator';
import { hangUpCallActionCreator } from '../actionCreators/mediaActionCreator';
import { updateUserConversationStateActionCreator } from '../actionCreators/authActionCreators';
import { getUsersActionCreator } from '../actionCreators/usersActionCreator';
import { getMeetingsActionCreator } from '../actionCreators/meetingsActionCreator';

// socket events
import { I_GOT_SOCKET_ID } from '../actionCreators/socketEvents';
import { SOMEBODY_CALLS_ME } from '../actionCreators/socketEvents';
import { JOIN_MEETING } from '../actionCreators/socketEvents';
// actions
import { LISTEN_CALL } from '../actionCreators/type';
import { GET_MEDIA } from '../actionCreators/type';
import store from '../store';

// socket 設定
const socket = io(process.env.REACT_APP_WEBRTC);

// speech recognition 設定
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphone = new SpeechRecognition();
microphone.continuous = true;
microphone.interimResults = true;
microphone.lang = 'en-US';

const WorldMap = (props) => {
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  const myVideo = useRef();
  const oppositeVideo = useRef();
  const connectionRef = useRef();
  // full screen modal用 propsで、stateを渡そうかな。。。
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  // まずこれで実験しよう。
  const [show1on1, setShow1on1] = useState(false);
  const [fullscreen1on1Modal, setFullscreen1on1Modal] = useState(true);
  // vertically centered modal用
  const [verticallyCenteredModal, setVerticallyCenteredModal] = useState(false);

  // meeting modal用のstate これをlistに持たせるしかない。
  const [fullScreenMeetingModal, setFullScreenMeetingModal] = useState(true);
  const [showMeeting, setShowMeeting] = useState(false);
  // const [isSpeechMicrophoneListenning, setIsSpeechMicrophoneListenning] = useState(false);
  // const [subtitles, setSubtitles] = useState(null); sppeche recognition機能は後にしよう。今は無理。

  // const socket = io(process.env.REACT_APP_WEBRTC); // これまずいね。反省。
  // const socketId = useRef(null);

  // ここで始めて、meeting用のfull screen modalがrenderされる。
  const onJoinClick = (meeting) => {
    // これらの前に、meetingListで、joinMeetingActionCreator(meeting)が行われているからね。だから↓、大丈夫。→それが違うんだわ。meetingのstate自体はすぐに変わってくれないんだわ。
    setFullScreenMeetingModal(true);
    setShowMeeting(true);
    socket.emit(JOIN_MEETING, {
      meeting: meeting,
      userInfo: props.authState.currentUser,
    });
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    // useEffectを使っているから、っていう理由はそんなだよね。純粋に、signaling serverからのsocket onを複数回聴いちゃっているんだよな。。。なんでだろ。。。
    if (jwtToken) {
      socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
        // socketId.current = socketIdFromServer;
        props.loadMeAndUpdateActionCreator(jwtToken, socketIdFromServer);
      });
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      store.dispatch({
        type: GET_MEDIA,
        payload: stream,
      });
      // setMyVideoStreamObject(stream);
      // myVideoRef.current.srcObject = stream; // ここなーーー。どうだろう。// chatscreenの方でuseEffectすればいいのかね。。。ここだけ。
    });

    socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
      console.log('somebody calls me!!!');
      console.log(dataFromServer);
      const { signalData, whoIsCalling, callerUserInfo } = dataFromServer;
      console.log(signalData, whoIsCalling);
      // setFullscreen(true);
      // setShow(true);
      setFullscreen1on1Modal(true);
      setShow1on1(true);
      // myVideo.current.srcObject = myVideoStreamObject;
      store.dispatch({
        type: LISTEN_CALL,
        payload: { signalData, whoIsCalling, callerUserInfo },
      });
    });

    props.getMeetingsActionCreator();
  }, []);

  const usersMarkerRender = () => {
    if (props.usersState) {
      const usersRender = props.usersState.map((user) => {
        if (user.isOnline && !user.isInConversation) {
          return (
            <>
              <Marker
                longitude={user.location.coordinates[0]}
                latitude={user.location.coordinates[1]}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Popup
                  trigger={<Icon className='green user icon' size='large' style={{ cursor: 'pointer' }} />}
                  flowing
                  hoverable
                >
                  <ConfirmationCard callback={onCallClick} socketId={user.socketId} user={user} />
                </Popup>
              </Marker>
            </>
          );
        }
      });
      return <>{usersRender}</>;
    } else {
      return null;
    }
  };

  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    console.log(oppositeSocketId);
    const mySocketId = props.authState.currentUser.socketId;
    setFullscreen1on1Modal(true);
    setShow1on1(true); // ここでtriggerすることで、1on1のchild componentにそれを伝えると。

    // setFullscreen(true); // ここと
    // setShow(true); // ここを変えるべきであろう。
    // myVideo.current.srcObject = props.mediaState.myVideoStreamObject; // ここだとエラーになるんだ。
    props.callActionCreator(socket, mySocketId, myVideo, oppositeSocketId, oppositeVideo, connectionRef);
  };

  const switchRender = () => {
    if (props.mediaState.callAccepted) {
      return null;
    } else {
      if (props.mediaState.amICalling) {
        return <Dimer />;
      } else if (props.mediaState.amIRecieving) {
        return (
          <ConfirmationCard
            user={props.mediaState.callingWith}
            callback={props.answerCallActionCreator}
            socket={socket}
            myVideo={myVideo}
            oppositeVideo={oppositeVideo}
            connectionRef={connectionRef}
          />
        );
      } else {
        return null;
      }
    }
  };

  const onHangUpClick = () => {
    props.hangUpCallActionCreator(connectionRef);
    // setShow(false);
    setShow1on1(false); // これをfull1on1でやってもらおう。propsで渡して。
  };

  return (
    <>
      {/* <Modal
        className='chat-modal'
        show={show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
        style={{ backgroundColor: 'blue' }}
      >
        <Modal.Body style={{ backgroundColor: 'rgb(8, 18, 23)' }}>
          {switchRender()}
          <div className='video-container'>
            <div className='video' style={{ marginTop: '100px' }}>
              <video playsInline muted ref={myVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
              <video playsInline ref={oppositeVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
            </div>
          </div>
          {props.mediaState.callAccepted ? (
            <div className='button-wrapper'>
              <Button negative className='hang-up-button' onClick={() => onHangUpClick()}>
                Hang up
              </Button>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>{' '} */}
      <FullScreen1on1Modal
        socket={socket}
        show1on1={show1on1}
        setShow1on1={setShow1on1} // これいらないかもな。
        fullscreen1on1Modal={fullscreen1on1Modal}
        onHangUpClick={onHangUpClick}
        myVideo={myVideo}
        oppositeVideo={oppositeVideo}
        connectionRef={connectionRef}
      />
      <FullScreenMeetingModal
        socket={socket}
        showMeeting={showMeeting}
        currentUser={props.authState.currentUser}
        mediaVideoStreamObject={props.mediaState.myVideoStreamObject}
        setShowMeeting={setShowMeeting}
        fullScreenMeetingModal={fullScreenMeetingModal}
      />
      <VerticallyCenteredModal
        show={verticallyCenteredModal}
        onHide={() => setVerticallyCenteredModal(false)}
        socket={socket}
      />
      <div style={{ height: '100vh', width: '100%' }}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          width='100%'
          height='100vh'
          mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
          onViewportChange={(viewport) => setViewport(viewport)}
        >
          {usersMarkerRender()}
          <MeetingsList socket={socket} onJoinClick={onJoinClick} />
          <Button className='create-meeting-button' onClick={() => setVerticallyCenteredModal(true)}>
            Create new meeting??
          </Button>
        </ReactMapGL>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authState: state.authState,
    mediaState: state.mediaState,
    usersState: Object.values(state.usersState),
    // meetingsState: state.meetingsState,
    meetingState: state.meetingState,
  };
};

export default connect(mapStateToProps, {
  // loadPositionActionCreator,
  getMediaActionCreator,
  // getSocketIdActionCreator,
  listenCallActionCreator,
  callActionCreator,
  answerCallActionCreator,
  getUsersActionCreator,
  loadMeAndUpdateActionCreator,
  hangUpCallActionCreator,
  // updateUserConversationStateActionCreator // ここでやるのはよそう。actionの順番がごちゃごちゃになる。
  getMeetingsActionCreator,
})(WorldMap);
