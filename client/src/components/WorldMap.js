import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
// components
import '../styles/worldmap.css';
import '../styles/meeting.css';
import Dimer from './Dimer';
import ConfirmationCard from './ConfirmationCard';
import MeetingsList from './Meeting/MeetingsList';
import VerticallyCenteredModal from './Modal/VerticallyCenteredModal';

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

  // full screen modal用
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  // vertically centered modal用
  const [verticallyCenteredModal, setVerticallyCenteredModal] = useState(false);

  const [meetingForm, setMeetingForm] = useState(false);

  const [isSpeechMicrophoneListenning, setIsSpeechMicrophoneListenning] = useState(false);
  const [subtitles, setSubtitles] = useState(null);

  // const socket = io(process.env.REACT_APP_WEBRTC); // これまずいね。反省。
  // const socketId = useRef(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');

    if (jwtToken) {
      console.log('worldmap side');
      socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
        console.log('check if it works after signup');
        // socketId.current = socketIdFromServer;
        props.loadMeAndUpdateActionCreator(jwtToken, socketIdFromServer);
      });
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      console.log('media side');
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
      setFullscreen(true);
      setShow(true);
      // myVideo.current.srcObject = myVideoStreamObject;
      store.dispatch({
        type: LISTEN_CALL,
        payload: { signalData, whoIsCalling, callerUserInfo },
      });
    });

    props.getMeetingsActionCreator();
  }, []);

  // useEffect(() => {
  //   const updateUsersStatecontinuously = setTimeout(() => {
  //     props.getUsersActionCreator()
  //   }, 7000)
  // }, []); // ここにusersのstateが入ることになるだろね。setIntervalを使うかな。ここは。

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
    setFullscreen(true);
    setShow(true);
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
    setShow(false);
  };

  // const renderCreateRoomForm = () => {
  //   if (meetingForm) {
  //     return <CreateMeetingForm />;
  //   } else {
  //     return null;
  //   }
  // };

  // const renderMeetingList = () => {
  //   // まずreducerを作ろうか。
  //   if (props.meetingsState) {
  //     const meetingsList = props.meetingsState.map((meeting) => {
  //       return <div>{meeting.title}</div>;
  //     });

  //     return <>{meetingsList}</>;
  //   }
  // };

  return (
    <>
      <Modal
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
      </Modal>

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
          {/* {CreateMeetingButton()} */}
          {/* {renderCreateRoomForm()} */}
          <MeetingsList socket={socket} />
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
