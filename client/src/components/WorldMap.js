import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Link } from 'react-router-dom';

// semantic
// import Modal from 'react-modal';
import { Icon, Popup, Header, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';

// socketio
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// component
import ModalChat from './Modal/ModalChat';
// redux
import { connect } from 'react-redux';

// action creators
import { loadPositionActionCreator } from '../actionCreators/authActionCreators';
import { getMediaActionCreator } from '../actionCreators/mediaActionCreator';
import { getSocketIdActionCreator } from '../actionCreators/mediaActionCreator';
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { listenCallActionCreator } from '../actionCreators/mediaActionCreator';
import { answerCallActionCreator } from '../actionCreators/mediaActionCreator';

import { getUsersActionCreator } from '../actionCreators/usersActionCreator';
import { I_GOT_SOCKET_ID } from '../actionCreators/socketEvents';

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

  // const [fullscreen, setFullscreen] = useState(true);
  // const [showChat, setShowChat] = useState(false);

  // function handleShowChat(breakpoint) {
  //   setFullscreen(breakpoint);
  //   setShowChat(true);
  // }

  const [modalOpen, setModalOpen] = useState(false);

  // // position
  // useEffect(() => {
  //   props.loadPositionActionCreator();
  // }, []);

  // // media stream用
  useEffect(() => {
    props.getMediaActionCreator(myVideo);
    // props.getSocketIdActionCreator(socket);
    props.listenCallActionCreator(socket);
    props.getUsersActionCreator();
  }, []);

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

  const onCallClick = (event, socketId) => {
    event.preventDefault();
    console.log('Im calling');
    props.callActionCreator(socket, Peer, socketId, oppositeVideo, connectionRef);
    setShow(true);
  };

  // const onAnswerCall = (event) => {
  //   event.preventDefault();
  //   props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef);
  //   handleClose();
  // };

  const usersMarkerRender = () => {
    const usersHashTable = props.globalUsersState;
    const users = Object.values(usersHashTable);
    const usersRender = users.map((user) => {
      if (user.currentUserPosition) {
        return (
          <>
            <Marker
              longitude={user.currentUserPosition.lng}
              latitude={user.currentUserPosition.lat}
              // offsetLeft={-3.5 * viewport.zoom}
              // offsetTop={-7 * viewport.zoom}
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
              {/* <Popup trigger={<Icon className='green user icon' size='large' />} flowing hoverable>
              {userInfoRender()}
            </Popup> */}
              <Popup trigger={<Icon className='red user icon' size='large' />} flowing hoverable>
                {otherUserInfoRender(user.currentUser, user.currentUserSocketId)}
              </Popup>
            </Marker>
          </>
        );
      } else {
        return null;
      }
    });

    return usersRender;
  };

  const otherUserInfoRender = (user, socketId) => {
    return (
      <div className='card'>
        <div className='content'>
          <h4>{user.name}</h4>
          <div className='description'>{user.nativeLangs.map((nativeLang) => nativeLang)}</div>
          <div className='description'>{user.learningLangs.map((learningLang) => learningLang)}</div>
          <div className='description'>{user.job}</div>
        </div>
        {/* <Link to={{ pathname: '/chatscreen', state: [myVideo, oppositeVideo] }}> */}

        {/* これ、多分いらねーよ。なんで俺こんなことやっているんだ？？？*/}
        <Button positive onClick={(event) => onCallClick(event, socketId)}>
          <i className='video icon'></i>
          {/* <Link to='/chatscreen'>Call</Link> */}
          Call
        </Button>
      </div>
    );
  };

  // usersMarkerRender();
  // console.log(props.globalUsersState);

  const userMarkerRender = () => {
    if (props.authState.currentUserPosition && props.authState.currentUser) {
      const position = props.authState.currentUserPosition;
      const user = props.authState.currentUser;
      return (
        <>
          <Marker
            longitude={position.lng}
            latitude={position.lat}
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
              {userInfoRender()}
            </Popup>
          </Marker>
        </>
      );
    } else {
      return null;
    }
  };

  const userInfoRender = () => {
    if (props.authState.currentUser && props.authState.currentUserPosition) {
      const user = props.authState.currentUser;
      const position = props.authState.currentUserPosition;
      return (
        // <Popup
        //   key={position.lng}
        //   longitude={position.lng}
        //   latitude={position.lat}
        //   closeButton={true}
        //   closeOnClick={false}
        //   // onClose={() => setCurrentPlaceId(null)}
        //   anchor='left'
        // >
        <div className='card'>
          <div className='content'>
            <h4>{user.name}</h4>
            <div className='description'>{user.nativeLangs.map((nativeLang) => nativeLang)}</div>
            <div className='description'>{user.learningLangs.map((learningLang) => learningLang)}</div>
            <div className='description'>{user.job}</div>
          </div>
          {/* <Link to={{ pathname: '/chatscreen', state: [myVideo, oppositeVideo] }}> */}

          {/* これ、多分いらねーよ。なんで俺こんなことやっているんだ？？？*/}
          <Button positive onClick={(event) => onCallClick(event)}>
            <i className='video icon'></i>
            <Link to='/chatscreen'>Call</Link>
          </Button>
        </div>
      );
      // </Popup>
    } else {
      return null;
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
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
      </Modal>

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

      <div style={{ height: '100vh', width: '100%' }}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          width='100%'
          height='60%'
          mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
          onViewportChange={(viewport) => setViewport(viewport)}
          // onDblClick={currentUsername && handleAddClick}
        >
          {userMarkerRender()}
          {usersMarkerRender()}
          {/* {recieveCall()} */}
        </ReactMapGL>
      </div>
      {modalOpen && (
        <div className='modalBackground'>
          <div className='modalContainer'>
            <div className='titleCloseBtn'>
              <button
                onClick={() => {
                  props.setOpenModal(false);
                }}
              >
                X
              </button>
            </div>
            <div className='video-container'>
              <div className='video'>
                <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
                <div>{props.mediaState.mySocketId}</div>
              </div>
              <div className='video'>
                <video playsInline ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
              </div>
            </div>
          </div>
        </div>
      )}

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
  return { authState: state.authState, mediaState: state.mediaState, globalUsersState: state.globalUsersState };
};

export default connect(mapStateToProps, {
  loadPositionActionCreator,
  getMediaActionCreator,
  getSocketIdActionCreator,
  listenCallActionCreator,
  callActionCreator,
  answerCallActionCreator,
  getUsersActionCreator,
})(WorldMap);
