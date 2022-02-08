import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-map-gl';
import { Icon, Popup, Button } from 'semantic-ui-react';

// components
// それぞれのuser markerが、popupに関するstateを持ってなきゃいかん。だからEachUserInfoを別で作って、renderした。
import EachUserInfo from './EachUserInfo';

// usersを全部renderするためのもん。
const UsersMarker = (props) => {
  const [viewport, setViewport] = useState({ latitude: 47.040182, longitude: 17.071727, zoom: 1 });

  if (props.usersState) {
    const usersRender = props.usersState.map((user) => {
      if (user.isOnline && !user.isInConversation) {
        return (
          <>
            <EachUserInfo
              viewport={viewport}
              setViewport={setViewport}
              socket={props.socket}
              user={user}
              setShowCallingModal={props.setShowCallingModal}
            />
          </>
        );
      } else {
        return null;
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
