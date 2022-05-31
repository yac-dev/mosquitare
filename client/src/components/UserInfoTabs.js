import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// mui icons
import TranslateIcon from '@mui/icons-material/Translate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MessageIcon from '@mui/icons-material/Message';
// components
import UserInfoLanguage from './UserInfoLanguage';
import UserInfoPersonal from './UserInfoPersonal';
import UserInfoVisited from './UserInfoVisited';
import UserInfoVideos from './UserInfoVideos';
import UserInfoMessage from './UserInfoMessage';
import Badge from '@mui/material/Badge';

import '../styles/tabs.css';

const UserInfoTabs = (props) => {
  const [key, setKey] = useState('personal');
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    let messagesBuffer = [];
    for (let i = 0; i < props.messagesState.length; i++) {
      if (props.messagesState[i].sender._id === props.user._id) {
        // if (!props.messagesState[i].read) {
        messagesBuffer.push(props.messagesState[i]);
        // }
      }
    }
    // setUnreadMessages(unreadMessagesBuffer);
    setBadgeCount(messagesBuffer.length);
  }, [props.user]);

  const renderLanguageTitle = () => {
    return (
      <>
        <TranslateIcon />
        <br></br>
        <span>Language</span>
      </>
    );
  };

  const renderPersonalTitle = () => {
    return (
      <>
        <AccountCircleIcon />
        <br></br>
        <span>Personal</span>
      </>
    );
  };

  const renderBeenTitle = () => {
    return (
      <>
        <MapIcon />
        <br></br>
        <span>Been</span>
      </>
    );
  };

  const renderPublicVideos = () => {
    return (
      <>
        <VideoLibraryIcon />
        <br></br>
        Videos
      </>
    );
  };

  const renderMessagesTitle = () => {
    return (
      <>
        <Badge
          badgeContent={badgeCount}
          color='success'
          sx={{
            '& .MuiBadge-badge': {
              color: 'white',
              backgroundColor: 'rgb(37, 95, 184)',
              '&:hover': {
                backgroundColor: 'rgb(37, 95, 194)',
              },
            },
          }}
        >
          <MessageIcon />
        </Badge>
        <br></br>
        Messages
      </>
    );
  };

  const renderVideosTab = () => {
    if (props.mediaState.amIRecieving || props.mediaState.amICalling) {
      return null;
    } else {
      return (
        <Tab eventKey='videos' title={renderPublicVideos()}>
          <UserInfoVideos
            user={props.user}
            showVideoModal={props.showVideoModal}
            setShowVideoModal={props.setShowVideoModal}
          />
        </Tab>
      );
    }
  };

  const renderMessagesTab = () => {
    if (!props.authState.currentUser) {
      return null;
    } else {
      return (
        <Tab eventKey='messages' title={renderMessagesTitle()}>
          <UserInfoMessage user={props.user} />
        </Tab>
      );
    }
  };

  return (
    <div className='user-info-tabs'>
      <Tabs id='controlled-tab-example' activeKey={key} onSelect={(k) => setKey(k)} className='mb-3'>
        <Tab eventKey='personal' title={renderPersonalTitle()}>
          <UserInfoPersonal user={props.user} />
        </Tab>
        <Tab eventKey='language' title={renderLanguageTitle()}>
          <UserInfoLanguage user={props.user} />
        </Tab>
        {renderVideosTab()}
        {renderMessagesTab()}
        {/* <Tab eventKey='videos' title={renderPublicVideos()}> */}
        {/* <UserInfoVideos
            user={props.user}
            showVideoModal={props.showVideoModal}
            setShowVideoModal={props.setShowVideoModal}
          /> */}
        {/* </Tab> */}
        {/* <Tab eventKey='been' title={renderBeenTitle()}>
          <UserInfoVisited user={props.user} />
        </Tab> */}
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mediaState: state.mediaState,
    authState: state.authState,
    messagesState: Object.values(state.messagesState),
  };
};

export default connect(mapStateToProps)(UserInfoTabs);
