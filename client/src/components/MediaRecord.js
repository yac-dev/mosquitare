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
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // callAcceptedが前提。
  useEffect(() => {
    const stream = store.getState().mediaState.myVideoStreamObject;
    mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    mediaRecorder.current.ondataavailable = (event) => {
      props.forChunks(event.data);
    };
    mediaRecorder.current.onstop = (event) => {
      setIsActive(false);
      const { chunks } = store.getState().mediaState;
      blobForVideo.current = new Blob(chunks, { type: 'video/mp4;' });
      blobForAudio.current = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
      console.log('record stopped!!!');
      Promise.resolve()
        .then(() => {
          return props.createUserMedia(blobForVideo.current, blobForAudio.current, seconds);
        })
        .then((userMedia) => {
          return props.updateConversationUserMediaActionCreator(userMedia);
        });
      // blob sizeを持っているか否かで挙動を変える。
      // 最初に電話を切った方で動く。
      // if (!store.getState()) {
      //   Promise.resolve()
      //     .then(() => {
      //       return props.createUserMedia(blobForVideo.current, blobForAudio.current);
      //     })
      //     .then((userMedia) => {
      //       return props.updateConversationUserMediaActionCreator(userMedia);
      //     })
      //     .then(() => {
      //       return props.sendBlobSizeToMyPartnerActionCreator(props.socket, blobForVideo.current.size);
      //     });
      // } else if (store.getState()) {
      //   const slicedBlobForVideo = blobForVideo.current.slice(0, store.getState());
      //   const slicedBlobForAudio = blobForAudio.current.slice(0, store.getState());
      //   Promise.resolve()
      //     .then(() => {
      //       return props.createUserMedia(slicedBlobForVideo, slicedBlobForAudio);
      //     })
      //     .then((userMedia) => {
      //       return props.updateConversationUserMediaActionCreator(userMedia);
      //     });
      // }
      // blobはglobalのstateで持っておいた方がいいかな。そういう考えも持っておこう。
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

export default connect(mapStateToProps, {
  forChunks,
  createUserMedia,
  updateConversationUserMediaActionCreator,
  sendBlobSizeToMyPartnerActionCreator,
})(MediaRecorderComponent);
