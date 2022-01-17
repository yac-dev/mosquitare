import React, { useState, useEffect, useRef } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import {
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
} from '../../actionCreators/socketEvents';

import Subtitle from './Subtitle';

import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';

const SubtitleWrapper = (props) => {
  // const [languageSubtitle, setLanguageSubtitle] = useState('');
  const [languageSubtitles, setLanguageSubtitles] = useState([]);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = useRef();
  recognition.current = new SpeechRecognition();
  // recognition.current.continuous = true;
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

  // useEffect(() => {
  //   props.getVoiceTextActionCreator(props.socket, setLanguageSubtitle); // そもそものreact, reduxの知識不足？？？
  // }, []); // 唯一の違いは、これが動いているか動いていないか。

  // そもそもこのcode自体をもっと改善できるのかね。。。
  useEffect(() => {
    if (props.mediaState.callAccepted) {
      const { currentLanguage } = store.getState().mediaState;
      recognition.current.lang = currentLanguage.codeForSpeechrecognition;
      recognition.current.start(); // onendをつけると、continueが160回繰り返されるのはなぜ。。。まじなぞ。
      if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
        // ここでlearning用の、recognitionでtranscriptionをsetStateするようにする。
        const to = store.getState().mediaState.callingWith.socketId;
        console.log('in useEffect');
        // recognition.current.onend = () => {
        //   recognition.current.start();
        // };
        recognition.current.onresult = (event) => {
          // console.log(event);
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
          console.log(transcript); // ここだけ出てるんだよな。brazil側がね。
          props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
            to,
            nativeLanguageScript: transcript,
          });
          props.setLearningLanguageScript((previousState) => [...previousState, transcript]);
          setLanguageSubtitles((previousState) => [...previousState, transcript]);
          // recognition.current.onend = () => {
          //   recognition.current.start();
          // }; // ほんと謎だわこれ。。。。これか？？
          recognition.current.onend = () => {
            recognition.current.start();
          }; // ほんと謎だわこれ。。。。onspeechの後にこれを挟んでみるか。。。
        };

        // recognition.current.onerror = (event) => {
        //   console.log(event.error);
        // };
        // recognition.current.onspeechend = () => {
        //   recognition.current.stop();
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
          props.setNativeLanguageScript((previousState) => [...previousState, transcript]);
          setLanguageSubtitles((previousState) => [...previousState, transcript]);
          recognition.current.onend = () => {
            recognition.current.start(); // ここで確実に繰り返されるのかね。。。。分からんん。
          }; // これでできちゃっているよ。。。あの悩んだ5日間はなんだったんだ。。。
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
  }, [props.mediaState.callAccepted]); // 少なくとも、こっち側はgetVoiceTextを実行しないもんね。

  // const displaySubtitle = () => {
  //   if (languageSubtitle) {
  //     return (
  //       <div className='partner-subtitle'>
  //         <p className='voice-text' style={{ color: 'red' }}>
  //           {languageSubtitle}
  //         </p>
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <>
      <Subtitle
        socket={props.socket}
        languageSubtitles={languageSubtitles}
        setLanguageSubtitles={setLanguageSubtitles}
      />
    </>
  ); // subtitle wrapperみたいな感じに変えるのかね。
};

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState };
};

export default connect(mapStateToProps, { getVoiceTextActionCreator })(SubtitleWrapper);
