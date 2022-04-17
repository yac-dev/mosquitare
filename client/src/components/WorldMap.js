import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import ReactMapGL from 'react-map-gl';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { Button } from 'semantic-ui-react';
// components
import CallingModal from './CallingModal';
import FullScreen1on1Modal from './Modal/FullScreen1on1Modal';
import AfterFinishingModal from './AfterFinishingModal';
// import VerticallyCenteredModal from './Modal/VerticallyCenteredModal';
// import FullScreenMeetingModal from './Modal/FullScreenMeetingModal';
import { Stack } from '@mui/material';
import SnackBar from './Snackbar';
import UsersMarker from './UsersMarker';
import MeetingsList from './Meeting/MeetingsList';

import RightPositionedUserDetail from './RightPositionedUserDetail';
import UserDetail from './UserDetail';
import SwipeableUserDetail from './SwipeableUserDetail';
// css
import '../styles/worldmap.css';
import '../styles/meeting.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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
import mapboxgl from 'mapbox-gl';

const containerStyle = {
  height: '100vh',
  width: '100%',
};

const mapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  scrollwheel: false,
  // styles: modestStyle,
};

// // mapbox設定。コメント含めて必要。
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
// const socket = io(process.env.REACT_APP_WEBRTC, {
//   path: '/mysocket',
// });
const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 599 });
  return isMobile ? children : null;
};

const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

const WorldMap = (props) => {
  // const socket = io(process.env.REACT_APP_WEBRTC); // これまずいね。反省。
  // const socketId = useRef(null);
  const [socket, setSocket] = useState();
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  // callした後のcalling modal用
  const [showCallingModal, setShowCallingModal] = useState(false);
  // 1on1 modal用
  const [show1on1, setShow1on1] = useState(false);
  const [fullscreen1on1Modal, setFullscreen1on1Modal] = useState(true);
  const [showAfterFinishingModal, setShowAfterFinishingModal] = useState(false);
  // meeting modal用
  // const [showMeeting, setShowMeeting] = useState(false);
  // const [fullScreenMeetingModal, setFullScreenMeetingModal] = useState(true);
  // vertically centered modal用
  // const [verticallyCenteredModal, setVerticallyCenteredModal] = useState(false);
  const [isUserIconClicked, setIsUserIconClicked] = useState(false);
  const [userInfo, setUserInfo] = useState({ info: null });
  // for mobile and tablet
  const [showSwipeable, setShowSwipeable] = useState(true);
  const [openSwipeableDrawer, setOpenSwipeableDrawer] = useState(false);

  const [worldMapSettings, setWorldMapSetting] = useState({
    dragPan: true,
    scrollZoom: true,
  });

  // const mapRef = useRef(null);
  // const [position, setPosition] = useState({ lat: 51.477928, lng: -0.001545 });

  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: process.env.GOOGLE_MAP_ACCESS_KEY,
  // });

  // const [map, setMap] = useState(null);

  // function handleLoad(map) {
  //   mapRef.current = map;
  // }

  // const onUnmount = React.useCallback(function callback(map) {
  //   setMap(null);
  // }, []);

  // useEffect(() => {
  //   setTimeout(function () {
  //     window.addEventListener('beforeunload', (e) => {
  //       e.preventDefault();
  //       e.returnValue = '';
  //       // socket.emit('close', { info: 'info' });
  //     });
  //   }, 2000);
  // }, []);

  // useEffect(() => {
  //   // window.onunload()
  // }, []);

  // useEffect(() => {
  //   const s = io(process.env.REACT_APP_WEBRTC, {
  //     path: '/mysocket',
  //   });
  //   setSocket(s);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener('beforeunload', alertUser);
  //   return () => {
  //     window.removeEventListener('beforeunload', alertUser);
  //   };
  // }, []);
  // const alertUser = (e) => {
  //   e.preventDefault();
  //   e.returnValue = '';
  // };

  // page refresh効くじゃん笑
  // renderされた後にこれが動いて。
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      const s = io(process.env.REACT_APP_WEBRTC, {
        path: '/mysocket',
      });
      setSocket(s);
    }
  }, []);
  // jwtあるならsocketを設定して、そのsocketを使ってloadmeandupdateする。↓

  useEffect(() => {
    if (socket) {
      socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
        props.loadMeAndUpdateActionCreator(localStorage.getItem('mosquitare token'), socketIdFromServer).then(() => {
          props.getUsersActionCreator();
        });
        props.getMediaActionCreator();
        props.listenCallActionCreator(socket, setShowCallingModal);
      });
    }
  }, [socket]);

  // page refreshした時どうしようか。。。

  // useEffect(() => {
  //   if (socket) {
  //     // loginしているなら
  //     const jwtToken = localStorage.getItem('mosquitare token');
  //     if (jwtToken) {
  //       socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
  //         props.loadMeAndUpdateActionCreator(jwtToken, socketIdFromServer);
  //         props.getUsersActionCreator();
  //         props.getMediaActionCreator();
  //         props.listenCallActionCreator(socket, setShowCallingModal);
  //       });
  //     }
  //   }
  //   // props.getMeetingsActionCreator();
  // }, [socket]);

  // useEffect(() => {
  //   if (props.mediaState.hangUp) {
  //     setShowAfterFinishingModal(true);
  //   }
  // }, [props.mediaState.hangUp]);

  useEffect(() => {
    if (props.mediaState.apiCallResult === 2) {
      window.location = '/worldmap';
    }
  }, [props.mediaState.apiCallResult]);

  // こんな感じか？？？とりあえず、7秒ごとにgetUsersのapiを実行する。
  useEffect(() => {
    setInterval(() => props.getUsersActionCreator(), 7000);
  }, []);

  useEffect(() => {
    // CallingModal componentでmodalを閉じてから、callAcceptedをonにしてこれが動く。
    if (props.mediaState.callAccepted) {
      setFullscreen1on1Modal(true);
      setShow1on1(true);
      // ここで、相手に「お前のmodalを開け」っていうsocket eventを相手に発する。相手も、これがきたらmodalを開く感じよ。
    }
  }, [props.mediaState.callAccepted]);

  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    const mySocketId = props.authState.currentUser.socketId;
    setShowCallingModal(true);
    props.callActionCreator(socket, mySocketId, oppositeSocketId);
  };

  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <SnackBar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
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

  // const renderMap = () => {
  //   if (isLoaded) {
  //     return (
  //       <GoogleMap
  //         mapContainerStyle={containerStyle}
  //         center={position}
  //         zoom={3}
  //         onLoad={handleLoad}
  //         onUnmount={onUnmount}
  //         options={mapOptions}
  //       >
  //         <UsersMarker
  //           socket={socket}
  //           setShowCallingModal={setShowCallingModal}
  //           setIsUserIconClicked={setIsUserIconClicked}
  //           userInfo={userInfo}
  //           setUserInfo={setUserInfo}
  //         />
  //         <RightPositionedUserDetail
  //           socket={socket}
  //           isUserIconClicked={isUserIconClicked}
  //           userInfo={userInfo}
  //           setShowCallingModal={setShowCallingModal}
  //         />
  //       </GoogleMap>
  //     );
  //   } else {
  //     return <></>;
  //   }
  // };

  const renderWorldMap = () => {
    if (socket && props.usersState.length) {
      return (
        <>
          <Default>
            <div style={{ height: '100vh', width: '100%' }}>
              <ReactMapGL
                {...viewport}
                // {...worldMapSettings}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                width='100%'
                height='100vh'
                mapStyle='mapbox://styles/yabbee/ckvjrmck2h1pb14mv91m5cuk7'
                onViewportChange={(viewport) => setViewport(viewport)}
              >
                <UsersMarker
                  socket={socket}
                  setShowCallingModal={setShowCallingModal}
                  setIsUserIconClicked={setIsUserIconClicked}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
                <RightPositionedUserDetail
                  socket={socket}
                  isUserIconClicked={isUserIconClicked}
                  userInfo={userInfo}
                  setShowCallingModal={setShowCallingModal}
                  worldMapSettings={worldMapSettings}
                  setWorldMapSetting={setWorldMapSetting}
                />
                {/* <UserDetail
                  socket={socket}
                  isUserIconClicked={isUserIconClicked}
                  userInfo={userInfo}
                  setShowCallingModal={setShowCallingModal}
                /> */}
              </ReactMapGL>
              {/* {renderMap()} */}
              <CallingModal socket={socket} show={showCallingModal} setShowCallingModal={setShowCallingModal} />
              <FullScreen1on1Modal
                socket={socket}
                show1on1={show1on1}
                setShow1on1={setShow1on1}
                fullscreen1on1Modal={fullscreen1on1Modal}
                setShowAfterFinishingModal={setShowAfterFinishingModal}
              />
              <AfterFinishingModal
                showAfterFinishingModal={showAfterFinishingModal}
                setShowAfterFinishingModal={setShowAfterFinishingModal}
              />
              {renderAlerts()}
            </div>
          </Default>

          {/* <Tablet>
            <div style={{ height: '100vh', width: '100%' }}>
              <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                width='100%'
                height='100vh'
                mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                onViewportChange={(viewport) => setViewport(viewport)}
              >
                <UsersMarker
                  socket={socket}
                  setShowCallingModal={setShowCallingModal}
                  setIsUserIconClicked={setIsUserIconClicked}
                  setOpenSwipeableDrawer={setOpenSwipeableDrawer}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  setShowSwipeable={setShowSwipeable}
                />
                {showSwipeable && !props.mediaState.callAccepted ? (
                  <SwipeableUserDetail
                    socket={socket}
                    userInfo={userInfo}
                    isUserIconClicked={isUserIconClicked}
                    openSwipeableDrawer={openSwipeableDrawer}
                    setOpenSwipeableDrawer={setOpenSwipeableDrawer}
                    setShowCallingModal={setShowCallingModal}
                  />
                ) : null}
              </ReactMapGL>
              <CallingModal socket={socket} show={showCallingModal} setShowCallingModal={setShowCallingModal} />
              <FullScreen1on1Modal
                socket={socket}
                show1on1={show1on1}
                setShow1on1={setShow1on1}
                fullscreen1on1Modal={fullscreen1on1Modal}
              />
            </div>
          </Tablet> */}

          <Mobile>
            {/* <div style={{ height: '100vh', width: '100%' }}>
              <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                width='100%'
                height='100vh'
                mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                onViewportChange={(viewport) => setViewport(viewport)}
              >
                <UsersMarker
                  socket={socket}
                  setShowCallingModal={setShowCallingModal}
                  setIsUserIconClicked={setIsUserIconClicked}
                  setOpenSwipeableDrawer={setOpenSwipeableDrawer}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  setShowSwipeable={setShowSwipeable}
                />
                {showSwipeable && !props.mediaState.callAccepted ? (
                  <SwipeableUserDetail
                    socket={socket}
                    userInfo={userInfo}
                    isUserIconClicked={isUserIconClicked}
                    openSwipeableDrawer={openSwipeableDrawer} // 必要。状態はこのstateで管理している。
                    setOpenSwipeableDrawer={setOpenSwipeableDrawer} // 必要。trueにするのはeach userでだが、outsideをclickして閉じるのにここで渡しておく必要がある。
                    setShowCallingModal={setShowCallingModal}
                  />
                ) : null}
              </ReactMapGL>
              <CallingModal socket={socket} show={showCallingModal} setShowCallingModal={setShowCallingModal} />
              <FullScreen1on1Modal
                socket={socket}
                show1on1={show1on1}
                setShow1on1={setShow1on1}
                fullscreen1on1Modal={fullscreen1on1Modal}
              />
            </div> */}
            <div>
              Sorry for the inconvinience. Conversation on mobile device is not available now. Please access by laptop
              or desktop device.
            </div>
          </Mobile>

          {/* </div> */}
        </>
      );
    } else {
      return null;
    }
  };

  return <>{renderWorldMap()}</>;
};

const mapStateToProps = (state) => {
  return {
    authState: state.authState,
    mediaState: state.mediaState,
    usersState: Object.values(state.usersState),
    meetingState: state.meetingState,
    peerState: state.peerState,
    alertsState: state.alertsState,
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
