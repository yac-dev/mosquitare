import React from 'react';
import UserDetail from './UserDetail';

const RightPositionedUserDetail = (props) => {
  return (
    <div
      className='user-detail-wrapper'
      style={{
        cursor: 'default',
        width: 450,
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
      />
    </div>
  );
};

export default RightPositionedUserDetail;
