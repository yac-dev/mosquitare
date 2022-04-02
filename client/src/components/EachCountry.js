import React from 'react';
// import { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';
import Popover from '@mui/material/Popover';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import WidgetsIcon from '@mui/icons-material/Widgets';

const EachCountry = (props) => {
  const render = () => {
    if (props.country) {
      return (
        <>
          <Marker
            // longitude={props.country.location.coordinates[0]}
            // latitude={props.country.location.coordinates[1]}
            position={{ lat: props.country.location.coordinates[1], lng: props.country.location.coordinates[0] }}
          ></Marker>
        </>
      );
    }
  };

  return <>{render()}</>;
  // return (
  //   <Marker longitude={props.country.location.coordinates[0]} latitude={props.country.location.coordinates[1]}>
  //     <WidgetsIcon />
  //   </Marker>
  // );
};

export default EachCountry;
