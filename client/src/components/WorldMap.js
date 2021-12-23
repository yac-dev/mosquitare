import React, { useRef, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
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
// こっから

// socketio
import { io } from 'socket.io-client';

// action creators
import { loadMeAndUpdateActionCreator } from '../actionCreators/authActionCreators';
import { getMediaActionCreator } from '../actionCreators/mediaActionCreator';
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { completeConnectionWithMyPartnerActionCreator } from '../actionCreators/mediaActionCreator';
import { startMediaRecorder } from '../actionCreators/mediaActionCreator';
import { createConversationActionCreator } from '../actionCreators/conversationActionCreators';
import { createIntegratedUserMediaActionCreator } from '../actionCreators/integratedUserMediasActionCreators';
import { sendIntegratedUserMediaActionCeator } from '../actionCreators/integratedUserMediasActionCreators';
import { updateConversationIntegratedUserMediaActionCreator } from '../actionCreators/integratedUserMediasActionCreators';

import { listenCallActionCreator } from '../actionCreators/mediaActionCreator';
import { answerCallActionCreator } from '../actionCreators/mediaActionCreator';
import { hangUpCallActionCreator } from '../actionCreators/mediaActionCreator';
import { updateUserConversationStateActionCreator } from '../actionCreators/authActionCreators';
import { getUsersActionCreator } from '../actionCreators/usersActionCreator';
import { getMeetingsActionCreator } from '../actionCreators/meetingsActionCreator';
import { updateUserStreamActionCreator } from '../actionCreators/conversationActionCreators';

import { createUserMedia } from '../actionCreators/userMediasActionCreators';
//
import { updateUserConversationToFalseActionCreator } from '../actionCreators/authActionCreators';

// socket events
import { I_GOT_SOCKET_ID } from '../actionCreators/socketEvents';
import { SOMEBODY_CALLS_ME } from '../actionCreators/socketEvents';
import { JOIN_MEETING } from '../actionCreators/socketEvents';
// actions
import { LISTEN_CALL } from '../actionCreators/type';
import { GET_MEDIA } from '../actionCreators/type';
import store from '../store';
import mapboxgl from 'mapbox-gl';
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

// socket 設定
console.log('hello from worldmap');
const socket = io(process.env.REACT_APP_WEBRTC); // こういう部分全てのcomponentで動いている。これなんかのバグ起こしそうだな。。。

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
  const [learningLanguageScript, setLearningLanguageScript] = useState('');
  const [nativeLanguageScript, setNativeLanguageScript] = useState(''); // 何でここかっていうと、getMediaでのonstopにこのlanguage scriptを含めたいから。ここのgetMediaにlearningScript, nativeScript両方とも入れておかないといかん。

  const [chunks, setChunks] = useState([]);
  const mediaRecorder = useRef();
  // const mediaState = useSelector((state) => state.mediaState);
  const [chunksForVideo, setChunksForVideo] = useState([]);
  const [chunksForAudio, setChunksForAudio] = useState([]);
  // let chunksForVideo = []; // ここの二つ、別にuseRefううよ。
  // let chunksForAudio = [];

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

    props.getMediaActionCreator(
      mediaRecorder,
      chunksForVideo,
      chunksForAudio,
      // learningLanguageScript,
      // nativeLanguageScript,
      setChunksForVideo,
      setChunksForAudio,
      connectionRef
    );
    props.listenCallActionCreator(socket, setFullscreen1on1Modal, setShow1on1);
    props.getMeetingsActionCreator();

    // このacは分解して、socket.onで始めたほうがいい。
    props.completeConnectionWithMyPartnerActionCreator(
      socket,
      props.peerState.peerInitiator,
      myVideo,
      oppositeVideo,
      connectionRef,
      mediaRecorder
    ); // これもいい学習だな。
    // .then(() => {
    //   return props.updateUserConversationStateActionCreator();
    // })
    // .then(() => {
    //   return props.startMediaRecorder(mediaRecorder);
    // })
    // .then(() => {
    //   return props.createConversationActionCreator(socket); // 多分ここも分けることになる。
    // })
    // .then(() => {
    //   return props.createIntegratedUserMediaActionCreator();
    // })
    // .then(() => {
    //   return props.sendIntegratedUserMediaActionCeator(socket);
    // })
    // .then(() => {
    //   return props.updateConversationIntegratedUserMediaActionCreator();
    // });
  }, []);

  // useEffect(() => {
  //   // つまりここから分かる通り、最初のrender後の時点ではまだauthStateはつあうことができない状態。
  //   // こうすれば上手くいく。結局、最初にcomponentが「全部renderされた後」に上のuseEffectの中のapi requestが起こり、authStateの中身が埋まる。そのpropsが変化した時に、このuseEffectを実行する、って言うことができるわけよ。何も複雑なことはない。
  //   if (props.authState.currentUser) {
  //     console.log(props.authState);
  //   }
  //   // console.log(props.mediaState)
  // }, [props.authState]);

  // 1on1 modalのtrigger
  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    console.log(oppositeSocketId);
    const mySocketId = props.authState.currentUser.socketId;
    setFullscreen1on1Modal(true);
    setShow1on1(true);
    // setIsPopupOpen(false); // 消えねー。
    // myVideo.current.srcObject = props.mediaState.myVideoStreamObject; // ここだとエラーになるんだ。

    // 果たして、これで動いてくれるか。
    // const { myVideoStreamObject } = props.mediaState;
    // mediaRecorder.current = new MediaRecorder(myVideoStreamObject);
    // mediaRecorder.current.ondataavailable = function (event) {
    //   console.log('ondataavai');
    //   console.log(event.data); // ここにはちゃんとdataが入っている。
    //   // setChunks((oldChunks) => {
    //   //   return [...oldChunks, event.data];
    //   // });
    //   chunksBuffer.push(event.data);
    // };
    // mediaRecorder.current.onstop = (event) => {
    //   console.log(chunks);
    //   let blob = new Blob(chunksBuffer, { type: 'video/mp4;' }); // blob自体は、object。
    //   // ここでmp4のdataが作られたらこれをmongoとs3に保存していくapi requestをすることだ。
    //   // chunks = [];
    //   chunksBuffer = [];
    //   props.updateUserStreamActionCreator(blob, connectionRef);
    //   // setChunks([]); // arrayを空にするのってどうやるんだっけ？？
    //   // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
    // }; // これ自体、asyncな動きをしている、おそらく。だからhangupcallが先に動いちゃっている。

    props.callActionCreator(
      socket,
      mySocketId,
      myVideo,
      oppositeSocketId,
      oppositeVideo,
      connectionRef,
      mediaRecorder.current
    );
    // 上のuseEffectの方かなー。
    // props
    //   .completeConnectionWithMyPartnerActionCreator()
    //   .then(() => {
    //     return props.updateUserConversationStateActionCreator();
    //   })
    //   .then(() => {
    //     // recorder start!
    //   });
  };

  const makeBlobs = () => {
    return new Promise((resolve, reject) => {
      let blobForVideo = new Blob(chunksForVideo, { type: 'video/mp4;' });
      let blobForAudio = new Blob(chunksForAudio, { type: 'audio/webm;codecs=opus' });
      let blobForLearningLanguage = new Blob([learningLanguageScript], { type: 'text/plain' });
      let blobForNativeLanguage = new Blob([nativeLanguageScript], { type: 'text/plain' });
      resolve({ blobForVideo, blobForAudio, blobForLearningLanguage, blobForNativeLanguage });
    });
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
    mediaRecorder.current.stop(); // いちいちonstopのなかにblobを書く必要ないんじゃないかね。。。
    // ここでまずblob4つ作るfunctionを実行して(promiseで)、
    makeBlobs()
      .then((blobs) => {
        return props.createUserMedia(
          blobs.blobForVideo,
          blobs.blobForAudio,
          blobs.blobForLearningLanguage,
          blobs.blobForNativeLanguage
        );
      })
      .then(() => {
        return props.hangUpCallActionCreator(connectionRef); //っていう流れかね。。。。
      })
      .then(() => {
        return props.updateUserConversationToFalseActionCreator();
      })
      .then(() => {
        setShow1on1(false);
      });

    // setShow1on1(false); // これもpromisifyで繋げたほうがいいかも。
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
        chunksForVideo={chunksForVideo}
        chunksForAudio={chunksForAudio}
        setLearningLanguageScript={setLearningLanguageScript} //これでいいかなー。。。
        setNativeLanguageScript={setNativeLanguageScript} // これでいいかなー。。。まあ今はこれでいいや。
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
    peerState: state.peerState,
  };
};

export default connect(mapStateToProps, {
  // loadPositionActionCreator,
  getMediaActionCreator,
  listenCallActionCreator,
  callActionCreator,
  completeConnectionWithMyPartnerActionCreator,
  updateUserConversationStateActionCreator,
  startMediaRecorder,
  createConversationActionCreator,
  createIntegratedUserMediaActionCreator,
  sendIntegratedUserMediaActionCeator,
  updateConversationIntegratedUserMediaActionCreator,

  answerCallActionCreator,
  getUsersActionCreator,
  loadMeAndUpdateActionCreator,
  // updateUserConversationStateActionCreator // ここでやるのはよそう。actionの順番がごちゃごちゃになる。
  getMeetingsActionCreator,
  // updateUserStreamActionCreator,
  createUserMedia,
  hangUpCallActionCreator,
  updateUserConversationToFalseActionCreator,
})(WorldMap);
