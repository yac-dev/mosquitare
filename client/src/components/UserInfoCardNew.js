import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

const UserInfoCardNew = (props) => {
  const onCallClick = (event, user) => {
    props.setIsPopupOpen(false);
    props.onCallClick(event, user.socketId);
  };

  const renderUserInfoCard = () => {
    return (
      <div style={{ border: '1px solid red' }}>
        <div>{props.user.name}</div>
        <div>{props.user.email}</div>
        <Button
          positive
          // disabled={!props.mediaState}
          // onClick={(event) => props.onCallClick(event, user.socketId)}
          onClick={() => props.setIsPopupOpen(false)}
          style={{ width: '100%' }}
        >
          <i className='video icon'>call</i>
        </Button>
      </div>
    );
  };

  return <>{renderUserInfoCard()}</>;
};

export default UserInfoCardNew;
