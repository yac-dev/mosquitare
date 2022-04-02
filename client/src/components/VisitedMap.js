import React, { useState, useEffect, useRef } from 'react';
// import ReactMapGL, { Marker } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import mapboxgl from 'mapbox-gl';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { modestStyle } from '../googleMapStyle';

// components
import CountryMarkers from '../components/CountryMarkers';

import '../styles/googlemap.css';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
// // mapbox設定。コメント含めて必要。
// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const containerStyle = {
  height: '100%',
  width: '100%',
};

const mapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  scrollwheel: false,
  styles: modestStyle,
};

var maxLat = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;

const VisitedMap = (props) => {
  const [viewport, setViewport] = useState({ latitude: 10, longitude: 12, zoom: 1 });
  const [visitedMapSetting, setVisitedMapSetting] = useState({
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    scrollwheel: true,
    restriction: {
      latLngBounds: { north: maxLat, south: -maxLat, west: -180, east: 180 },
      strictBounds: true,
    },
    styles: modestStyle,
  });

  const mouseOverVisitedMap = () => {
    props.setWorldMapSetting({ ...props.worldMapSettings, dragPan: false, scrollZoom: false });
    setVisitedMapSetting({
      ...visitedMapSetting,
      scrollwheel: true,
    });
  };

  const mouseOutVisitedMap = () => {
    props.setWorldMapSetting({ ...props.worldMapSettings, dragPan: true, scrollZoom: true });
    setVisitedMapSetting({
      ...visitedMapSetting,
      scrollwheel: false,
    });
  };

  const mapRef = useRef(null);
  const [position, setPosition] = useState({ lat: 51.477928, lng: -0.001545 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_ACCESS_KEY,
  });

  const [map, setMap] = useState(null);

  function handleLoad(map) {
    mapRef.current = map;
  }

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const renderVisitedCountries = () => {
    const visitedCountriesList = props.visitedCountries.map((country) => {
      return (
        <>
          <img src={country.flagPics[0]} style={{ width: '16px', height: '10px' }} />
          &nbsb;
        </>
      );
    });

    return <>{visitedCountriesList}</>;
  };

  return isLoaded ? (
    // <div className='visited-map' style={{ width: '100%', height: '200px' }}>
    <div
      // onMouseOver={() => mouseOverVisitedMap()}
      // onMouseOut={() => mouseOutVisitedMap()}
      style={{ width: '100%', height: '200px' }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={1}
        onLoad={handleLoad}
        onUnmount={onUnmount}
        options={visitedMapSetting}
      >
        <CountryMarkers visitedCountries={props.visitedCountries} />
      </GoogleMap>
    </div>
  ) : (
    // </div>
    <></>
  );

  // return (
  //   <div
  //     className='visited-map'
  //     style={{ width: '100%', height: '200px' }}
  //     // onMouseOver={() => mouseOverVisitedMap()}
  //     // onMouseOut={() => mouseOutVisitedMap()}
  //   >
  //     {/* <ReactMapGL
  //       {...viewport}
  //       // {...visitedMapSetting}
  //       mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_FOR_VISITED_COUNTRY}
  //       width='100%'
  //       height='100%'
  //       mapStyle='mapbox://styles/yabbee/ckvjrmck2h1pb14mv91m5cuk7'
  //       onViewportChange={(viewport) => setViewport(viewport)}
  //     >
  //       <Marker longitude={41} latitude={12}>
  //         <WidgetsIcon />
  //       </Marker>
  //     </ReactMapGL> */}
  //   </div>
  // );
};

export default VisitedMap;
