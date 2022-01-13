import React, { useState, useEffect, useRef } from 'react';
import VideoElement from './VideoElement';
import DecoratedVideoElement from './DecoratedVideoElement';
import { connect } from 'react-redux';
import { getConversationActionCreator } from '../../actionCreators/conversationActionCreators';
import { getUserMediaActionCreator } from '../../actionCreators/userMediasActionCreators';

const ConversationVideo = (props) => {
  // const calledUserVideoRef = useRef(null);
  // const recievedUserVideoRef = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const childRef1 = useRef();
  const childRef2 = useRef();

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
      console.log(loaded);
      console.log(childRef1.current);
      console.log(childRef2.current);
      childRef1.current.play();
      childRef2.current.play();
    }
  }, [loaded]); // pauseやら巻き戻しできるようなseekbarも設けないといけない。後で。

  const videosRender = () => {
    if (
      props.currentWatchingConversationState.calledUserVideo &&
      props.currentWatchingConversationState.recievedUserVideo
    ) {
      return (
        <div className='conversationvideo'>
          {/* <VideoElement ref={childRef} setLoaded={setLoaded} /> */} {/* これと↓ではだめみたいだなー。 */}
          {/* <VideoElement ref={childRef} setLoaded={setLoaded} /> */}
          <DecoratedVideoElement ref={childRef1} setLoaded={setLoaded} />
          <DecoratedVideoElement ref={childRef2} setLoaded={setLoaded} />
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
      {/* <button onClick={() => playVideos()}>Play!</button> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { currentWatchingConversationState: state.currentWatchingConversationState };
};

export default connect(mapStateToProps, { getConversationActionCreator, getUserMediaActionCreator })(ConversationVideo);
