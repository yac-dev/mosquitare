import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-map-gl';
// import { Marker } from '@react-google-maps/api';
import { Icon, Popup, Button } from 'semantic-ui-react';
import UserInfoCardNew from './UserInfoCardNew';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/system';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

// mui
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

// ac
// import { clickUserActionCreator } from '../actionCreators/authActionCreators';
import { clickMapUserActionCreator } from '../actionCreators/clickActionCreator';
import { clickedUserChangedLoggedInStateActionCreator } from '../actionCreators/clickActionCreator';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 14,
  height: 14,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

// propsでは、"user"だけがくると思っていい。
const EachUserInfo = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [isAvailable, setIsAvailable] = useState();

  useEffect(() => {
    if (props.clickedUserState.mapUser.clicked) {
      if (props.user.isAvailableNow) {
        console.log(props.user._id, 'user logged in');
        props.clickedUserChangedLoggedInStateActionCreator(props.user);
      } else {
        console.log(props.user._id, 'user logged out');
        props.clickedUserChangedLoggedInStateActionCreator(props.user);
      }
    }
  }, [props.user.isAvailableNow]);

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

  const renderEachUser = () => {
    if (!props.authState.currentUser) {
      return (
        <Marker
          // position={{ lat: props.user.location.coordinates[1], lng: props.user.location.coordinates[0] }}
          longitude={props.user.location.coordinates[0]}
          latitude={props.user.location.coordinates[1]}
          offsetLeft={-3.5 * props.viewport.zoom}
          offsetTop={-7 * props.viewport.zoom}
          // ここonClickは、今自分がどのcomponent内にいるかで実行するものが変わるようにしたいんだよな。
          onClick={() => {
            // props.setIsUserIconClicked(true);
            if (props.setOpenSwipeableDrawer) {
              props.setOpenSwipeableDrawer(true);
            }
            // props.setUserInfo({ ...props.userInfo, info: props.user });
            props.clickMapUserActionCreator(props.user);
            // props.clickUserActionCreator(props.user);
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
          {/* <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<SmallAvatar src={props.user.nationalities[0].flagPics[0]} />}
          > */}
          <Avatar
            sx={{ width: 30, height: 30, cursor: 'pointer' }}
            alt={props.user.name}
            // src={user.photo ? user.photo : ''}
            src={`${process.env.REACT_APP_S3_BUCKET_IMAGE_LINK}/${props.user.photo}`}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {props.user.name}
          </Avatar>

          {/* </Badge> */}
        </Marker>
      );
    } else {
      return (
        <Marker
          // position={{ lat: props.user.location.coordinates[1], lng: props.user.location.coordinates[0] }}
          longitude={props.user.location.coordinates[0]}
          latitude={props.user.location.coordinates[1]}
          offsetLeft={-3.5 * props.viewport.zoom}
          offsetTop={-7 * props.viewport.zoom}
          // ここonClickは、今自分がどのcomponent内にいるかで実行するものが変わるようにしたいんだよな。
          onClick={() => {
            // props.setIsUserIconClicked(true);
            if (props.setOpenSwipeableDrawer) {
              props.setOpenSwipeableDrawer(true);
            }
            // props.setUserInfo({ ...props.userInfo, info: props.user });
            props.clickMapUserActionCreator(props.user);
            // props.clickUserActionCreator(props.user);
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
          {/* <Icon
            className={`${props.user._id === props.authState.currentUser._id ? 'blue' : 'green'} user icon`}
            size='large'
            style={{ cursor: 'pointer' }}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          /> */}
          {/* <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<SmallAvatar src={props.user.nationalities[0].flagPics[0]} />}
          > */}
          {props.user._id === props.authState.currentUser._id ? (
            <Icon
              className='green user icon'
              size='large'
              style={{ cursor: 'pointer' }}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            />
          ) : (
            <Avatar
              sx={{ width: 30, height: 30, cursor: 'pointer' }}
              alt={props.user.name}
              // src={user.photo ? user.photo : ''}
              src={`${process.env.REACT_APP_S3_BUCKET_IMAGE_LINK}/${props.user.photo}`}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              {props.user.name}
            </Avatar>
          )}

          {/* </Badge> */}
        </Marker>
      );
    }
  };

  return (
    <>{renderEachUser()}</>
    // <Marker
    //   // position={{ lat: props.user.location.coordinates[1], lng: props.user.location.coordinates[0] }}
    //   longitude={props.user.location.coordinates[0]}
    //   latitude={props.user.location.coordinates[1]}
    //   offsetLeft={-3.5 * props.viewport.zoom}
    //   offsetTop={-7 * props.viewport.zoom}
    //   // ここonClickは、今自分がどのcomponent内にいるかで実行するものが変わるようにしたいんだよな。
    //   onClick={() => {
    //     // props.setIsUserIconClicked(true);
    //     if (props.setOpenSwipeableDrawer) {
    //       props.setOpenSwipeableDrawer(true);
    //     }
    //     // props.setUserInfo({ ...props.userInfo, info: props.user });
    //     props.clickMapUserActionCreator(props.user);
    //     props.clickUserActionCreator(props.user);
    //   }}
    // >
    //   <Popover
    //     id='mouse-over-popover'
    //     sx={{
    //       pointerEvents: 'none',
    //     }}
    //     open={open}
    //     anchorEl={anchorEl}
    //     anchorOrigin={{
    //       vertical: 'bottom',
    //       horizontal: 'left',
    //     }}
    //     transformOrigin={{
    //       vertical: 'top',
    //       horizontal: 'left',
    //     }}
    //     onClose={handlePopoverClose}
    //     disableRestoreFocus
    //   >
    //     <UserInfoCardNew user={props.user} />
    //   </Popover>
    //   {/* <Popup
    //     trigger={
    //       <Icon
    //         className={`${props.user._id === props.authState.currentUser._id ? 'blue' : 'green'} user icon`}
    //         size='large'
    //         style={{ cursor: 'pointer' }}
    //       />
    //     }
    //     content={
    //       <UserInfoCardNew
    //         user={props.user}
    //         socket={props.socket}
    //         setShowCallingModal={props.setShowCallingModal}
    //         setIsPopupOpen={setIsPopupOpen}
    //       />
    //     }
    //     open={isPopupOpen}
    //     onOpen={() => setIsPopupOpen(true)} //意味は、hoverした時にisPopupOpen stateをopenにします。ってこと。
    //     onClose={() => setIsPopupOpen(false)} // 意味は、hoverが外れた時にisPopupOpen stateをfalseにします、ってこと。
    //     basic
    //     hoverable
    //   ></Popup> */}
    //   <Icon
    //     className={`${props.user._id === props.authState.currentUser._id ? 'blue' : 'green'} user icon`}
    //     size='large'
    //     style={{ cursor: 'pointer' }}
    //     onMouseEnter={handlePopoverOpen}
    //     onMouseLeave={handlePopoverClose}
    //   />
    // </Marker>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState, clickedUserState: state.clickedUserState };
};

export default connect(mapStateToProps, {
  // clickUserActionCreator
  clickMapUserActionCreator,
  clickedUserChangedLoggedInStateActionCreator,
})(EachUserInfo);
