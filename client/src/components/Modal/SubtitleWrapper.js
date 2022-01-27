import React, { useState, useEffect, useRef } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import {
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
} from '../../actionCreators/socketEvents';

import Subtitle from './Subtitle';

import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';
import { createUserScriptActionCreator } from '../../actionCreators/userScriptsActionCreators';
import { updateConversationUserScriptActionCreator } from '../../actionCreators/conversationActionCreators';

const SubtitleWrapper = (props) => {
  const [conversationNote, setConversationNote] = useState([]);
  const [partnerTranscript, setPartnerTranscript] = useState();
  const [myLearningLangTranscript, setMyLearningLangTranscript] = useState([]);
  const [myNativeLangTranscript, setMyNativeLangTranscript] = useState([]);

  const { transcript, interimTranscript, finalTranscript, resetTranscript, listening } = useSpeechRecognition({});

  useEffect(() => {
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);

  useEffect(() => {
    if (!listening) {
      const lang = store.getState().mediaState.currentLanguage.codeForSpeechRecognition;
      SpeechRecognition.startListening({
        language: lang,
      });
      setConversationNote((previouState) => [...previouState, transcript]);
      const to = store.getState().mediaState.callingWith.socketId;
      props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
        to,
        nativeLanguageScript: transcript,
      });
      if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
        setMyLearningLangTranscript((previouState) => [...previouState, transcript]); // これこそ、globalなstateに保存しておいた方がいいな。だって最終的にmediarecorder側でやるもんな。
      } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
        setMyNativeLangTranscript((previouState) => [...previouState, transcript]);
      }
    }
  }, [listening]); // 喋り終わったらrecognitionのlisteningが途切れる。それを再びonにする。

  useEffect(() => {
    props.socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (dataFromServer) => {
      console.log('partner sent to me...');
      console.log(dataFromServer.nativeLanguageScript); // koko
      setPartnerTranscript(dataFromServer.nativeLanguageScript);
      setPartnerTranscript('');
      setConversationNote((previouState) => [...previouState, dataFromServer.nativeLanguageScript]);
    });
  }, []);

  // recieve側でのみerrroが怒っている。unmountのエラーが。caller側ではそもそも動いてすらない。
  useEffect(() => {
    if (!props.mediaState.callAccepted) {
      console.log('subtitle after finishing should work');
      SpeechRecognition.stopListening();
      props.createUserScriptActionCreator(myLearningLangTranscript, myNativeLangTranscript).then((userScript) => {
        return props.updateConversationUserScriptActionCreator(userScript);
      });
    }
  }, [props.mediaState.callAccepted]);

  // useEffect(() => {
  //   console.log('useEffect from subtitle');
  //   const lang = store.getState().mediaState.currentLanguage.codeForSpeechRecognition;
  //   SpeechRecognition.startListening({
  //     language: lang,
  //   });
  // }, [lang]); // 最初にまずここで、speechrecognitionをstartする。その後は、langが変わるたびにstartさせていく。

  const switchLanguage = () => {
    // setLang('ja-jp'); //言語を切り替えたら、自動でoffになるみたい。
    // SpeechRecognition.stopListening();
  };

  const transcriptsRender = () => {
    const transcripts = conversationNote.map((tscrpt) => {
      return <div>{tscrpt}</div>;
    });
    return <>{transcripts}</>;
  };

  return (
    <div>
      <div>
        <span>listening: {listening ? 'on' : 'off'}</span>
        <div>
          <button type='button' onClick={resetTranscript}>
            Reset
          </button>
          {/* <button type='button' onClick={listenContinuously}>
            Listen
          </button> */}
          {/* <button type='button' onClick={SpeechRecognition.stopListening}>
            Stop
          </button> */}
          <button type='button' onClick={() => switchLanguage()}>
            Switch Lang
          </button>
        </div>
      </div>
      {/* <div>{message}</div> */}
      <div>
        <span>{transcriptsRender()}</span>
        <span>{transcript}</span> {/* これって何で必要なんだっけ？？？ */}
        <span>{partnerTranscript}</span>
        {/* <span>{transcriptRender()}</span> */}
      </div>
    </div>
  );
  // return <></>; // subtitle wrapperみたいな感じに変えるのかね。// これはどういう意図で残していたんだろう。。。
};

// const SubtitleWrapper = (props) => {
//   // const [languageSubtitle, setLanguageSubtitle] = useState('');
//   const [languageSubtitles, setLanguageSubtitles] = useState([]); // ここ、component rerenderによって、useEffectが止まるんだわ。。。→親の方から渡すことにする。いや、そういうことでもない。。。なんなんだろ。。。

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   let recognition = useRef();
//   recognition.current = new SpeechRecognition();
//   // recognition.current.continuous = true;
//   recognition.current.interimResults = true;

//   useEffect(() => {
//     if (props.mediaState.callAccepted) {
//       const { currentLanguage } = store.getState().mediaState;
//       recognition.current.lang = currentLanguage.codeForSpeechrecognition;
//       recognition.current.start(); // onendをつけると、continueが160回繰り返されるのはなぜ。。。まじなぞ。
//       if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
//         // ここでlearning用の、recognitionでtranscriptionをsetStateするようにする。
//         const to = store.getState().mediaState.callingWith.socketId;
//         console.log('in useEffect');
//         // recognition.current.onend = () => {
//         //   recognition.current.start();
//         // };
//         recognition.current.onresult = (event) => {
//           // console.log(event);
//           const transcript = Array.from(event.results)
//             .map((result) => result[0])
//             .map((result) => result.transcript)
//             .join('');
//           console.log(transcript); // ここだけ出てるんだよな。brazil側がね。
//           props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
//             to,
//             nativeLanguageScript: transcript,
//           });
//           props.setLearningLanguageScript((previousState) => [...previousState, transcript]);
//           props.setLanguageSubtitles((previousState) => [...previousState, transcript]); // 結局これもだめかも。。。
//           // recognition.current.onend = () => {
//           //   recognition.current.start();
//           // }; // ほんと謎だわこれ。。。。これか？？
//           recognition.current.onend = () => {
//             recognition.current.start();
//           }; // ほんと謎だわこれ。。。。onspeechの後にこれを挟んでみるか。。。
//         };

//       } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
//         const to = store.getState().mediaState.callingWith.socketId;
//         console.log('india side workinggggggg???');
//         recognition.current.onresult = (event) => {
//           console.log('sending isFinal text.');
//           const transcript = Array.from(event.results)
//             .map((result) => result[0])
//             .map((result) => result.transcript)
//             .join('');
//           console.log(transcript);
//           // やっぱisFinalは必要かもしれん。
//           props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
//             to,
//             nativeLanguageScript: transcript,
//           });
//           props.setNativeLanguageScript((previousState) => [...previousState, transcript]);
//           props.setLanguageSubtitles((previousState) => [...previousState, transcript]); //結局これもだめかも。。。
//           recognition.current.onend = () => {
//             recognition.current.start(); // ここで確実に繰り返されるのかね。。。。分からんん。
//           }; // これでできちゃっているよ。。。あの悩んだ5日間はなんだったんだ。。。
//         };

//       }
//     }
//   }, [props.mediaState.callAccepted, languageSubtitles]); // 少なくとも、こっち側はgetVoiceTextを実行しないもんね。

//   return (
//     <>
//       <Subtitle
//         socket={props.socket}
//         languageSubtitles={languageSubtitles}
//         setLanguageSubtitles={setLanguageSubtitles}
//       />
//     </>
//   );
// };

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState };
};

export default connect(mapStateToProps, {
  getVoiceTextActionCreator,
  createUserScriptActionCreator,
  updateConversationUserScriptActionCreator,
})(SubtitleWrapper);
