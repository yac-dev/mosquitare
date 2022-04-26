import React from 'react';
import UserDetail from './UserDetail';
import UserInfoWrapper from './UserInfoWrapper';

const RightPositionedUserDetail = (props) => {
  const renderRightPositionedUserInfo = () => {
    if (props.isUserIconClicked) {
      if (props.userInfo.info) {
        return (
          <div
            className='user-detail-wrapper'
            style={{
              cursor: 'default',
              width: '35vw',
              maxHeight: '85vh',
              position: 'absolute',
              right: '50px',
              top: '30px',
              backgroundColor: 'rgb(37, 95, 184)',
              padding: '10px',
              color: 'black',
            }}
          >
            <UserInfoWrapper
              user={props.userInfo.info}
              socket={props.socket}
              setShowCallingModal={props.setShowCallingModal}
              showVideoModal={props.showVideoModal}
              setShowVideoModal={props.setShowVideoModal}
              showSendMessageModal={props.showSendMessageModal}
              setShowSendMessageModal={props.setShowSendMessageModal}
            />
          </div>
        );
      }
    }
  };

  return (
    <>{renderRightPositionedUserInfo()}</>
    // <div
    //   className='user-detail-wrapper'
    //   onMouseOver={() => {
    //     props.setWorldMapSetting({ ...props.worldMapSettings, dragPan: false, scrollZoom: false });
    //   }}
    //   style={{
    //     cursor: 'default',
    //     width: '35vw',
    //     height: '85vh',
    //     position: 'absolute',
    //     right: '50px',
    //     top: '30px',
    //     backgroundColor: 'rgb(0, 96, 191)',
    //     padding: '10px',
    //     color: 'black',
    //   }}
    // >
    //   {/* <UserDetail
    //     socket={props.socket}
    //     isUserIconClicked={props.isUserIconClicked}
    //     userInfo={props.userInfo}
    //     setShowCallingModal={props.setShowCallingModal}
    //     worldMapSettings={props.worldMapSettings}
    //     setWorldMapSetting={props.setWorldMapSetting}
    //   /> */}
    // </div>
  );
};

export default RightPositionedUserDetail;
