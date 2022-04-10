import React, { useState } from 'react';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// components
import LanguageChart from './LanguageChart';
import CallButton from './CallButton';

// mui icons
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
// mui components
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

const BasicUserInfo = (props) => {
  const renderCardHeaderTitle = (user) => {
    const renderNationalities = user.nationalities.map((nationality) => {
      return (
        <>
          <img src={nationality.flagPics[0]} style={{ width: '16px', height: '10px' }} />
          &nbsp;
        </>
      );
    });

    return (
      <>
        {renderNationalities}&nbsp;
        {user.name}
      </>
    );
  };

  const renderActionButtons = () => {
    if (props.user._id === props.authState.currentUser._id) {
      return null;
    } else if (props.mediaState.amIRecieving) {
      return null;
    } else if (props.mediaState.callAccepted) {
      return null;
    } else {
      return (
        <div className='action-button-wrapper' style={{ display: ' flex', justifyContent: 'center' }}>
          <CallButton
            socket={props.socket}
            user={props.user}
            setShowCallingModal={props.setShowCallingModal}
            setOpenSwipeableDrawer={props.setOpenSwipeableDrawer}
          />
        </div>
      );
    }
  };

  const renderUserState = () => {
    if (!props.user.isOnline || !props.user.isReady) {
      return <p>&#9898;&nbsp;I'm not available now 💤🛌</p>;
    } else if (props.user.isOnline && props.user.isInConversation) {
      return <p>&#128308;&nbsp;Conversation now ☎️</p>;
    } else if (props.user.isOnline) {
      return <p>&#128994;&nbsp;I'm available now 😁</p>;
    }
  };

  // このcomponent名自体を後で変えた方がいい。このfunction名はこれでいい。
  const renderUserInfoHeader = (user) => {
    return (
      <div className='user-info-header' style={{ marginBottom: '20px' }}>
        <div className='user-info-header-flexbox' style={{ display: 'flex', marginBottom: '20px' }}>
          <div className='info-list' style={{ width: '70%' }}>
            <p>{renderCardHeaderTitle(user)}</p>
            {/* <p>Currently living in&nbsp;{user.location.name}</p> */}
            <p>{user.conversations.length} conversations</p>
            {renderUserState()}
          </div>
          <div className='avatar-wrapper' style={{ width: '30%', display: ' flex', justifyContent: 'center' }}>
            <Avatar sx={{ width: 70, height: 70 }} alt={user.name}>
              {user.name}
            </Avatar>
          </div>
        </div>
        {renderActionButtons()}
      </div>
    );
  };

  return (
    <div className='user-info-wrapper'>{renderUserInfoHeader(props.user)}</div>
    // <div className='basic-user-info' style={{ width: '100%', height: props.height, backgroundColor: 'white' }}>
    //   <div>
    //     <Card sx={{ marginBottom: '10px' }}>
    //       <CardHeader
    //         avatar={<Avatar alt={props.user.name}>{props.user.name}</Avatar>}
    //         title={renderCardHeaderTitle(props.user)}
    //         subheader={props.user.selfIntroduction}
    //       />
    //     </Card>
    //   </div>
    //   <div
    //     className='personal-status'
    //     style={{ padding: '10px', marginBottom: '10px', backgroundColor: 'white', borderRadius: '5px' }}
    //   >
    //     <h6 style={{ borderBottom: '1px solid black' }}>
    //       <PersonIcon />
    //       Personal Status&nbsp;
    //       <Tooltip title='This chart represents what language and how much the user speaks'>
    //         <HelpIcon />
    //       </Tooltip>
    //     </h6>
    //     {renderPersonalStatus(props.user)}
    //   </div>
    //   <div
    //     className='language-stat'
    //     style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px', marginBottom: '10px' }}
    //   >
    //     <h6 style={{ borderBottom: '1px solid black' }}>
    //       <BarChartIcon />
    //       Language Status&nbsp;
    //       <Tooltip title='This chart represents what language and how much the user speaks'>
    //         <HelpIcon />
    //       </Tooltip>
    //     </h6>

    //     <div className='language-status-flexbox' style={{ display: 'flex' }}>
    //       <div
    //         className='language-list'
    //         style={{
    //           width: '40%',
    //         }}
    //       >
    //         {renderNativeLanguages(props.user)}
    //         {renderLearningLanguages(props.user)}
    //       </div>
    //       <div className='language-chart' style={{ width: '60%' }}>
    //         <LanguageChart user={props.user} />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState };
};

export default connect(mapStateToProps)(BasicUserInfo);
