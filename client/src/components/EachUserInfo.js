import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-map-gl';
// import { Marker } from '@react-google-maps/api';
import { Icon, Popup, Button } from 'semantic-ui-react';
import UserInfoCardNew from './UserInfoCardNew';

// mui
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

// propsでは、"user"だけがくると思っていい。
const EachUserInfo = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // const handleOpen = () => {
  //   setIsPopupOpen(true);
  // };

  // const handleClose = () => {
  //   setIsPopupOpen(false);
  // };
  return (
    <Marker
      // position={{ lat: props.user.location.coordinates[1], lng: props.user.location.coordinates[0] }}
      longitude={props.user.location.coordinates[0]}
      latitude={props.user.location.coordinates[1]}
      offsetLeft={-3.5 * props.viewport.zoom}
      offsetTop={-7 * props.viewport.zoom}
      // ここonClickは、今自分がどのcomponent内にいるかで実行するものが変わるようにしたいんだよな。
      onClick={() => {
        props.setIsUserIconClicked(true);
        if (props.setOpenSwipeableDrawer) {
          props.setOpenSwipeableDrawer(true);
        }
        props.setUserInfo({ ...props.userInfo, info: props.user });
      }}
    >
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <UserInfoCardNew user={props.user} />
      </Popover>
      {/* <Popup
        trigger={
          <Icon
            className={`${props.user._id === props.authState.currentUser._id ? 'blue' : 'green'} user icon`}
            size='large'
            style={{ cursor: 'pointer' }}
          />
        }
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
      ></Popup> */}
      <Icon
        className={`${props.user._id === props.authState.currentUser._id ? 'blue' : 'green'} user icon`}
        size='large'
        style={{ cursor: 'pointer' }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
    </Marker>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps)(EachUserInfo);
