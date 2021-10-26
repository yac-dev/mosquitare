import React, { useRef, useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Icon } from 'semantic-ui-react';

// redux
import { connect } from 'react-redux';
import { loadPositionActionCreator } from '../actionCreators/authActionCreators';

const WorldMap = (props) => {
  // hooks states
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });

  useEffect(() => {
    props.loadPositionActionCreator();
  }, []);

  const markerRender = () => {
    if (props.authState.currentUserPosition) {
      return (
        // ただ数値を入力するだけでは表示されないみたいだな。
        <Marker
          longitude={props.authState.currentUserPosition.lng}
          latitude={props.authState.currentUserPosition.lat}
          offsetLeft={-3.5 * viewport.zoom}
          offsetTop={-7 * viewport.zoom}
        >
          <Icon className='green user icon' size='large' />
        </Marker>
      );
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
        {markerRender()}
      </ReactMapGL>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { loadPositionActionCreator })(WorldMap);
