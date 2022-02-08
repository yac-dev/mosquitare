import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

// action creatores
import { callActionCreator } from '../actionCreators/mediaActionCreator';

const UserInfoCardNew = (props) => {
  const onCallClick = (event, oppositeSocketId) => {
    event.preventDefault();
    props.setIsPopupOpen(false);
    const mySocketId = props.authState.currentUser.socketId;
    props.setShowCallingModal(true);
    props.callActionCreator(props.socket, mySocketId, oppositeSocketId);
  };

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
          <div>💰💰💰 Help!! I need some money 💰💰💰</div>
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
        native languages
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
        leaning languages
        {userLearningLanguages}
      </div>
    );
  };

  const renderUserInfoCard = () => {
    return (
      <div style={{ border: '1px solid red' }}>
        <div className='user-overview'>
          <div>{props.user.name}</div>&nbsp;
          <div>{props.user.job}</div>
        </div>
        {/* <div className='user-personal-status'>{renderUserStatus()}</div> */}
        <div className='user-language-overview'>
          {/* ここのwrapper、cssでgridにしましょう。*/}
          <div className='languages-list'>
            {renderUserNativeLanguages(props.user)}
            {renderUserLearningLanguages(props.user)}
          </div>
          <div className='languages-chart'>chart here!!</div>
        </div>
        <div className='user-message'>{props.user.description}</div>
        <Button
          positive
          // disabled={!props.mediaState}
          onClick={(event) => onCallClick(event, props.user.socketId)}
          style={{ width: '100%' }}
        >
          <i className='video icon'>call</i>
        </Button>
      </div>
    );
  };

  return <>{renderUserInfoCard()}</>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { callActionCreator })(UserInfoCardNew);
