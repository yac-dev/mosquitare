import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getConversationActionCreator } from '../../actionCreators/conversationActionCreators';
import { getUserMediaActionCreator } from '../../actionCreators/userMediasActionCreators';

const ConversationVideo = (props) => {
  useEffect(() => {
    props
      .getConversationActionCreator(props.match.params.conversationid)
      .then(() => {
        return props.getUserMediaActionCreator('calledUser');
      })
      .then(() => {
        return props.getUserMediaActionCreator('recievedUser');
      });

    // 一応これでcalledUserMediaとrecievedUserediaの中身も引っ張ってこれている。
  }, []);

  const videosRender = () => {
    if (
      props.currentWatchingConversationState.calledUserVideo &&
      props.currentWatchingConversationState.recievedUserVideo
    ) {
      return (
        <div>
          {/* <img src={`data:image/jpeg;base64,${props.currentWatchingConversationState.calledUserVideo}`} /> */}
          <video
            // className='partner-video'
            // src={props.currentWatchingConversationState.calledUserVideo}
            // autoPlay
            style={{ width: '600px', height: '600px' }} // これだとなんで真ん中に寄ってくれるの？？
            controls
          >
            <source
              type='video/webm'
              src={`data:video/webm;base64,${props.currentWatchingConversationState.calledUserVideo}`}
              playsInline
            ></source>
          </video>
          {/* <video
            // className='partner-video'
            playsInline
            // ref={props.currentWatchingConversationState.recievedUserVideo} // ここstringのまま入れていいのかね？？なんか違う気がするんだよな。s3をreactでどうrenderするか、overflowで見てみるか。
            // autoPlay
            // src={props.currentWatchingConversationState.recievedUserVideo}
            style={{ width: '600px', height: '600px' }} // これだとなんで真ん中に寄ってくれるの？？
          /> */}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {/* <video
        src='uploadedFiles/3cd2559b-204b-46a0-a4fc-35a889c9e5af.mp4'
        playsInline
        muted
        autoPlay
        style={{ width: '600px', borderRadius: '20px' }}
      ></video>
      <video src='uploadedFiles/ef392537-cb27-48a3-8905-43467c3eef6b.mp4'></video> */}
      {videosRender()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { currentWatchingConversationState: state.currentWatchingConversationState };
};

export default connect(mapStateToProps, { getConversationActionCreator, getUserMediaActionCreator })(ConversationVideo);
