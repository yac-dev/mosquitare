import React, { useState } from 'react';

import BasicUserInfo from './UserInfoHeader';
import VisitedMap from './VisitedMap';

//components
import UserInfoHeader from './UserInfoHeader';
import UserInfoTabs from './UserInfoTabs';

// mui icons
import LanguageIcon from '@mui/icons-material/Language';

const UserInfoWrapper = (props) => {
  return (
    <div
      className='user-info-wrapperrrr'
      style={{ width: '100%', height: '100%', backgroundColor: 'rgb(232, 232, 232)', padding: '15px', color: 'black' }}
    >
      <UserInfoHeader user={props.user} socket={props.socket} setShowCallingModal={props.setShowCallingModal} />
      <UserInfoTabs user={props.user} />
      {/* <BasicUserInfo user={props.user} />
      <div className='visited-country' style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
        <span style={{ borderBottom: '1px solid black' }}>
          <LanguageIcon />
          Visited Country&nbsp;
        </span>
        {renderVisitedCountries()}
        {howMuchCompleted(props.userInfo.info.visited.length)}
        <VisitedMap
          worldMapSettings={props.worldMapSettings}
          setWorldMapSetting={props.setWorldMapSetting}
          visitedCountries={props.visitedCountries}
        />
      </div> */}
    </div>
  );
};

export default UserInfoWrapper;
