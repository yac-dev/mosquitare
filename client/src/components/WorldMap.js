import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Popup } from 'semantic-ui-react';

// socketio
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// redux
import { connect } from 'react-redux';

// action creators
import { loadPositionActionCreator } from '../actionCreators/authActionCreators';
import { getMediaActionCreator } from '../actionCreators/mediaActionCreator';
import { getSokcetIdActionCreator } from '../actionCreators/mediaActionCreator';
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { listenCallActionCreator } from '../actionCreators/mediaActionCreator';
import { answerCallActionCreator } from '../actionCreators/mediaActionCreator';

const socket = io(process.env.REACT_APP_WEBRTC);

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
    props.getSokcetIdActionCreator(socket);
    props.listenCallActionCreator(socket);
  }, []);

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
            <Popup
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
            />
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
      console.log(user);
      console.log(position);
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
            <div className='header'>{user.name}</div>
            <div className='description'>{user.nativeLangs.map((nativeLang) => nativeLang)}</div>
            <div className='description'>{user.learningLangs.map((learningLang) => learningLang)}</div>
            <div className='description'>{user.job}</div>
          </div>
          <div className='ui bottom attached button'>
            <i className='add icon'></i>
            Call
          </div>
        </div>
      );
      // </Popup>
    } else {
      return null;
    }
  };

  return (
    <>
      {/* <div style={{ height: '100vh', width: '100%' }}>
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
      </div> */}

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
        <button onClick={() => props.callActionCreator(socket, Peer, oppositeSocketId, oppositeVideo, connectionRef)}>
          Call
        </button>
        <div>
          <div className='caller'>
            {/* <h1>Someone is calling...</h1> */}
            <button onClick={() => props.answerCallActionCreator(socket, Peer, oppositeVideo, connectionRef)}>
              Answer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState };
};

export default connect(mapStateToProps, {
  loadPositionActionCreator,
  getMediaActionCreator,
  getSokcetIdActionCreator,
  listenCallActionCreator,
  callActionCreator,
  answerCallActionCreator,
})(WorldMap);
