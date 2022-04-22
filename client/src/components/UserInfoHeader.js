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
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import Badge from '@mui/material/Badge';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 27,
  height: 27,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

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
    if (!props.user.isAvailableNow) {
      return <p style={{ marginBottom: '10px' }}>&#9898;&nbsp;I'm not available now 💤🛌</p>;
    } else if (props.user.isAvailableNow && props.user.isInConversation) {
      return <p style={{ marginBottom: '10px' }}>&#128308;&nbsp;Conversation now ☎️</p>;
    } else if (props.user.isAvailableNow) {
      return <p style={{ marginBottom: '10px' }}>&#128994;&nbsp;I'm available now 😁</p>;
    }
  };

  const renderPersonalStatusAverage = (user) => {
    const ratingAverageArray = Object.values(user.ratingAverage).slice(0, 5);
    if (ratingAverageArray.every((element) => element === 0)) {
      return (
        <span style={{ color: 'white', backgroundColor: 'rgb(44, 184, 63)', padding: '5px', borderRadius: '5px' }}>
          New!
        </span>
      );
    }
    const initialValue = 0;
    // const sliced = user.ratingAverage.slice(0, 5);
    const sumWithInitial = ratingAverageArray.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
    );

    const average = Math.round((sumWithInitial / ratingAverageArray.length) * 10) / 10;
    if (average >= 7.5) {
      return (
        <span style={{ color: 'white', backgroundColor: 'rgb(37, 95, 184)', padding: '5px', borderRadius: '5px' }}>
          {average}
        </span>
      );
    } else if (average > 5.0 || average <= 7.4) {
      <span style={{ color: 'white', backgroundColor: 'rgb(206, 209, 52)', padding: '5px', borderRadius: '5px' }}>
        {average}
      </span>;
    } else if (average <= 4.9) {
      <span style={{ color: 'white', backgroundColor: 'rgb(186, 7, 43)', padding: '5px', borderRadius: '5px' }}>
        {average}
      </span>;
    }
  };

  // このcomponent名自体を後で変えた方がいい。このfunction名はこれでいい。
  const renderUserInfoHeader = (user) => {
    return (
      <div className='user-info-header' style={{ marginBottom: '20px' }}>
        <div className='user-info-header-flexbox' style={{ display: 'flex', marginBottom: '20px' }}>
          <div className='info-list' style={{ flex: 5, textAlign: 'center' }}>
            <div>
              <div style={{ margin: '10px', fontWeight: 'bolder' }}>
                {user.name}&nbsp;{renderPersonalStatusAverage(user)}
              </div>
              {renderUserState()}
              <p>{user.conversations.length} conversations</p>
            </div>
          </div>
          <div className='avatar-wrapper' style={{ flex: 5, display: 'flex', justifyContent: 'center' }}>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={<SmallAvatar src={user.nationalities[0].flagPics[0]} />}
            >
              {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
              <Avatar sx={{ width: 85, height: 85 }} alt={user.name}>
                {user.name}
              </Avatar>
              {/* <Avatar sx={{ cursor: 'pointer' }} alt={`${comment.user.name}`} /> */}
            </Badge>
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
