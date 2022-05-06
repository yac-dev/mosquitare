import React, { useState } from 'react';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// mui icons
import TranslateIcon from '@mui/icons-material/Translate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// components
import UserInfoLanguage from './UserInfoLanguage';
import UserInfoPersonal from './UserInfoPersonal';
import UserInfoVisited from './UserInfoVisited';
import UserInfoVideos from './UserInfoVideos';

import '../styles/tabs.css';

const UserInfoTabs = (props) => {
  const [key, setKey] = useState('personal');

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
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps)(UserInfoTabs);
