import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Popup } from 'semantic-ui-react';

// redux
import { connect } from 'react-redux';
import { loadPositionActionCreator } from '../actionCreators/authActionCreators';

const WorldMap = (props) => {
  // hooks states
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    props.loadPositionActionCreator();
  }, []);

  const userMarkerRender = () => {
    if (props.authState.currentUserPosition && props.authState.currentUser) {
      const position = props.authState.currentUserPosition;
      const user = props.authState.currentUser;
      return (
        // ただ数値を入力するだけでは表示されないみたいだな。
        <>
          <Marker
            longitude={position.lng}
            latitude={position.lat}
            offsetLeft={-3.5 * viewport.zoom}
            offsetTop={-7 * viewport.zoom}
          >
            {/* <Icon
              className='green user icon'
              size='large'
              // onMouseEnter={setToggle(true)}
            /> */}
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

  // hoverしたら、user infoを出す。
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
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { loadPositionActionCreator })(WorldMap);
