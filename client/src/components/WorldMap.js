import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Link } from 'react-router-dom';

// semantic
// import Modal from 'react-modal';
import { Icon, Popup, Header, Button, Modal } from 'semantic-ui-react';

// socketio
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// component

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

export const socket = io(process.env.REACT_APP_WEBRTC); // おそらく、socketっていう別のファイルを作ってそっからexportした方がいいだろな。conventionの部分を考えると。

const WorldMap = (props) => {
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  // const [myVideoStreamObject, setMyVideoStreamObject] = useState(''); // これやっぱいらない。一応、stream objectはstoreの中に入ってくれているみたい。
  const [oppositeSocketId, setOppositeSocketId] = useState(''); // とりあえず、入力欄を設けておこう。今のうちは。
  const myVideo = useRef();
  const oppositeVideo = useRef();
  const connectionRef = useRef();

  // position
  useEffect(() => {
    props.loadPositionActionCreator();
  }, []);

  // media stream用
  useEffect(() => {
    props.getMediaActionCreator(myVideo);
    props.getSocketIdActionCreator(socket);
    props.listenCallActionCreator(socket);
    props.getUsersActionCreator();
  }, []);

  const onCallClick = (event) => {
    event.preventDefault();
    console.log('Im calling');
    props.callActionCreator(socket, Peer, props.authState.currentUserSocketId, oppositeVideo, connectionRef);
  };

  const usersMarkerRender = () => {
    if (props.authState.currentUser && props.globalUsersState) {
      const usersHashTable = props.globalUsersState;
      // 最初に自分のだけ見つけて消すのがいいかもな。
      delete usersHashTable[props.authState.currentUser._id];
      const usersRender = Object.keys(usersHashTable).map((user) => {
        return (
          <>
            <Marker
              longitude={user.currentUserPosition.lng}
              latitude={user.currentUserPosition.lat}
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
              <Popup trigger={<Icon className='red user icon' size='large' />} flowing hoverable>
                {/* {userInfoRender()} */}
              </Popup>
            </Marker>
          </>
        );
      });
    }
  };

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
      <div style={{ height: '100vh', width: '100%' }}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          width='100%'
          height='100%'
          mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
          onViewportChange={(viewport) => setViewport(viewport)}
          // onDblClick={currentUsername && handleAddClick}
        >
          {userMarkerRender()}
        </ReactMapGL>
      </div>

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
            <button onClick={() => props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef)}>
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
