import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import store from '../store';

import { forChunks } from '../actionCreators/mediaActionCreator';
import { createUserMedia } from '../actionCreators/userMediasActionCreators';
import { updateConversationUserMediaActionCreator } from '../actionCreators/conversationActionCreators';

// componentの名前を何かのweb apiと同名にするすると訳わからなくなる。。。これまじ気をつけよう。
const MediaRecorderComponent = (props) => {
  // const [chunks, setChunks] = useState(); // redux使いましょうか。
  const mediaRecorder = useRef();
  const blobForVideo = useRef();
  const blobForAudio = useRef();

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
      // blobはglobalのstateで持っておいた方がいいかな。そういう考えも持っておこう。
      console.log('record stopped!!!');
      Promise.resolve()
        .then(() => {
          return props.createUserMedia(blobForVideo.current, blobForAudio.current);
        })
        .then((userMedia) => {
          return props.updateConversationUserMediaActionCreator(userMedia);
        });
    };
    mediaRecorder.current.start();
  }, []);

  useEffect(() => {
    if (props.mediaState.callDisconnected) {
      mediaRecorder.current.stop();
    }
  }, [props.mediaState.callDisconnected]);

  return <></>;
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, { forChunks, createUserMedia, updateConversationUserMediaActionCreator })(
  MediaRecorderComponent
);
