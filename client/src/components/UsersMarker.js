import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';

// components
import UserInfoCard from './UserInfoCard';

const UsersMarker = (props) => {
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });

  if (props.usersState) {
    const usersRender = props.usersState.map((user) => {
      if (user.isOnline && !user.isInConversation) {
        return (
          <>
            <Marker
              longitude={user.location.coordinates[0]}
              latitude={user.location.coordinates[1]}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Popup
                trigger={
                  <Icon
                    className='green user icon'
                    size='large'
                    style={{ cursor: 'pointer' }}
                    // onMouseOver={() => setIsPopupOpen(true)}
                    // onMouseLeave={() => setIsPopupOpen(false)}
                  />
                }
                // flowing
                hoverable
                // on='click'
                // open={isPopupOpen}
                // onOpen={() => setIsPopupOpen(true)} ここまじで分かんね。。。。。
              >
                {/* <ConfirmationCard callback={onCallClick} socketId={user.socketId} user={user} /> */}
                <UserInfoCard user={user} />
                <Button
                  positive
                  disabled={!props.mediaState}
                  onClick={(event) => props.onCallClick(event, user.socketId)}
                  style={{ width: '100%' }}
                >
                  <i className='video icon'>call</i>
                </Button>
              </Popup>
            </Marker>
          </>
        );
      }
    });
    return <>{usersRender}</>;
  } else {
    return null;
  }
};

const mapStateToProps = (state) => {
  return { usersState: Object.values(state.usersState), mediaState: state.mediaState };
};

export default connect(mapStateToProps)(UsersMarker);
