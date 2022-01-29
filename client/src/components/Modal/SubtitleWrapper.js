import React, { useState, useEffect, useRef } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import {
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
  I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER,
  I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER,
  MY_PARTNER_SEND_ME_INTERIM_TRANSCRIPT,
  MY_PARTNER_SEND_ME_FINAL_TRANSCRIPT,
} from '../../actionCreators/socketEvents';

import Subtitle from './Subtitle';

import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';
import { createUserScriptActionCreator } from '../../actionCreators/userScriptsActionCreators';
import { updateConversationUserScriptActionCreator } from '../../actionCreators/conversationActionCreators';

const SubtitleWrapper = (props) => {
  const [conversationNote, setConversationNote] = useState([{}]);
  const [myLearningLangTranscript, setMyLearningLangTranscript] = useState([]);
  const [myNativeLangTranscript, setMyNativeLangTranscript] = useState([]);
  const [partnerInterimTranscript, setPartnerInterimTranscript] = useState('');
  const [partnerFinalTranscript, setPartnerFinalTranscript] = useState('');

  // 課題は、interimの場合は一行に全部出して最後finalTranscript
  // 本当に表示させたいものだけconversationNoteをrenderさせるってすればいいのか。だから相手のfinalTranscriptだけをconversationNoteに入れて、interimは一時的な表示でいいってことだ。
  const { transcript, interimTranscript, finalTranscript, resetTranscript, listening } = useSpeechRecognition({});

  useEffect(() => {
    if (finalTranscript !== '') {
      // finalTranscriptの時
      console.log('Got final result:', finalTranscript);
      const transcriptObject = { name: 'you', transcript: finalTranscript };
      setConversationNote((previouState) => [...previouState, transcriptObject]);
      const to = store.getState().mediaState.callingWith.socketId;
      props.socket.emit(I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER, { to, finalTranscript });
      if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
        setMyLearningLangTranscript((previouState) => [...previouState, finalTranscript]); //globalなstateに保存しておいた方がいいかも。
      } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
        setMyNativeLangTranscript((previouState) => [...previouState, finalTranscript]);
      }
    }
    if (!finalTranscript) {
      // interimの時
      console.log('Im sending interim transcript to partner');
      console.log(interimTranscript);
      const to = store.getState().mediaState.callingWith.socketId;
      props.socket.emit(I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER, { to, interimTranscript });
    }
  }, [interimTranscript, finalTranscript]);

  useEffect(() => {
    if (!listening) {
      const lang = store.getState().mediaState.currentLanguage.codeForSpeechRecognition;
      SpeechRecognition.startListening({
        language: lang,
      });
    }
  }, [listening]); // 喋り終わったらrecognitionのlisteningが途切れる。それを再びonにする。

  // ------------------------ この二つで分けて行う。
  useEffect(() => {
    props.socket.on(MY_PARTNER_SEND_ME_FINAL_TRANSCRIPT, (dataFromServer) => {
      console.log('I got final transcript from partner');
      const transcriptObject = {};
      transcriptObject['name'] = props.mediaState.callingWith.name;
      transcriptObject['transcript'] = dataFromServer.finalTranscript;
      setPartnerInterimTranscript('');
      setConversationNote((previousState) => [...previousState, transcriptObject]);
    });
  }, []);

  useEffect(() => {
    props.socket.on(MY_PARTNER_SEND_ME_INTERIM_TRANSCRIPT, (dataFromServer) => {
      console.log('Im getting interim transcript from partner.', dataFromServer.interimTranscript);
      setPartnerInterimTranscript(dataFromServer.interimTranscript);
    });
  }, []);
  //--------------------------

  // useEffect(() => {
  //   props.socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (dataFromServer) => {
  //     console.log('partner sent to me...');
  //     console.log(dataFromServer.nativeLanguageScript); // koko
  //     setPartnerTranscript(dataFromServer.nativeLanguageScript);
  //     setPartnerTranscript('');
  //     setConversationNote((previouState) => [...previouState, dataFromServer.nativeLanguageScript]);
  //   });
  // }, []);

  // recieve側でのみerrroが怒っている。unmountのエラーが。caller側ではそもそも動いてすらない。
  useEffect(() => {
    if (props.mediaState.callDisconnected) {
      console.log('subtitle after finishing should work');
      SpeechRecognition.stopListening();
      props.createUserScriptActionCreator(myLearningLangTranscript, myNativeLangTranscript).then((userScript) => {
        return props.updateConversationUserScriptActionCreator(userScript);
      });
    }
  }, [props.mediaState.callDisconnected]);

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
    const transcripts = conversationNote.map((transcriptObject) => {
      return (
        <span>
          {transcriptObject.name}: {transcriptObject.transcript}
        </span>
      );
    });
    return <>{transcripts}</>;
  };

  const partnerInterimTranscriptRender = () => {
    if (partnerInterimTranscript) {
      return (
        <span>
          {props.mediaState.callingWith.name}: {partnerInterimTranscript}
        </span>
      );
    }
  };

  const myInterimTranscriptRender = () => {
    if (transcript) {
      return <span>You: {transcript}</span>;
    }
  };

  return (
    <div>
      <div>
        <span>listening: {listening ? 'on' : 'off'}</span>
        <button type='button' onClick={() => switchLanguage()}>
          Switch Lang
        </button>
      </div>
      <div>
        {transcriptsRender()}
        {partnerInterimTranscriptRender()}
        {myInterimTranscriptRender()}
        {/* transcript自体、finalになったら自動的に消える。だからtranscript renderてだけでいい。*/}
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
