import React from 'react';
import UserDetail from './UserDetail';

const RightPositionedUserDetail = (props) => {
  return (
    <div
      className='user-detail-wrapper'
      // onMouseOver={() => {
      //   props.setWorldMapSetting({ ...props.worldMapSettings, dragPan: false, scrollZoom: false });
      // なんで急に効かなくなった？？？
      // }}
      style={{
        cursor: 'default',
        width: '35vw',
        height: '85vh',
        position: 'absolute',
        right: '50px',
        bottom: '50px',
      }}
    >
      <UserDetail
        socket={props.socket}
        isUserIconClicked={props.isUserIconClicked}
        userInfo={props.userInfo}
        setShowCallingModal={props.setShowCallingModal}
        worldMapSettings={props.worldMapSettings}
        setWorldMapSetting={props.setWorldMapSetting}
      />
    </div>
  );
};

export default RightPositionedUserDetail;
