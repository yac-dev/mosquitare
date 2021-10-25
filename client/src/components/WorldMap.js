import React, { useRef, useEffect, useState } from 'react';
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../', '../', '.env') });
// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const WorldMap = () => {
  // hooks states
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });
  const [userPosition, setUserPosition] = useState({ lng: '', lat: '' });
  const [user, setUser] = useState({});

  useEffect(() => {
    // まずuserの情報を取ってきた後に、このlng, latのpropertyを加える。
    const getLngLat = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            ...userPosition,
            lng: Number(position.coords.longitude.toFixed(1)),
            lat: Number(position.coords.latitude.toFixed(1)),
          });
        },
        (rejected) => {
          console.log(rejected);
        }
      );
    };
    getLngLat();
  }, []);

  const markerRender = () => {
    console.log(userPosition.lng, userPosition.lat);
    if (userPosition.lng && userPosition.lat) {
      return (
        // ただ数値を入力するだけでは表示されないみたいだな。
        <Marker
          longitude={userPosition.lng}
          latitude={userPosition.lat}
          offsetLeft={-3.5 * viewport.zoom}
          offsetTop={-7 * viewport.zoom}
        >
          You are here!!!!!!!!!!!!!!!!!!!!!
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

export default WorldMap;
