import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import store from '../store';

import { forChunks } from '../actionCreators/mediaActionCreator';

// componentの名前を何かのweb apiと同名にするすると訳わからなくなる。。。これまじ気をつけよう。
const MediaRecording = (props) => {
  // const [chunks, setChunks] = useState(); // redux使いましょうか。
  const mediaRecorder = useRef();
  const blobForVideo = useRef();
  const blobForAudio = useRef();

  // globalなstream stateを使ってmediaRecorderを起動する
  // callAcceptedが前提。
  useEffect(() => {
    const stream = store.getState().mediaState.myVideoStreamObject;
    mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    mediaRecorder.current.ondataavailable = (event) => {
      props.forChunks(event.data);
    };
    mediaRecorder.current.onstop = (event) => {
      const { chunks } = store.getState().mediaState;
      blobForVideo.current = new Blob(chunks, { type: 'video/mp4;' });
      blobForAudio.current = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
      // これはglobalのstateで持っておいた方がいいかな。そういう考えも持っておこう。
      console.log('record stopped!!!');
    };
    mediaRecorder.current.start();
  }, []);

  // callが切れたら、mediaRecorderをstopする。
  // asyncronousな挙動する。
  const stopMediaRecorder = () => {
    return new Promise((resolve, reject) => {
      mediaRecorder.current.stop();
      resolve();
    });
  };

  return (
    <>
      <button onClick={() => stopMediaRecorder()}>recordstop</button>
    </>
  );
};

export default connect(null, { forChunks })(MediaRecording);
