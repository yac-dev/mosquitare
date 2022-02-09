import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';

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

  const renderLanguageDropdownMenu = () => {
    const languageDropdown = props.user.nativeLangs.map((language) => {
      return (
        <Dropdown.Item
          label={{ color: 'red', empty: true, circular: true }}
          // text=
          onClick={(event) => onCallClick(event, props.user.socketId, language)}
          style={{ color: 'black', backgroundColor: 'white' }}
        >
          {language.name}
          <VoiceChatIcon />
        </Dropdown.Item>
      );
    });

    return (
      <Dropdown
        text={`Call`}
        // pointing='left'
        button
        floating
        labeled
        className='icon'
      >
        <Dropdown.Menu>
          <Dropdown.Header
            // icon='tags'
            content='Which language you wanna speak?'
            style={{ color: 'black', backgroundColor: 'white' }}
          />
          <Dropdown.Divider style={{ color: 'black', backgroundColor: 'white' }} />
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
