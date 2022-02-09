import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'semantic-ui-react';

// components
import CallButton from './CallButton';

// css
import '../styles/userInfocardNew.css';

// action creatores
import { callActionCreator } from '../actionCreators/mediaActionCreator';

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

  const renderUserInfoCard = () => {
    return (
      <div className='user-info-card' style={{ border: '1px solid red' }}>
        <div className='user-overview'>
          <div className='user-image'></div>
          <div className='user-name-and-job'>
            <div className='user-name'>{props.user.name}</div>
            <div className='user-job'>{props.user.job}</div>
          </div>
        </div>
        {/* <div className='user-personal-status'>{renderUserStatus()}</div> ここは後でrenderするようにする。*/}
        <div className='user-language-overview'>
          <div className='languages-list'>
            {renderUserNativeLanguages(props.user)}
            {renderUserLearningLanguages(props.user)}
          </div>
          <div className='languages-chart'>chart here!!</div>
        </div>
        <div className='user-message'>{props.user.description}</div>
        <CallButton
          user={props.user}
          socket={props.socket}
          setIsPopupOpen={props.setIsPopupOpen}
          setShowCallingModal={props.setShowCallingModal}
        />
        {/* <Button
          positive
          // disabled={!props.mediaState} // このuserのnative langsの中に、自分の言語が入っていない時。でもこれって結構計算することになるよな。全員分となると多分きついんじゃないか。。。
          // disabled={checkCallableOrNot() ? 'false' : 'true'} ここのcallable checkは後でいいや。
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
