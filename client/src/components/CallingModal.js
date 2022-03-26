import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
// import { Button } from 'semantic-ui-react';

// mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import MoodIcon from '@mui/icons-material/Mood';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { styled } from '@mui/system';
import HailIcon from '@mui/icons-material/Hail';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// components
import Dimer from './Dimer';
import UserInfoCardNew from './UserInfoCardNew';
// import UserInfoCard from './UserInfoCard';

// css
import '../styles/callingModal.css';
import '../styles/userInfocardNew.css';

import { answerCallActionCreator1 } from '../actionCreators/mediaActionCreator';
import { myCallIsAcceptedActionCreator } from '../actionCreators/mediaActionCreator';
import { rejectCallActionCreator } from '../actionCreators/mediaActionCreator';
import { gotRejectedMyCallActionCreator } from '../actionCreators/mediaActionCreator';
import history from '../history';

const CancelButton = styled(Button)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(230, 5, 47)',
  '&:hover': {
    backgroundColor: 'rgb(191, 15, 48)',
  },
}));

const YesButton = styled(Button)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(36, 105, 212)',
  '&:hover': {
    backgroundColor: 'rgb(18, 111, 255)',
  },
}));

const CallingModal = (props) => {
  // modal bodyがcallをかけたか受けたかで変わるようにする。

  useEffect(() => {
    // 少なくとも、ここのcomponentでは、refをもたない。refを持つのはfulscreenの方だからね。
    props.myCallIsAcceptedActionCreator(props.socket, props.setShowCallingModal);
  }, []);

  useEffect(() => {
    props.gotRejectedMyCallActionCreator(props.socket);
  }, []);

  const handleAnswerCall = () => {
    props.setShowCallingModal(false);
    props.answerCallActionCreator1(); // これを閉じて、fullscreenまでは出た。
  };

  const handleRejectCall = () => {
    props.rejectCallActionCreator(props.socket);
    props.setShowCallingModal(false);
  };

  const switchRender = () => {
    if (props.mediaState.amICalling) {
      return (
        <>
          <div className='dimmer-wrapper'>
            <Dimer />
            {/* <Box sx={{ display: 'flex' }}>
              <p>Please wait till your call accepted....</p>
              <CircularProgress />
            </Box> */}
          </div>
        </>
      );
    } else if (props.mediaState.amIRecieving) {
      const { exchangingLanguages } = props.mediaState;
      return (
        <>
          <div>You got a exchange application.</div>
          <div>
            Lets exchange{' '}
            {/* {exchangingLanguages.map((language) => {
              return <span>{language}</span>;
            })} */}
          </div>
          <UserInfoCardNew user={props.mediaState.callingWith} />
          {/* <Button positive onClick={() => handleAnswerCall()} style={{ width: '70%' }}>
            <i className='handshake icon' />
            Yes
          </Button>
          <Button negative style={{ width: '70%' }}>
            <i className='x icon' />
            No
          </Button> */}
          {/* <div className='confirmation'>
            <div className='userinfo-card'>
              <div className='upper-card'>
                <div className='language-space'>
                  {props.mediaState.callingWith.nativeLangs.map((lang) => (
                    <div className='speaking-languages'>
                      {lang.name} &nbsp;
                      <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
                    </div>
                  ))}

                  {props.mediaState.callingWith.learningLangs.map((lang) => (
                    <div className='learning-languages'>
                      {lang.name} &nbsp;
                      <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
                    </div>
                  ))}
                </div>
                <div className='userinfo-space'>
                  <div>Total Status</div>
                  <div>{props.mediaState.callingWith.name}</div>
                  <div>Job</div>
                  {props.mediaState.callingWith.nationalities.map((nationality) => (
                    <div className='countries'>
                      {nationality.name} &nbsp;
                      <img className='country-img' src={nationality.flagPic} />
                    </div>
                  ))}
                </div>
              </div>
              <div className='lower-card'>
                <div>Respectful</div>
                <div>Student</div>
                <div>Teacher</div>
              </div>
            </div>
            <Button positive onClick={() => handleAnswerCall()} style={{ width: '100%' }}>
              <i className='handshake icon' />
              Yes
            </Button>
            <Button negative style={{ width: '100%' }}>
              <i className='x icon' />
              No
            </Button>
          </div> */}
        </>
      );
    }
  };

  const renderRejectedMessage = () => {
    if (props.mediaState.gotRejected) {
      return (
        <>
          <NoAccountsIcon />
          <div style={{ color: 'black' }}>Sorry, your partner is not available now...</div>
        </>
      );
    }
  };

  // ここのfooterはcallingかrecievingかで分けよう。
  const renderFooter = () => {
    if (props.mediaState.gotRejected) {
      return (
        <>
          <Stack direction='row' spacing={2}>
            <Button
              variant='contained'
              onClick={() => {
                props.setShowCallingModal(false);
                window.location = '/worldmap'; // まあこれでいいのかね。
              }}
            >
              Got it
            </Button>
          </Stack>
        </>
      );
    } else if (props.mediaState.amIRecieving) {
      return (
        <>
          <Stack direction='row' spacing={2}>
            <YesButton variant='contained' startIcon={<MoodIcon />} onClick={() => handleAnswerCall()}>
              Yes, lets talk!
            </YesButton>
            <CancelButton variant='contained' startIcon={<MoodBadIcon />} onClick={() => handleRejectCall()}>
              Sorry
            </CancelButton>
          </Stack>
        </>
      );
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={() => props.setShowCallingModal(false)} backdrop='static' keyboard={false}>
        <Modal.Body bsPrefix='calling-modal-body'>
          {switchRender()}
          {renderRejectedMessage()}
        </Modal.Body>
        <Modal.Footer>{renderFooter()}</Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, {
  answerCallActionCreator1,
  myCallIsAcceptedActionCreator,
  rejectCallActionCreator,
  gotRejectedMyCallActionCreator,
})(CallingModal);
