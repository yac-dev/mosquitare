import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import DuoIcon from '@mui/icons-material/Duo';

// action creators
import { callActionCreator } from '../actionCreators/mediaActionCreator';

const CallButton = (props) => {
  const onCallClick = (event, oppositeSocketId, startLanguage) => {
    event.preventDefault();
    props.setIsPopupOpen(false);
    const mySocketId = props.authState.currentUser.socketId;
    props.setShowCallingModal(true);
    props.callActionCreator(props.socket, mySocketId, oppositeSocketId, startLanguage);
  };

  const checkCallableOrNot = () => {
    for (let i = 0; i < props.user.nativeLangs.length; i++) {
      for (let j = 0; j < props.authState.currentUser.learningLangs.length; j++) {
        if (props.user.nativeLangs[i].name === props.authState.currentUser.learningLangs[j].name) {
          return 'false';
        } else {
          return 'true';
        }
      }
    }
  }; // 分からん。。。

  const renderLanguageDropdownMenu = () => {
    const languageDropdown = props.user.nativeLangs.map((language) => {
      return (
        <Dropdown.Item
          label={{ color: 'red', empty: true, circular: true }}
          onClick={(event) => onCallClick(event, props.user.socketId, language)}
          // disabled={checkCallableOrNot()}
        >
          {language.name}&nbsp; <DuoIcon />
        </Dropdown.Item>
      );
    });

    return (
      <Dropdown
        text={`Call`}
        pointing='right'
        button
        floating
        labeled
        className='icon'
        style={{ backgroundColor: 'lightgreen' }}
      >
        <Dropdown.Menu>
          <Dropdown.Header content='Which language you wanna speak in with this partner?' />
          <Dropdown.Divider />
          {languageDropdown}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return <>{renderLanguageDropdownMenu()}</>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { callActionCreator })(CallButton);
