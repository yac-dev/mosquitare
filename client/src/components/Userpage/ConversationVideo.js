import React, { useState, useEffect, useRef } from 'react';
import VideoElement from './VideoElement';
import { connect } from 'react-redux';
import { getConversationActionCreator } from '../../actionCreators/conversationActionCreators';
import { getUserMediaActionCreator } from '../../actionCreators/userMediasActionCreators';

const ConversationVideo = (props) => {
  // const calledUserVideoRef = useRef(null);
  // const recievedUserVideoRef = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const childRef = useRef();

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

  useEffect(() => {
    if (loaded === 2) {
      childRef.current.play();
    }
  }, [loaded]);

  const videosRender = () => {
    if (
      props.currentWatchingConversationState.calledUserVideo &&
      props.currentWatchingConversationState.recievedUserVideo
    ) {
      return (
        <div className='conversationvideo'>
          {/* <video ref={calledUserVideoRef} style={{ width: '600px', height: '600px' }}>
            <source
              type='video/webm'
              src={`data:video/webm;base64,${props.currentWatchingConversationState.calledUserVideo}`}
              playsInline
            ></source>
          </video>
          <video ref={recievedUserVideoRef} style={{ width: '200px', height: '200px' }}>
            <source
              type='video/webm'
              src={`data:video/webm;base64,${props.currentWatchingConversationState.recievedUserVideo}`}
              playsInline
            ></source>
          </video> */}
          <VideoElement ref={childRef} setLoaded={setLoaded} />
          <VideoElement ref={childRef} setLoaded={setLoaded} />
        </div>
      );
    } else {
      return null;
    }
  };

  const playVideos = () => {
    // ここでrefを選択していく。
    // calledUserVideoRef.current.play();
    // recievedUserVideoRef.current.play();
  }; // これだと、少しずれるて再生されてしまう。同時に再生させる

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
      {/* <button onClick={() => playVideos()}>Play!</button> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { currentWatchingConversationState: state.currentWatchingConversationState };
};

export default connect(mapStateToProps, { getConversationActionCreator, getUserMediaActionCreator })(ConversationVideo);
