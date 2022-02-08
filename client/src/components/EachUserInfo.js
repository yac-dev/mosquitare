import React, { useState } from 'react';
import { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';
import UserInfoCardNew from './UserInfoCardNew';

// propsでは、"user"だけがくると思っていい。
const EachUserInfo = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // const handleOpen = () => {
  //   setIsPopupOpen(true);
  // };

  // const handleClose = () => {
  //   setIsPopupOpen(false);
  // };
  return (
    <Marker
      longitude={props.user.location.coordinates[0]}
      latitude={props.user.location.coordinates[1]}
      offsetLeft={-3.5 * props.viewport.zoom}
      offsetTop={-7 * props.viewport.zoom}
    >
      <Popup
        trigger={<Icon className='green user icon' size='large' style={{ cursor: 'pointer' }} />}
        content={
          <UserInfoCardNew
            user={props.user}
            socket={props.socket}
            setShowCallingModal={props.setShowCallingModal}
            setIsPopupOpen={setIsPopupOpen}
          />
        }
        open={isPopupOpen}
        onOpen={() => setIsPopupOpen(true)} //意味は、hoverした時にisPopupOpen stateをopenにします。ってこと。
        onClose={() => setIsPopupOpen(false)} // 意味は、hoverが外れた時にisPopupOpen stateをfalseにします、ってこと。
        basic
        hoverable
      ></Popup>
    </Marker>
  );
};

export default EachUserInfo;
