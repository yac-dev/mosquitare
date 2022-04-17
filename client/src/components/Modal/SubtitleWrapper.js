import React, { useState, useEffect, useRef } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import axios from 'axios';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// ac
import TranslateTranscript from '../TranslateTranscript';

// mui
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TranslateIcon from '@mui/icons-material/Translate';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import GTranslateIcon from '@mui/icons-material/GTranslate';

// socket event
import {
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
  I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER,
  I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER,
  MY_PARTNER_SEND_ME_INTERIM_TRANSCRIPT,
  MY_PARTNER_SEND_ME_FINAL_TRANSCRIPT,
} from '../../actionCreators/socketEvents';

import Subtitle from './Subtitle';

// ac
import { createUserScriptActionCreator } from '../../actionCreators/userScriptsActionCreators';
import { updateConversationUserScriptActionCreator } from '../../actionCreators/conversationActionCreators';
import { updateUserMyLangsStatusActionCreator } from '../../actionCreators/authActionCreators';
import { switchCurrentLanguageActionCreator1 } from '../../actionCreators/mediaActionCreator';
import { recieveSwitchingLanguageRequestActionCreator1 } from '../../actionCreators/mediaActionCreator';

// css
import '../../styles/transcript.css';

const SwitchLanguageIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(35, 63, 105)',
  '&:hover': {
    backgroundColor: 'rgb(39, 78, 138)',
  },
}));

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(237, 85, 85)',
  '&:hover': {
    backgroundColor: 'rgb(245, 27, 27)',
  },
}));

// const appId = '<INSERT_SPEECHLY_APP_ID_HERE>';
// const appId = process.env.REACT_APP_POLYFILL_ID_FOR_SPEECH_RECOGNITION;
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const SubtitleWrapper = (props) => {
  const [conversationTranscript, setConversationTranscript] = useState([]);
  const [myLearningLangTranscript, setMyLearningLangTranscript] = useState([]);
  const [myNativeLangTranscript, setMyNativeLangTranscript] = useState([]);
  const [partnerInterimTranscript, setPartnerInterimTranscript] = useState();
  const [partnerFinalTranscript, setPartnerFinalTranscript] = useState(0);
  // const [countLearningLangLength, setCountLearningLangLength] = useState(0);
  // const [countNativeLangLength, setCountNativeLangLength] = useState(0);
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const conversationTranscriptRef = useRef();
  const myLearningLangTranscriptRef = useRef();
  const myNativeLangTranscriptRef = useRef();

  const transcriptsEndRef = useRef(null);

  const [seconds, setSeconds] = useState(0);
  const [startSeconds, setStartSeconds] = useState();
  const secondsRef = useRef();

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);
  // 本当は秒数まで入れたいが、そこまでいくと時間かかるわ。やめておこう。

  const scrollToBottom = () => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationTranscript, partnerInterimTranscript]);

  const { transcript, interimTranscript, finalTranscript, resetTranscript, listening } = useSpeechRecognition({});

  useEffect(() => {
    conversationTranscriptRef.current = conversationTranscript;
  }, [conversationTranscript]);

  useEffect(() => {
    myLearningLangTranscriptRef.current = myLearningLangTranscript;
  }, [myLearningLangTranscript]);

  useEffect(() => {
    myNativeLangTranscriptRef.current = myNativeLangTranscript;
  }, [myNativeLangTranscript]);

  useEffect(() => {
    if (finalTranscript !== '') {
      // finalTranscriptの時
      console.log('Final result:', finalTranscript);
      // const userId = store.getState().authState.currentUser._id;
      const transcriptObject = {};
      transcriptObject['transcript'] = finalTranscript;
      transcriptObject['user'] = store.getState().authState.currentUser._id;
      transcriptObject['language'] = store.getState().mediaState.currentLanguage._id;
      transcriptObject['conversation'] = store.getState().conversationState._id;
      transcriptObject['seconds'] = startSeconds;
      setConversationTranscript((previouState) => [...previouState, transcriptObject]);
      const to = store.getState().mediaState.callingWith.socketId;
      // props.socket.emit(I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER, { to, finalTranscript });
      props.socket.emit(I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER, { to, transcriptObject });

      // if(props.mediaState.amICalling){ if(props.mediaState.currentLanguage._id === props.mediaState.exchanging[0]) }
      // この状態の時は、learningを話しているということになる。
      // 整理しよう。
      // exchanginLanguagesの並びは、amICallingの場合は[0]に自分のlearningがあり、[1]にnativeがある。
      // amIRecievingの場合は、[0]に自分のnativeが入っていて、[1]に自分のlearningが入っていることになる。
      if (store.getState().mediaState.amICalling) {
        if (
          store.getState().mediaState.currentLanguage.name === store.getState().mediaState.exchangingLanguages[0].name
        ) {
          // setMyLearningLangTranscript((previouState) => [...previouState, transcriptObject]);
          countTranscriptWords(
            finalTranscript,
            props.setCountLearningLangLength,
            store.getState().mediaState.currentLanguage.name
          );
        } else {
          // setMyNativeLangTranscript((previouState) => [...previouState, transcriptObject]);
          countTranscriptWords(
            finalTranscript,
            props.setCountNativeLangLength,
            store.getState().mediaState.currentLanguage.name
          );
        }
      } else if (store.getState().mediaState.amIRecieving) {
        // amIRecievingの場合は、[0]に自分のnativeがあり、[1]に自分のlearningがある。
        if (
          // 今の言語が、自分にとっての[0]と同じ名前の場合、今自分はnative言語を喋っている。
          store.getState().mediaState.currentLanguage.name === store.getState().mediaState.exchangingLanguages[0].name
        ) {
          // 向こうがlearningな言語を喋っているのね、ってこと。
          // setMyNativeLangTranscript((previouState) => [...previouState, finalTranscript]);
          countTranscriptWords(
            finalTranscript,
            props.setCountNativeLangLength,
            store.getState().mediaState.currentLanguage.name
          );
        } else {
          // setMyLearningLangTranscript((previouState) => [...previouState, finalTranscript]);
          countTranscriptWords(
            finalTranscript,
            props.setCountLearningLangLength,
            store.getState().mediaState.currentLanguage.name
          );
        }
      }
      // if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
      //   setMyLearningLangTranscript((previouState) => [...previouState, finalTranscript]); //globalなstateに保存しておいた方がいいかも。
      //   // props.mediaState.currentLanguage._id: 67
      //   countTranscriptWords(finalTranscript, setCountLearningLangLength);
      // } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
      //   setMyNativeLangTranscript((previouState) => [...previouState, finalTranscript]);
      //   countTranscriptWords(finalTranscript, setCountNativeLangLength);
      // }
    }

    if (!finalTranscript) {
      // interimの時
      setStartSeconds(seconds);
      console.log('Im sending interim transcript to partner');
      console.log(interimTranscript);
      const to = store.getState().mediaState.callingWith.socketId;
      props.socket.emit(I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER, { to, interimTranscript });
    }
  }, [interimTranscript, finalTranscript]);

  // ラテン系言語やゲルマン系言語はこれでいい。ただ、中国語とか日本語とかになるとまた別のfunction作らないといけない。これはあくまで前者用。
  //  これ、不思議な挙動をしてるんだよな。。。
  // const countTranscriptWords = (transcript, setCountLangLength, languageName) => {
  //   if (languageName === 'English' || 'Spanish' || 'French' || 'German') {
  //     console.log('european working????');
  //     const wordsLength = transcript.split(' ').length;
  //     setCountLangLength((previousState) => previousState + wordsLength);
  //   } else if (languageName === 'Japanese' || 'Korean' || 'Chinese') {
  //     console.log('asian working???');
  //     setCountLangLength((previousState) => previousState + transcript.length);
  //   }
  // };

  const countTranscriptWords = (transcript, setCountLangLength, languageName) => {
    switch (languageName) {
      case 'English':
      case 'French':
      case 'Spanish':
      case 'German':
      case 'Italian':
      case 'Portuguese':
      case 'Russian':
      case 'Dutch':
      case 'Polish':
      case 'Swedish':
      case 'Finnish':
      case 'Norwegian':
      case 'Czech':
      case 'Turkish':
      case 'Romanian':
      case 'Greek':
        const wordsLengthEuropean = transcript.split('').filter((character) => character !== ' ').length;
        setCountLangLength((previousState) => previousState + wordsLengthEuropean);
        break;
      case 'Japanese':
      case 'Chinese-Mandarin':
      case 'Chinese-Cantonese':
      case 'Korean':
        setCountLangLength((previousState) => previousState + transcript.length);
        break;
      // arabicとhebrewに関してはまた別。
      case 'Arabic':
      case 'Hebrew':
        console.log('hey');
        break;
      case 'Hindi':
        console.log('dont know...');
        break;
      default:
        console.log('nothing');
    }
  };

  useEffect(() => {
    if (!listening) {
      const lang = store.getState().mediaState.currentLanguage.codeForSpeechRecognition;
      SpeechRecognition.startListening({
        language: lang,
      });
    }
  }, [listening, props.mediaState.currentLanguage]); // 喋り終わったらrecognitionのlisteningが途切れる。それを再びonにする。// ここのdependencyをcurrentLanguageを入れてもいいかね。。。

  // ------------------------transcript受取り系
  useEffect(() => {
    props.socket.on(MY_PARTNER_SEND_ME_FINAL_TRANSCRIPT, (dataFromServer) => {
      console.log('I got final transcript from partner');
      // const transcriptObject = {};
      // transcriptObject['name'] = props.mediaState.callingWith.name;
      // transcriptObject['transcript'] = dataFromServer.finalTranscript;
      setPartnerInterimTranscript('');
      setConversationTranscript((previousState) => [...previousState, dataFromServer.transcriptObject]);
    });
  }, []);

  useEffect(() => {
    props.socket.on(MY_PARTNER_SEND_ME_INTERIM_TRANSCRIPT, (dataFromServer) => {
      console.log('Im getting interim transcript from partner.', dataFromServer.interimTranscript);
      setPartnerInterimTranscript(dataFromServer.interimTranscript);
    });
  }, []);
  // --------------------------

  useEffect(() => {
    props.socket.on(MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE, (dataFromServer) => {
      props.recieveSwitchingLanguageRequestActionCreator1(dataFromServer.switchingLanguage);
    });
  }, []);

  // 電話切った時に発動。hang up buuton推して、callDisconnectedがtrueになる。
  // useEffect(() => {
  //   return () => {
  //     console.log('subtitle after finishing should work');
  //     SpeechRecognition.stopListening();
  //     console.log('transcription logged', conversationTranscript, myLearningLangTranscript, myNativeLangTranscript);
  //     // props.createUserScriptActionCreator(conversationTranscript, myLearningLangTranscript, myNativeLangTranscript);
  //     props.createUserScriptActionCreator(
  //       conversationTranscriptRef.current,
  //       myLearningLangTranscriptRef.current,
  //       myNativeLangTranscriptRef.current
  //     );
  //   };
  // }, []);
  // ここはもう必要ない。socket使って、逐次databaseにtranscript objectを保存していく。

  // useEffect(() => {
  //   if (props.mediaState.callDisconnected) {
  //     console.log('subtitle after finishing should work');
  //     SpeechRecognition.stopListening();
  //     // ここで、promiseを分けて行うことできるかね。正直、calledUser側だけ送るのでいいよな。
  //     props.createUserScriptActionCreator(conversationTranscript, myLearningLangTranscript, myNativeLangTranscript);
  //     // .then((userScript) => {
  //     //   return props.updateConversationUserScriptActionCreator(userScript);
  //     // });
  //     // .then(() => {
  //     //   return props.updateUserMyLangsStatusActionCreator(countLearningLangLength, countNativeLangLength);
  //     // });
  //     // ここで、文字数をapiに送ることもする。
  //   }
  // }, [props.mediaState.callDisconnected]);

  const renderTranscripts = () => {
    const transcriptList = conversationTranscript.map((conversationTranscript) => {
      if (conversationTranscript.user === store.getState().authState.currentUser._id) {
        return (
          <>
            <span>You: {conversationTranscript.transcript}</span>&nbsp;<span>{conversationTranscript.seconds}</span>
            &nbsp;
            <Tooltip title='translate'>
              <TranslateTranscript translateInput={conversationTranscript.transcript} />
            </Tooltip>
          </>
        );
      } else if (conversationTranscript.user === store.getState().mediaState.callingWith._id) {
        return (
          <>
            <span>
              {store.getState().mediaState.callingWith.name}: {conversationTranscript.transcript}
            </span>
            &nbsp;<span>{conversationTranscript.seconds}</span>
            &nbsp;
            <Tooltip title='translate'>
              <TranslateTranscript translateInput={conversationTranscript.transcript} />
            </Tooltip>
          </>
        );
      }
    });

    return <>{transcriptList}</>;
  };
  // steventのapi key AIzaSyCf0Xy0OnhxlduyEt3K8zP-sOuu-l_u6uA
  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  // render系
  // chatと一緒。
  // const renderTranscripts = () => {
  //   const transcripts = conversationTranscript.map((transcriptObject) => {
  //     return (
  //       // <>
  //       //   <div style={{ marginBottom: '5px' }}>
  //       //     <p style={{ marginLeft: '5px', marginBottom: '2px' }}>{transcriptObject.name}</p>
  //       //     <div
  //       //       style={{
  //       //         borderRadius: '10px',
  //       //         backgroundColor: 'rgb(35, 63, 105)',
  //       //         border: '1px solid white',
  //       //         padding: '5px',
  //       //         display: 'inline',
  //       //       }}
  //       //     >
  //       //       {transcriptObject.transcript}
  //       //     </div>
  //       //   </div>
  //       // </>
  //       <>
  //         <p>
  //           {transcriptObject.name}: {transcriptObject.transcript}&nbsp;
  //           <TranslateTranscript translateInput={transcriptObject.transcript} />
  //         </p>
  //       </>
  //     );
  //   });
  //   return <>{transcripts}</>;
  // };

  const renderPartnerInterimTranscript = () => {
    if (partnerInterimTranscript) {
      return (
        // <>
        //   <div style={{ marginBottom: '5px' }}>
        //     <p style={{ marginLeft: '5px', marginBottom: '2px' }}>{props.mediaState.callingWith.name}</p>
        //     <div
        //       style={{
        //         borderRadius: '10px',
        //         backgroundColor: 'rgb(35, 63, 105)',
        //         border: '1px solid white',
        //         padding: '5px',
        //         display: 'inline',
        //       }}
        //     >
        //       {partnerInterimTranscript}
        //     </div>
        //   </div>
        // </>
        <>
          <p>
            {props.mediaState.callingWith.name}: {partnerInterimTranscript}
          </p>
        </>
      );
    }
  };

  const renderMyInterimTranscript = () => {
    if (transcript) {
      return (
        <>
          {/* <div style={{ marginBottom: '5px' }}>
            <p style={{ marginLeft: '5px', marginBottom: '2px' }}>You</p>
            <div
              style={{
                borderRadius: '10px',
                backgroundColor: 'rgb(35, 63, 105)',
                border: '1px solid white',
                padding: '5px',
                display: 'inline',
              }}
            >
              {transcript}
            </div>
          </div> */}
          <p>You: {transcript}</p>
        </>
      );
      // <p>You: {transcript}</p>;
    }
  };

  // const renderSwitchLangButton = () => {
  //   // const learningLangName = props.authState.currentUser.learningLangs[0].name;
  //   // if (props.authState.currentUser.learningLangs[0].name === props.mediaState.currentLanguage.name) {
  //   //   return null;
  //   // } else {
  //   return (
  //     // <Button type='button' onClick={() => switchLanguage()}>
  //     //   Switch to {learningLangName}
  //     // </Button>
  //     <Tooltip title='Switch current language'>
  //       <SwitchLanguageIconButton color='inherit' onClick={() => switchLanguage()}>
  //         <TranslateIcon size='small' />
  //       </SwitchLanguageIconButton>
  //     </Tooltip>
  //   );
  //   // }
  // };

  // const renderWordsLength = () => {
  //   return (
  //     <>
  //       <span>learning lang length: {countLearningLangLength}</span>
  //       <span>native lang length: {countNativeLangLength}</span>
  //     </>
  //   );
  // };

  const switchLanguage = () => {
    //言語を切り替えたら、自動でoffになる。
    props.switchCurrentLanguageActionCreator1(props.socket);
  };

  return (
    // <Draggable onDrag={handleDrag}>
    <div
      // className={`transcript-component ${props.openTranscriptComponent  ? undefined : 'hidden'}`}
      className={'transcript-component'}
      // style={{
      //   color: 'white',
      //   backgroundColor: 'rgb(29, 49, 79)',
      //   borderRadius: '5px',
      //   overflow: 'auto',
      //   height: '80vh',
      //   width: '40vw',
      //   position: 'absolute',
      //   top: '80px',
      //   right: '50px',
      //   cursor: 'grab',
      //   zIndex: 10,
      //   padding: '5px',
      // }}
    >
      {/* <div className='transcript-header' style={{ height: '10%' }}>
          <Stack direction='row' justifyContent='space-between' alignItems='baseline'>
            <h3 style={{ marginLeft: '15px' }}>Transcript</h3>
            <CloseIconButton onClick={() => props.setOpenTranscriptComponent(false)}>
              <CloseIcon />
            </CloseIconButton>
          </Stack>
        </div> */}
      {/* <div
          className='transcripts'
          style={{ overflow: 'auto', height: '90%', padding: '5px', backgroundColor: 'rgb(37, 95, 184)' }}
        > */}
      {/* <span>Now we are speaking {props.mediaState.currentLanguage.name}</span>&nbsp; */}
      {/* {renderSwitchLangButton()} */}
      {seconds}
      {renderTranscripts()}
      {renderPartnerInterimTranscript()}
      {renderMyInterimTranscript()}
      {/* transcript自体、finalになったら自動的に消える。だからtranscript renderてだけでいい。*/}
      {/* {renderWordsLength()} */}
      <div ref={transcriptsEndRef} />
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
  createUserScriptActionCreator,
  updateConversationUserScriptActionCreator,
  updateUserMyLangsStatusActionCreator,
  switchCurrentLanguageActionCreator1,
  recieveSwitchingLanguageRequestActionCreator1,
})(SubtitleWrapper);
