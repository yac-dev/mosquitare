import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';
// import { Modal } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
// components
import '../styles/worldmap.css';
import '../styles/meeting.css';
import Dimer from './Dimer'; //ここ必要ないかな。
import ConfirmationCard from './ConfirmationCard'; // ここも必要なくなるかな。
import UserInfoCard from './UserInfoCard';
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

  // popup用
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // 1on1 modal用
  const [show1on1, setShow1on1] = useState(false);
  const [fullscreen1on1Modal, setFullscreen1on1Modal] = useState(true);
  // meeting modal用
  const [fullScreenMeetingModal, setFullScreenMeetingModal] = useState(true);
  const [showMeeting, setShowMeeting] = useState(false);
  // vertically centered modal用
  const [verticallyCenteredModal, setVerticallyCenteredModal] = useState(false);

  // const socket = io(process.env.REACT_APP_WEBRTC); // これまずいね。反省。
  // const socketId = useRef(null);

  // meeting用のfull screen modalのtrigger
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
                  trigger={
                    <Icon
                      className='green user icon'
                      size='large'
                      style={{ cursor: 'pointer' }}
                      // onMouseOver={() => setIsPopupOpen(true)}
                      // onMouseLeave={() => setIsPopupOpen(false)}
                    />
                  }
                  // flowing
                  hoverable
                  // on='click'
                  // open={isPopupOpen}
                  // onOpen={() => setIsPopupOpen(true)} ここまじで分かんね。。。。。
                >
                  {/* <ConfirmationCard callback={onCallClick} socketId={user.socketId} user={user} /> */}
                  <UserInfoCard user={user} />
                  <Button positive onClick={(event) => onCallClick(event, user.socketId)} style={{ width: '100%' }}>
                    <i className='video icon'>call</i>
                  </Button>
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

  // 1on1 modalのtrigger
  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    console.log(oppositeSocketId);
    const mySocketId = props.authState.currentUser.socketId;
    setFullscreen1on1Modal(true);
    setShow1on1(true);
    // setIsPopupOpen(false); // 消えねー。
    // myVideo.current.srcObject = props.mediaState.myVideoStreamObject; // ここだとエラーになるんだ。
    props.callActionCreator(socket, mySocketId, myVideo, oppositeSocketId, oppositeVideo, connectionRef);
  };

  // 1on1 modalで実行してもらうcallback
  const onHangUpClick = () => {
    props.hangUpCallActionCreator(connectionRef);
    setShow1on1(false);
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
