import React, { useState } from 'react';

import BasicUserInfo from './UserInfoHeader';
import VisitedMap from './VisitedMap';

//components
import UserInfoHeader from './UserInfoHeader';
import UserInfoTabs from './UserInfoTabs';

// mui icons
import LanguageIcon from '@mui/icons-material/Language';
import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 599 });
  return isMobile ? children : null;
};

const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

const UserInfoWrapper = (props) => {
  return (
    <>
      <Default>
        <div
          className='user-info-wrapperrrr'
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(232, 232, 232)',
            padding: '15px',
            color: 'black',
          }}
        >
          <UserInfoHeader
            user={props.user}
            socket={props.socket}
            setShowCallingModal={props.setShowCallingModal}
            showSendMessageModal={props.showSendMessageModal}
            setShowSendMessageModal={props.setShowSendMessageModal}
          />
          <UserInfoTabs
            user={props.user}
            showVideoModal={props.showVideoModal}
            setShowVideoModal={props.setShowVideoModal}
          />
        </div>
      </Default>
      <Mobile>
        <div
          className='user-info-wrapperrrr'
          style={{
            width: '100%',
            maxHeight: '1000px',
            backgroundColor: 'rgb(232, 232, 232)',
            padding: '15px',
            color: 'black',
          }}
        >
          <UserInfoHeader
            user={props.user}
            socket={props.socket}
            setShowCallingModal={props.setShowCallingModal}
            showSendMessageModal={props.showSendMessageModal}
            setShowSendMessageModal={props.setShowSendMessageModal}
          />
          <UserInfoTabs
            user={props.user}
            showVideoModal={props.showVideoModal}
            setShowVideoModal={props.setShowVideoModal}
          />
        </div>
      </Mobile>
    </>
  );
};

export default UserInfoWrapper;
