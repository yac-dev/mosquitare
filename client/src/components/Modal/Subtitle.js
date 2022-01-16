import React, { useEffect, useRef } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import {
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
} from '../../actionCreators/socketEvents';

import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';

const Subtitle = (props) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = useRef();
  recognition.current = new SpeechRecognition();
  recognition.current.continuous = true;
  recognition.current.interimResults = true;

  // useEffect(() => {
  //   props.socket.on(MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE, (dataFromServer) => {
  //     props.recieveSwitchingLanguageRequestActionCreator(
  //       dataFromServer.switchingLanguage,
  //       recognition.current,
  //       props.setNativeLanguageScript,
  //       props.socket
  //     );
  //     // props.recieveSwitchLanguage(dataFromServer.language); // ここで、向こうからのlanguageをredux stateに入れる。
  //     // const language = store.getState().mediaState.currentLanguage;
  //     // recognition.current.onend = () => {
  //     //   recognition.current.lang = language;
  //     //   recognition.current.start();
  //     // };
  //   });
  // }, []);

  useEffect(() => {
    props.getVoiceTextActionCreator(props.socket, props.setLanguageSubtitle);
  }, []);

  useEffect(() => {
    if (props.mediaState.callAccepted) {
      const { currentLanguage } = store.getState().mediaState;
      recognition.current.lang = currentLanguage.codeForSpeechrecognition;
      recognition.current.start(); // onendをつけると、continueが160回繰り返されるのはなぜ。。。まじなぞ。
      if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
        // ここでlearning用の、recognitionでtranscriptionをsetStateするようにする。
        console.log('in useEffect');
        recognition.current.onresult = (event) => {
          // console.log(event);
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
          console.log(transcript);
          props.setLearningLanguageScript(transcript);
        };

        // recognition.current.onerror = (event) => {
        //   console.log(event.error);
        // };
        // recognition.current.onend = () => {
        //   recognition.current.start();
        // }; // ほんと謎だわこれ。。。。
      } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
        const to = store.getState().mediaState.callingWith.socketId;
        console.log('india side workinggggggg???');
        recognition.current.onresult = (event) => {
          console.log('sending isFinal text.');
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
          console.log(transcript);
          // やっぱisFinalは必要かもしれん。
          props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
            to,
            nativeLanguageScript: transcript,
          });
          props.setNativeLanguageScript(transcript);
        };
        // recognition.current.onspeechend = () => {
        //   recognition.current.stop();
        // };
        // recognition.current.onerror = (event) => {
        //   console.log(event.error);
        // };
        // recognition.current.onend = () => {
        //   recognition.current.start(); // ここで確実に繰り返されるのかね。。。。分からんん。
        // };
        // recognition.current.start();
      }
    }
  }, [props.mediaState.callAccepted]);
  return <div>Our subtitle</div>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState };
};

export default connect(mapStateToProps, { getVoiceTextActionCreator })(Subtitle);
