import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL from 'react-map-gl';

import { Button } from 'semantic-ui-react';
// components
import CallingModal from './CallingModal';
import FullScreen1on1Modal from './Modal/FullScreen1on1Modal';
// import VerticallyCenteredModal from './Modal/VerticallyCenteredModal';
// import FullScreenMeetingModal from './Modal/FullScreenMeetingModal';
import UsersMarker from './UsersMarker';
import MeetingsList from './Meeting/MeetingsList';

// css
import '../styles/worldmap.css';
import '../styles/meeting.css';

// socketio
import { io } from 'socket.io-client';

// action creators
import { loadMeAndUpdateActionCreator } from '../actionCreators/authActionCreators';
import { getUsersActionCreator } from '../actionCreators/usersActionCreator';
import { getMediaActionCreator } from '../actionCreators/mediaActionCreator';
import { listenCallActionCreator } from '../actionCreators/mediaActionCreator';
import { getMeetingsActionCreator } from '../actionCreators/meetingsActionCreator';
import { callActionCreator } from '../actionCreators/mediaActionCreator';

// socket events
import { I_GOT_SOCKET_ID } from '../actionCreators/socketEvents';

// mapbox設定。コメント含めて必要。
import mapboxgl from 'mapbox-gl';
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
const socket = io(process.env.REACT_APP_WEBRTC); // こういう部分全てのcomponentで動いている。これなんかのバグ起こしそうだな。。。

const WorldMap = (props) => {
  // const socket = io(process.env.REACT_APP_WEBRTC); // これまずいね。反省。
  // const socketId = useRef(null);
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  // callした後のcalling modal用
  const [showCallingModal, setShowCallingModal] = useState(false);
  // 1on1 modal用
  const [show1on1, setShow1on1] = useState(false);
  const [fullscreen1on1Modal, setFullscreen1on1Modal] = useState(true);
  // meeting modal用
  // const [showMeeting, setShowMeeting] = useState(false);
  // const [fullScreenMeetingModal, setFullScreenMeetingModal] = useState(true);
  // vertically centered modal用
  // const [verticallyCenteredModal, setVerticallyCenteredModal] = useState(false);

  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
        // socketId.current = socketIdFromServer;
        props.loadMeAndUpdateActionCreator(jwtToken, socketIdFromServer).then(() => {
          props.getUsersActionCreator();
        });
      });
    }
    props.getMediaActionCreator();
    props.listenCallActionCreator(socket, setShowCallingModal);
    props.getMeetingsActionCreator();
  }, []);

  useEffect(() => {
    // CallingModal componentでmodalを閉じてから、callAcceptedをonにしてこれが動く。
    if (props.mediaState.callAccepted) {
      setFullscreen1on1Modal(true);
      setShow1on1(true);
    }
  }, [props.mediaState.callAccepted]);

  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    const mySocketId = props.authState.currentUser.socketId;
    setShowCallingModal(true);
    props.callActionCreator(socket, mySocketId, oppositeSocketId);
  };

  // meeting用のfull screen modalのtrigger
  // const onJoinClick = (meeting) => {
  //   setFullScreenMeetingModal(true);
  //   setShowMeeting(true);
  //   socket.emit(JOIN_MEETING, {
  //     meeting: meeting,
  //     userInfo: props.authState.currentUser,
  //   });
  // };

  return (
    <>
      {/* modals */}
      <CallingModal socket={socket} show={showCallingModal} setShowCallingModal={setShowCallingModal} />
      <FullScreen1on1Modal
        socket={socket}
        show1on1={show1on1}
        setShow1on1={setShow1on1}
        fullscreen1on1Modal={fullscreen1on1Modal}
      />
      {/* <VerticallyCenteredModal
        show={verticallyCenteredModal}
        onHide={() => setVerticallyCenteredModal(false)}
        socket={socket}
      /> */}
      {/* <FullScreenMeetingModal
        socket={socket}
        showMeeting={showMeeting}
        currentUser={props.authState.currentUser}
        mediaVideoStreamObject={props.mediaState.myVideoStreamObject}
        setShowMeeting={setShowMeeting}
        fullScreenMeetingModal={fullScreenMeetingModal}
      /> */}
      {/* modals */}

      <div style={{ height: '100vh', width: '100%' }}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          width='100%'
          height='100vh'
          mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
          onViewportChange={(viewport) => setViewport(viewport)}
        >
          <UsersMarker onCallClick={onCallClick} />
          <MeetingsList
            socket={socket}
            // onJoinClick={onJoinClick}
          />
          <Button
            className='create-meeting-button'
            // onClick={() => setVerticallyCenteredModal(true)}
          >
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
    meetingState: state.meetingState,
    peerState: state.peerState,
  };
};

export default connect(mapStateToProps, {
  loadMeAndUpdateActionCreator,
  getUsersActionCreator,
  getMediaActionCreator,
  listenCallActionCreator,
  getMeetingsActionCreator,
  callActionCreator,
})(WorldMap);
