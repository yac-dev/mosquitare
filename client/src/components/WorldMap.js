import React, { useRef, useEffect, useState } from 'react';
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../', '../', '.env') });
// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// const getLngLat = async () => {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       setLng(position.coords.longitude);
//       setLat(position.coords.latitude);
//     },
//     (rejected) => {
//       console.log(rejected);
//     }
//   );
// };

const WorldMap = () => {
  // hooks states
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 4 });
  const [user, setUser] = useState({});

  useEffect(() => {}, []);

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
      />
    </div>
  );
};

export default WorldMap;
