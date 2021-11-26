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
import UsersMarker from './UsersMarker';
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
import { updateUserStreamActionCreator } from '../actionCreators/videoChatActionCreators';

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

  const [chunks, setChunks] = useState([]);
  const mediaRecorder = useRef();
  let chunksBuffer = [];

  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
        // socketId.current = socketIdFromServer;
        props.loadMeAndUpdateActionCreator(jwtToken, socketIdFromServer);
      });
    }

    props.getMediaActionCreator();
    props.listenCallActionCreator(socket, setFullscreen1on1Modal, setShow1on1);
    props.getMeetingsActionCreator();
  }, []);

  // 1on1 modalのtrigger
  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    console.log(oppositeSocketId);
    const mySocketId = props.authState.currentUser.socketId;
    setFullscreen1on1Modal(true);
    setShow1on1(true);
    // setIsPopupOpen(false); // 消えねー。
    // myVideo.current.srcObject = props.mediaState.myVideoStreamObject; // ここだとエラーになるんだ。
    const { myVideoStreamObject } = props.mediaState;
    mediaRecorder.current = new MediaRecorder(myVideoStreamObject);
    mediaRecorder.current.ondataavailable = function (event) {
      console.log('ondataavai');
      console.log(event.data); // ここにはちゃんとdataが入っている。
      // setChunks((oldChunks) => {
      //   return [...oldChunks, event.data];
      // });
      chunksBuffer.push(event.data);
    };
    mediaRecorder.current.onstop = (event) => {
      console.log(chunks);
      let blob = new Blob(chunksBuffer, { type: 'video/mp4;' }); // blob自体は、object。
      // ここでmp4のdataが作られたらこれをmongoとs3に保存していくapi requestをすることだ。
      // chunks = [];
      chunksBuffer = [];
      props.updateUserStreamActionCreator(blob, connectionRef);
      // setChunks([]); // arrayを空にするのってどうやるんだっけ？？
      // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
    }; // これ自体、asyncな動きをしている、おそらく。だからhangupcallが先に動いちゃっている。

    props.callActionCreator(
      socket,
      mySocketId,
      myVideo,
      oppositeSocketId,
      oppositeVideo,
      connectionRef,
      mediaRecorder.current
    );
  };

  // 1on1 modalで実行してもらうcallback.modalのstate変えるからここに書いている。
  // ここにmediarecorderのinstanceを入れる前提だな。
  const onHangUpClick = () => {
    // mediaRecorder.current.onstop = (event) => {
    //   let blob = new Blob(chunks, { type: 'video/mp4;' }); // blob自体は、object。
    //   // ここでmp4のdataが作られたらこれをmongoとs3に保存していくapi requestをすることだ。
    //   // chunks = [];
    //   console.log(blob);
    //   props.updateUserStreamActionCreator(blob);
    //   // setChunks([]); // arrayを空にするのってどうやるんだっけ？？
    //   // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
    // };
    mediaRecorder.current.stop();
    // props.hangUpCallActionCreator(connectionRef); // これ自体、updateStreamの下にやらないとダメだ。それか、向こうをpromisifyするか。
    setShow1on1(false);
  };

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

  return (
    <>
      {/* modals */}
      <FullScreen1on1Modal
        socket={socket}
        show1on1={show1on1}
        setShow1on1={setShow1on1}
        fullscreen1on1Modal={fullscreen1on1Modal}
        onHangUpClick={onHangUpClick}
        myVideo={myVideo}
        oppositeVideo={oppositeVideo}
        connectionRef={connectionRef}
        mediaRecorder={mediaRecorder}
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
          {/* {usersMarkerRender()} */}
          <UsersMarker onCallClick={onCallClick} />
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
  listenCallActionCreator,
  callActionCreator,
  answerCallActionCreator,
  getUsersActionCreator,
  loadMeAndUpdateActionCreator,
  hangUpCallActionCreator,
  // updateUserConversationStateActionCreator // ここでやるのはよそう。actionの順番がごちゃごちゃになる。
  getMeetingsActionCreator,
  updateUserStreamActionCreator,
})(WorldMap);
