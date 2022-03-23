import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import store from '../store';

import { forChunks } from '../actionCreators/mediaActionCreator';
import { createUserMedia } from '../actionCreators/userMediasActionCreators';
import { updateConversationUserMediaActionCreator } from '../actionCreators/conversationActionCreators';
import { sendBlobSizeToMyPartnerActionCreator } from '../actionCreators/mediaActionCreator';

// componentの名前を何かのweb apiと同名にするすると訳わからなくなる。。。これまじ気をつけよう。
const MediaRecorderComponent = (props) => {
  // const [chunks, setChunks] = useState(); // redux使いましょうか。
  const mediaRecorder = useRef();
  const blobForVideo = useRef();
  const blobForAudio = useRef();
  const [duration, setDuration] = useState(0);
  const durationRef = useRef();

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setDuration((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // callAcceptedが前提。
  useEffect(() => {
    const stream = store.getState().mediaState.myVideoStreamObject;
    try {
      mediaRecorder.current = new MediaRecorder(
        stream,
        // { mimeType: 'audio/webm;codecs=opus' }
        { mimeType: 'video/webm' }
      );
    } catch (error) {
      // for iphone
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'video/mp4' });
    }
    mediaRecorder.current.ondataavailable = (event) => {
      props.forChunks(event.data);
    };
    mediaRecorder.current.onstop = (event) => {
      const { chunks } = store.getState().mediaState;
      blobForVideo.current = new Blob(chunks, { type: 'video/mp4;' });
      // blobForAudio.current = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
      console.log('record stopped!!!');
      // console.log('duration time: ', duration)

      Promise.resolve().then(() => {
        return props.createUserMedia(blobForVideo.current, durationRef.current);
      });
      // blobはglobalのstateで持っておいた方がいいかな。そういう考えも持っておこう。
    };
    mediaRecorder.current.start();
  }, []);

  // hangup buttonを押すと、callDisconnectedがtrueになってここが動く
  // useEffect(() => {
  //   if (props.mediaState.callDisconnected) {
  //     mediaRecorder.current.stop();
  //   }
  // }, [props.mediaState.callDisconnected]);

  useEffect(() => {
    return () => {
      // setIsActive(false);
      mediaRecorder.current.stop();
    };
  }, []);

  return <></>;
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, {
  forChunks,
  createUserMedia,
  updateConversationUserMediaActionCreator,
  sendBlobSizeToMyPartnerActionCreator,
})(MediaRecorderComponent);
