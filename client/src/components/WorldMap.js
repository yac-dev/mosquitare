import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Link } from 'react-router-dom';

// semantic
// import Modal from 'react-modal';
import { Icon, Popup, Header, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';

// components
import Dimer from './Dimer';
import ConfirmationCard from './ConfirmationCard';

// socketio
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// component
import ModalChat from './Modal/ModalChat';
// redux
import { connect } from 'react-redux';

// action creators
// import { loadPositionActionCreator } from '../actionCreators/authActionCreators';
import { loadMeAndUpdateActionCreator } from '../actionCreators/authActionCreators';
import { getMediaActionCreator } from '../actionCreators/mediaActionCreator';
// import { getSocketIdActionCreator } from '../actionCreators/mediaActionCreator';
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { listenCallActionCreator } from '../actionCreators/mediaActionCreator';
import { answerCallActionCreator } from '../actionCreators/mediaActionCreator';

import { getUsersActionCreator } from '../actionCreators/usersActionCreator';
import { I_GOT_SOCKET_ID } from '../actionCreators/socketEvents';
import { SOMEBODY_CALLS_ME } from '../actionCreators/socketEvents';

import { LISTEN_CALL } from '../actionCreators/type';
import { GET_MEDIA } from '../actionCreators/type';
import store from '../store';

export const socket = io(process.env.REACT_APP_WEBRTC); // おそらく、socketっていう別のファイルを作ってそっからexportした方がいいだろな。conventionの部分を考えると。

const WorldMap = (props) => {
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  // const [myVideoStreamObject, setMyVideoStreamObject] = useState(''); // これやっぱいらない。一応、stream objectはstoreの中に入ってくれているみたい。
  const [oppositeSocketId, setOppositeSocketId] = useState(''); // とりあえず、入力欄を設けておこう。今のうちは。
  const myVideo = useRef();
  const oppositeVideo = useRef();
  const connectionRef = useRef();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => {
  //   if (props.mediaState.amIRecievingCall) {
  //     setShow(true);
  //   }
  // };

  const [fullscreen, setFullscreen] = useState(true);
  // const [showChat, setShowChat] = useState(false);

  // function handleShowChat(breakpoint) {
  //   setFullscreen(breakpoint);
  //   setShowChat(true);
  // }
  const [modalOpen, setModalOpen] = useState(false);

  const [amICalling, setAmICalling] = useState(false);
  const [amIRecieving, setAmIRecieving] = useState(false);

  // // position
  // useEffect(() => {
  //   props.loadPositionActionCreator();
  // }, []);

  // // media stream用
  // useEffect(() => {
  //   const jwtToken = localStorage.getItem('mosquitare token');
  //   if (jwtToken) {
  //     // props.loadMeActionCreator(jwtToken);
  //     // props.getMediaActionCreator(myVideo);
  //     // // props.getSocketIdActionCreator();
  //     // // props.getUsersActionCreator();
  //     // props.listenCallActionCreator();
  //   }
  // }, []);

  // const socket = io(process.env.REACT_APP_WEBRTC); // これまずいね。反省。

  const socketId = useRef(null);
  useEffect(() => {
    // const socket = io(process.env.REACT_APP_WEBRTC);
    const jwtToken = localStorage.getItem('mosquitare token');
    // if (jwtToken) {
    socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
      socketId.current = socketIdFromServer;
      props.loadMeAndUpdateActionCreator(jwtToken, socketIdFromServer);
    });
    // }
    // props.getMediaActionCreator();
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      store.dispatch({
        type: GET_MEDIA,
        payload: stream,
      });
      // setMyVideoStreamObject(stream);
      // myVideoRef.current.srcObject = stream; // ここなーーー。どうだろう。// chatscreenの方でuseEffectすればいいのかね。。。ここだけ。
    });

    // const { myVideoStreamObject } = props.mediaState;
    // // console.log(myVideoStreamObject);
    // console.log('it works????');
    socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
      console.log('somebody calls me!!!');
      console.log(dataFromServer);
      const { signalData, whoIsCalling, callerUserInfo } = dataFromServer;
      console.log(signalData, whoIsCalling);
      setFullscreen(true);
      setShow(true);
      // myVideo.current.srcObject = myVideoStreamObject;
      // console.log('srcObject set up??');

      store.dispatch({
        type: LISTEN_CALL,
        payload: { signalData, whoIsCalling, callerUserInfo },
      });
    });
  }, []);

  // useEffect(() => {
  //   // props.listenCallActionCreator(socket);
  // }, []);

  // const recieveCall = () => {
  //   if (props.mediaState.amIRecievingCall) {
  //     return (
  //       <div style={{ color: 'yellow' }}>
  //         Somebody calls me. Do you answer?
  //         <button onClick={() => props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef)}>
  //           Answer
  //         </button>
  //       </div>
  //     );
  //   }
  // };

  // const onAnswerCall = (event) => {
  //   event.preventDefault();
  //   props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef);
  //   handleClose();
  // };

  const usersMarkerRender = () => {
    if (props.usersState) {
      // const users = Object.values(props.usersState);
      const usersRender = props.usersState.map((user) => {
        return (
          <>
            <Marker
              longitude={user.location.coordinates[0]}
              latitude={user.location.coordinates[1]}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              {/* <Popup
                header={user.name}
                content={userInfoRender}
                key='hola'
                trigger={
                  <Icon
                    className='green user icon'
                    size='large'
                    // onMouseEnter={setToggle(true)}
                  />
                }
              /> */}
              <Popup trigger={<Icon className='green user icon' size='large' />} flowing hoverable>
                {/* <div className='card'>
                  <div className='content'>
                    <h4>{user.name}</h4>
                    <div className='description'>{user.nativeLangs.map((nativeLang) => nativeLang.name)}</div>
                    <div className='description'>{user.learningLangs.map((learningLang) => learningLang.name)}</div>
                    <div className='description'>{user.job}</div>
                  </div>

                  <Button positive onClick={(event) => onCallClick(event, user.socketId)}>
                    <i className='video icon'>call</i>
                    callback={onCallClick} socketId={user.socketId} っていう具合かな。。。
                  </Button>
                </div> */}
                <ConfirmationCard callback={onCallClick} socketId={user.socketId} user={user} />
              </Popup>
              {/* <Popup trigger={<Icon className='red user icon' size='large' />} flowing hoverable>
                  {otherUserInfoRender(user.currentUser, user.currentUserSocketId)}
                </Popup> */}
              {/* <Icon className='red user icon' size='large' /> */}
            </Marker>
          </>
        );
      });
      return <>{usersRender}</>;
    } else {
      return null;
    }
  };

  const onCallClick = (event, oppositeSocketId) => {
    // ようやく分かった。。。callACのargumentな。
    event.preventDefault();
    // console.log('Im calling');
    console.log(oppositeSocketId);
    const mySocketId = props.authState.currentUser.socketId;
    setFullscreen(true);
    setShow(true);
    // myVideo.current.srcObject = props.mediaState.myVideoStreamObject; // ここだとエラーになるんだ。
    props.callActionCreator(socket, mySocketId, myVideo, oppositeSocketId, oppositeVideo, connectionRef); // これがいわゆる、oppositeのsocketIdね。
    // setShow(true);
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

  // const chatModal = () => {
  //   return (
  //     <Modal show={showChat} fullscreen={fullscreen} onHide={() => setShowChat(false)}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Modal</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <div>
  //           Sockets
  //           <div className='video-container'>
  //             <div className='video'>
  //               <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
  //               <div>{props.mediaState.mySocketId}</div>
  //             </div>
  //             <div className='video'>
  //               <video playsInline ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
  //             </div>
  //           </div>
  //           <label>Opposite ID to call</label>
  //           {/* <input value={oppositeSocketId} onChange={(e) => setOppositeSocketId(e.target.value)} /> */}
  //           {/* <button
  //             onClick={() => props.callActionCreator(socket, Peer, oppositeSocketId, oppositeVideo, connectionRef)}
  //           >
  //             Call
  //           </button> */}
  //           <div>
  //             <div className='caller'>
  //               <h1>Someone is calling...</h1>
  //               <button onClick={() => props.answerCallActionCreator(socket, oppositeVideo, connectionRef)}>
  //                 Answer
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </Modal.Body>
  //     </Modal>
  //   );
  // };

  // const userInfoRender = (socketId) => {
  //   if (props.usersState) {
  //     const user = props.authState.currentUser; // これ、まったく違うぜ。。。
  //     // const position = props.authState.currentUserPosition;
  //     return (
  //       // <Popup
  //       //   key={position.lng}
  //       //   longitude={position.lng}
  //       //   latitude={position.lat}
  //       //   closeButton={true}
  //       //   closeOnClick={false}
  //       //   // onClose={() => setCurrentPlaceId(null)}
  //       //   anchor='left'
  //       // >
  //       <div className='card'>
  //         <div className='content'>
  //           <h4>{user.name}</h4>
  //           <div className='description'>{user.nativeLangs.map((nativeLang) => nativeLang)}</div>
  //           <div className='description'>{user.learningLangs.map((learningLang) => learningLang)}</div>
  //           <div className='description'>{user.job}</div>
  //         </div>
  //         {/* <Link to={{ pathname: '/chatscreen', state: [myVideo, oppositeVideo] }}> */}

  //         {/* これ、多分いらねーよ。なんで俺こんなことやっているんだ？？？*/}
  //         <Button positive onClick={(event) => onCallClick(event, socketId)}>
  //           <i className='video icon'></i>
  //           <Link to='/chatscreen'>Call</Link>
  //         </Button>
  //       </div>
  //     );
  //     // </Popup>
  //   } else {
  //     return null;
  //   }
  // };

  //   return usersRender;
  // };

  // const otherUserInfoRender = (user, socketId) => {
  //   return (
  //     <div className='card'>
  //       <div className='content'>
  //         <h4>{user.name}</h4>
  //         <div className='description'>{user.nativeLangs.map((nativeLang) => nativeLang)}</div>
  //         <div className='description'>{user.learningLangs.map((learningLang) => learningLang)}</div>
  //         <div className='description'>{user.job}</div>
  //       </div>
  //       {/* <Link to={{ pathname: '/chatscreen', state: [myVideo, oppositeVideo] }}> */}

  //       {/* これ、多分いらねーよ。なんで俺こんなことやっているんだ？？？*/}
  //       <Button positive onClick={(event) => onCallClick(event, socketId)}>
  //         <i className='video icon'></i>
  //         {/* <Link to='/chatscreen'>Call</Link> */}
  //         Call
  //       </Button>
  //     </div>
  //   );
  // };

  // // usersMarkerRender();
  // // console.log(props.globalUsersState);

  // const userMarkerRender = () => {
  //   if (props.authState.currentUserPosition && props.authState.currentUser) {
  //     const position = props.authState.currentUserPosition;
  //     const user = props.authState.currentUser;
  //     return (
  //       <>
  //         <Marker
  //           longitude={position.lng}
  //           latitude={position.lat}
  //           offsetLeft={-3.5 * viewport.zoom}
  //           offsetTop={-7 * viewport.zoom}
  //         >
  //           {/* <Popup
  //             header={user.name}
  //             content={userInfoRender}
  //             key='hola'
  //             trigger={
  //               <Icon
  //                 className='green user icon'
  //                 size='large'
  //                 // onMouseEnter={setToggle(true)}
  //               />
  //             }
  //           /> */}
  //           <Popup trigger={<Icon className='green user icon' size='large' />} flowing hoverable>
  //             {userInfoRender()}
  //           </Popup>
  //         </Marker>
  //       </>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <>
      {/* <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
        <Modal.Body>
          <div>
            Somebody calls me. Do you answer?
            <button
              onClick={() => {
                props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef);
                handleClose();
                setModalOpen(true);
              }}
            >
              Answer
            </button>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* <Modal show={showChat} fullscreen={fullscreen} onHide={() => setShowChat(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Sockets
            <div className='video-container'>
              <div className='video'>
                <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
                <div>{props.mediaState.mySocketId}</div>
              </div>
              <div className='video'>
                <video playsInline ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
              </div>
            </div>
            <label>Opposite ID to call</label>
            <input value={oppositeSocketId} onChange={(e) => setOppositeSocketId(e.target.value)} />
            <button
              onClick={() => props.callActionCreator(socket, Peer, oppositeSocketId, oppositeVideo, connectionRef)}
            >
              Call
            </button>
            <div>
              <div className='caller'>
                <h1>Someone is calling...</h1>
                <button onClick={() => props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef)}>
                  Answer
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* {chatModal()} */}

      <Modal
        className='chat-modal'
        show={show}
        fullscreen={fullscreen}
        onHide={() => setShow(false)}
        style={{ backgroundColor: 'blue' }}
      >
        {/* <Modal.Header closeButton style={{ backgroundColor: 'rgb(8, 18, 23)' }}>
          <Modal.Title className='modal-title'>Chatting Room</Modal.Title>
        </Modal.Header> */}

        <Modal.Body style={{ backgroundColor: 'rgb(8, 18, 23)' }}>
          {switchRender()} {/* こいつの表示有無をstateで管理しよう。*/}
          <div className='video-container'>
            <div className='video' style={{ marginTop: '100px' }}>
              <video playsInline muted ref={myVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
              <video playsInline ref={oppositeVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
              {/* <div>{props.mediaState.mySocketId}</div> */}
            </div>
            {/* <div className='video'></div> */}
          </div>
          {props.mediaState.callAccepted ? (
            <div className='button-wrapper'>
              <Button negative className='hang-up-button'>
                Hang up
              </Button>
            </div>
          ) : null}
          {/* <input value={oppositeSocketId} onChange={(e) => setOppositeSocketId(e.target.value)} /> */}
          {/* <button
              onClick={() => props.callActionCreator(socket, Peer, oppositeSocketId, oppositeVideo, connectionRef)}
            >
              Call
            </button> */}
          {/* <button onClick={() => props.answerCallActionCreator(socket, myVideo, oppositeVideo, connectionRef)}>
            Answer これはもういらない。
          </button> */}
        </Modal.Body>
      </Modal>

      <div style={{ height: '100vh', width: '100%' }}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          width='100%'
          height='100vh'
          mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
          onViewportChange={(viewport) => setViewport(viewport)}
          // onDblClick={currentUsername && handleAddClick}
        >
          {/* {userMarkerRender()} */}
          {usersMarkerRender()}
          {/* {recieveCall()} */}
        </ReactMapGL>
      </div>

      {/* {modalOpen && chatModal()} */}

      {/* <CallModal myVideo={myVideo} oppositeVideo={oppositeVideo} /> */}

      {/* <div>
        Sockets
        <div className='video-container'>
          <div className='video'>
            <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
            <div>{props.mediaState.mySocketId}</div>
          </div>
          <div className='video'>
            <video playsInline ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
          </div>
        </div>
        <label>Opposite ID to call</label>
        <input value={oppositeSocketId} onChange={(e) => setOppositeSocketId(e.target.value)} />
        <button onClick={() => props.callActionCreator(socket, Peer, oppositeSocketId, oppositeVideo, connectionRef)}>
          Call
        </button>
        <div>
          <div className='caller'>
            <h1>Someone is calling...</h1>
            <button
              onClick={
                (event) => onAnswerCall(event)
                //   {
                //   props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef);
                //   handleClose();
                // }
              }
            >
              Answer
            </button>
          </div>
        </div>
      </div> */}

      {/* </Modal> */}
    </>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState, usersState: Object.values(state.usersState) };
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
})(WorldMap);
