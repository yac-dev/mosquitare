import React, { useState } from 'react';
// import { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';
import WidgetsIcon from '@mui/icons-material/Widgets';

// componetns
import EachCountry from './EachCountry';

const CountryMarkers = (props) => {
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });

  const renderMarkers = () => {
    if (props.visitedCountries.length) {
      const countries = props.visitedCountries.map((country) => {
        return (
          <>
            <EachCountry country={country} />;
          </>
        );
      });

      return <>{countries}</>;
    }
  };

  return <>{renderMarkers()}</>;

  // return <>{renderMarkers()}</>;
  // const render = () => {
  //   const f = props.visitedCountries.map((country) => {
  //     return (
  //       <div style={{ color: 'white' }}>
  //         <Marker longitude={country.location.coordinates[0]} latitude={country.location.coordinates[1]}>
  //           <Icon className='green user icon' />
  //         </Marker>
  //       </div>
  //     );
  //   });

  //   return <>{f}</>;
  // };

  // return <>{render()}</>;
  // return <div>This is a dummy</div>;
};

export default CountryMarkers;
