import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import BarChartIcon from '@mui/icons-material/BarChart';
import TranslateIcon from '@mui/icons-material/Translate';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

// components
import CallButton from './CallButton';
import LanguageChart from './LanguageChart';

// css
import '../styles/userInfocardNew.css';

// action creatores
import { callActionCreator } from '../actionCreators/mediaActionCreator';
import { display } from '@mui/system';

const UserInfoCardNew = (props) => {
  // const onCallClick = (event, oppositeSocketId) => {
  //   event.preventDefault();
  //   props.setIsPopupOpen(false);
  //   const mySocketId = props.authState.currentUser.socketId;
  //   props.setShowCallingModal(true);
  //   props.callActionCreator(props.socket, mySocketId, oppositeSocketId);
  // };

  // flagは面倒くさそうだ。今はやめよう。
  const renderCountriesFlag = () => {};

  const renderUserStatus = (user) => {
    if (user.status.dating) {
      return <div>💓💓💓 I'm looking for dating partner 💓💓💓</div>;
    } else if (user.status.money) {
      return <div>💰💰💰 Help!! I need some money 💰💰💰</div>;
    } else if (user.status.dating && user.status.money) {
      return (
        <>
          <div>💓💓💓 I'm looking for dating partner 💓💓💓</div>
          <div>💰💰💰 Help!! I need some money 💰💰💰 Can you help me???</div>
        </>
      );
    } else {
      return null;
    }
  };

  const renderUserNativeLanguages = (user) => {
    const userNativeLanguages = user.nativeLangs.map((nativeLanguage) => {
      return (
        <>
          <div>{nativeLanguage.name}</div>
        </>
      );
    });

    return (
      <div className='user-native-languages'>
        <span style={{ borderBottom: '1px solid black' }}>native languages</span>
        {userNativeLanguages}
      </div>
    );
  };

  const renderUserLearningLanguages = (user) => {
    const userLearningLanguages = user.learningLangs.map((learningLanguage) => {
      return (
        <>
          <div>{learningLanguage.name}</div>
        </>
      );
    });

    return (
      <div className='user-learning-languages'>
        <span style={{ borderBottom: '1px solid black' }}>leaning languages</span>
        {userLearningLanguages}
      </div>
    );
  };

  const checkCallableOrNot = () => {
    // 最終的にboolを返せばいいか。
    for (let i = 0; i < props.authState.currentUser.learningLangs.length; i++) {
      for (let j = 0; j < props.user.nativeLangs.length; j++) {
        if (props.authState.currentUser.learningLangs[i].name === props.user.nativeLangs[j].name) {
          return true;
        }
      }
    }
    return false;
  };

  const renderLanguageChart = () => {
    // 今はとりあえず, if statementでrenderしておこう。
    // if (props.user.myLangs) {
    //   return <LanguageChart user={props.user} />;
    // } else {
    //   return null;
    // }
    // return ()
  };

  const renderUserInfoCard = () => {
    return (
      // <>
      //   <LanguageChart user={props.user} />
      // </>
      <div className='user-info-card' style={{ border: '1px solid red', padding: '10px' }}>
        <div className='user-info-overview'>
          {/* <div className='user-image'> */}
          <img className='user-image' src={props.user.photo} alt={props.user.name} style={{ borderRadius: '10px' }} />
          {/* </div> */}
          <div className='user-name-and-job'>
            <div className='user-name'>{props.user.name}</div>
            {/* <div className='user-job'>{props.user.job}</div> */}
          </div>
        </div>
        <div className='language-and-status' style={{ width: '300px', marginBottom: '10px' }}>
          <span className='header' style={{ borderBottom: '1px solid black' }}>
            <TranslateIcon />
            <BarChartIcon /> Languages &amp; Status{' '}
          </span>
          <Tooltip title='This shows you which language and how much this user speak.' placement='top'>
            <IconButton>
              <HelpIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <LanguageChart user={props.user} />
        </div>
        {/* <div className='user-personal-status'>{renderUserStatus()}</div> ここは後でrenderするようにする。*/}
        {/* <div className='user-language-overview'>
          <div className='languages-list'>
            {renderUserNativeLanguages(props.user)}
            {renderUserLearningLanguages(props.user)}
          </div>
        </div> */}

        <div className='user-message'>
          <div style={{ borderBottom: '1px solid black' }}>Self-Introduction</div>
          {props.user.selfIntroduction}
        </div>
        <CallButton
          user={props.user}
          socket={props.socket}
          setIsPopupOpen={props.setIsPopupOpen}
          setShowCallingModal={props.setShowCallingModal}
        />
        {/* <div className='languages-chart'>
          <LanguageChart user={props.user} />
        </div> */}
        {/* <Button
          positive
          // disabled={!props.mediaState}
          // disabled={checkCallableOrNot() ? 'false' : 'true'}
          onClick={(event) => onCallClick(event, props.user.socketId)}
          style={{ width: '80%' }}
        >
          <i className='video icon'>call</i>
        </Button> */}
      </div>
    );
  };

  return <>{renderUserInfoCard()}</>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { callActionCreator })(UserInfoCardNew);
