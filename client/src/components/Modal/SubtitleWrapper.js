import React, { useState, useEffect, useRef } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import axios from 'axios';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// component
import TranslateTranscript from '../TranslateTranscript';
import TranslatedText from './TranslatedText';
import EachTranscript from './EachTranscript';

// mui
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TranslateIcon from '@mui/icons-material/Translate';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import GTranslateIcon from '@mui/icons-material/GTranslate';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

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
import { alertActionCreator } from '../../actionCreators/alertsActionCreator';

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
  const [googleTranslated, setGoogleTranslated] = useState('');
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
  // ??????????????????????????????????????????????????????????????????????????????????????????????????????

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
      // finalTranscript??????
      console.log('Final result:', finalTranscript);
      // const userId = store.getState().authState.currentUser._id;
      const transcriptObject = {};
      transcriptObject['transcript'] = finalTranscript;
      transcriptObject['user'] = store.getState().authState.currentUser._id;
      transcriptObject['name'] = store.getState().authState.currentUser.name;
      transcriptObject['language'] = store.getState().mediaState.currentLanguage._id;
      transcriptObject['conversation'] = store.getState().conversationState.conversationId;
      transcriptObject['seconds'] = startSeconds;
      setConversationTranscript((previouState) => [...previouState, transcriptObject]);
      const to = store.getState().mediaState.callingWith.socketId;
      // props.socket.emit(I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER, { to, finalTranscript });
      props.socket.emit(I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER, { to, transcriptObject });

      // if(props.mediaState.amICalling){ if(props.mediaState.currentLanguage._id === props.mediaState.exchanging[0]) }
      // ????????????????????????learning?????????????????????????????????????????????
      // ??????????????????
      // exchanginLanguages???????????????amICalling????????????[0]????????????learning????????????[1]???native????????????
      // amIRecieving???????????????[0]????????????native?????????????????????[1]????????????learning????????????????????????????????????
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
        // amIRecieving???????????????[0]????????????native????????????[1]????????????learning????????????
        if (
          // ???????????????????????????????????????[0]???????????????????????????????????????native???????????????????????????
          store.getState().mediaState.currentLanguage.name === store.getState().mediaState.exchangingLanguages[0].name
        ) {
          // ????????????learning???????????????????????????????????????????????????
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
      //   setMyLearningLangTranscript((previouState) => [...previouState, finalTranscript]); //global???state?????????????????????????????????????????????
      //   // props.mediaState.currentLanguage._id: 67
      //   countTranscriptWords(finalTranscript, setCountLearningLangLength);
      // } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
      //   setMyNativeLangTranscript((previouState) => [...previouState, finalTranscript]);
      //   countTranscriptWords(finalTranscript, setCountNativeLangLength);
      // }
    }

    if (!finalTranscript) {
      // interim??????
      setStartSeconds(seconds);
      console.log('Im sending interim transcript to partner');
      console.log(interimTranscript);
      const to = props.mediaState.callingWith.socketId;
      props.socket.emit(I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER, { to, interimTranscript });
    }
  }, [interimTranscript, finalTranscript]);

  // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????function???????????????????????????????????????????????????????????????
  //  ????????????????????????????????????????????????????????????
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
      // arabic???hebrew???????????????????????????
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

  const renderSecondsToTimes = (secs) => {
    const hours = Math.floor(secs / (60 * 60));
    const divisorForMinutes = secs % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);

    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);

    const obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };

    if (obj.h === 0) {
      return (
        <>
          <span style={{ color: 'rgb(37, 95, 184)' }}>
            @{obj.m}:{obj.s}
          </span>
        </>
      );
    } else {
      return (
        <>
          <span style={{ color: 'rgb(37, 95, 184)' }}>
            @{obj.h}:{obj.m}:{obj.s}
          </span>
        </>
      );
    }
  };

  useEffect(() => {
    if (!listening) {
      const lang = store.getState().mediaState.currentLanguage.codeForSpeechRecognition;
      SpeechRecognition.startListening({
        language: lang,
      });
    }
  }, [listening, props.mediaState.currentLanguage]); // ?????????????????????recognition???listening?????????????????????????????????on????????????// ?????????dependency???currentLanguage????????????????????????????????????

  // ------------------------transcript????????????
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
      props.alertActionCreator('Your partner changed language.', 'info');
    });
  }, []);

  // ??????????????????????????????hang up buuton????????????callDisconnected???true????????????
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
  // ??????????????????????????????socket??????????????????database???transcript object????????????????????????

  // useEffect(() => {
  //   if (props.mediaState.callDisconnected) {
  //     console.log('subtitle after finishing should work');
  //     SpeechRecognition.stopListening();
  //     // ????????????promise???????????????????????????????????????????????????calledUser????????????????????????????????????
  //     props.createUserScriptActionCreator(conversationTranscript, myLearningLangTranscript, myNativeLangTranscript);
  //     // .then((userScript) => {
  //     //   return props.updateConversationUserScriptActionCreator(userScript);
  //     // });
  //     // .then(() => {
  //     //   return props.updateUserMyLangsStatusActionCreator(countLearningLangLength, countNativeLangLength);
  //     // });
  //     // ????????????????????????api???????????????????????????
  //   }
  // }, [props.mediaState.callDisconnected]);

  const renderGoogleTranslated = () => {
    if (googleTranslated) {
      return <span>{googleTranslated}</span>;
    } else {
      return null;
    }
  };

  const renderName = (conversationTranscript) => {
    if (conversationTranscript.user === store.getState().authState.currentUser._id) {
      return <>You</>;
    } else if (conversationTranscript.user === store.getState().mediaState.callingWith._id) {
      return <>{conversationTranscript.name}</>;
    }
  };

  const renderTranscriptsNew = () => {
    const transcriptList = conversationTranscript.map((conversationTranscript) => {
      return (
        <>
          {/* <ListItem
            alignItems='flex-start'
            secondaryAction={
              <Tooltip title='translate'>
                <IconButton edge='end'>
                  <TranslateTranscript
                    translateInput={conversationTranscript.transcript}
                    setGoogleTranslated={setGoogleTranslated}
                  />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemAvatar>
              <Avatar alt={`${conversationTranscript.name}`} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                    {renderName(conversationTranscript)}&nbsp;
                    {renderSecondsToTimes(conversationTranscript.seconds)}
                  </Typography>
                </>
              }
              secondary={
                <>
                  <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                    {conversationTranscript.transcript}
                    <TranslatedText googleTranslated={googleTranslated} />
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider variant='inset' component='li' /> */}
          <EachTranscript conversationTranscript={conversationTranscript} />
        </>
      );
    });

    return (
      <>
        <List>{transcriptList}</List>
      </>
    );
  };

  // const renderTranscripts = () => {
  //   const transcriptList = conversationTranscript.map((conversationTranscript) => {
  //     if (conversationTranscript.user === store.getState().authState.currentUser._id) {
  //       return (
  //         <>
  //           <span>You: {conversationTranscript.transcript}</span>&nbsp;
  //           {renderSecondsToTimes(conversationTranscript.seconds)}
  //           &nbsp;
  //           <Tooltip title='translate'>
  //             <TranslateTranscript translateInput={conversationTranscript.transcript} />
  //           </Tooltip>
  //         </>
  //       );
  //     } else if (conversationTranscript.user === store.getState().mediaState.callingWith._id) {
  //       return (
  //         <>
  //           <span>
  //             {store.getState().mediaState.callingWith.name}: {conversationTranscript.transcript}
  //           </span>
  //           &nbsp;{renderSecondsToTimes(conversationTranscript.seconds)}
  //           &nbsp;
  //           <Tooltip title='translate'>
  //             <TranslateTranscript translateInput={conversationTranscript.transcript} />
  //           </Tooltip>
  //         </>
  //       );
  //     }
  //   });

  //   return <>{transcriptList}</>;
  // }; // ???????????????????????????

  // stevent???api key AIzaSyCf0Xy0OnhxlduyEt3K8zP-sOuu-l_u6uA
  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  // render???
  // chat????????????
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
    //???????????????????????????????????????off????????????
    props.switchCurrentLanguageActionCreator1(props.socket);
  };

  return (
    // <Draggable onDrag={handleDrag}>
    <div
      // className={`transcript-component ${props.openTranscriptComponent  ? undefined : 'hidden'}`}
      className={'transcript-component'}
      style={{
        color: 'black',
        backgroundColor: 'rgb(232, 232, 232)',
        overflow: 'auto',
        width: '100%',
        cursor: 'auto',
        flex: 7,
      }}
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
      {/* {seconds} */}
      {/* {renderTranscripts()} */}
      {renderTranscriptsNew()}
      {renderPartnerInterimTranscript()}
      {renderMyInterimTranscript()}
      {/* transcript?????????final????????????????????????????????????????????????transcript render?????????????????????*/}
      {/* {renderWordsLength()} */}
      <div ref={transcriptsEndRef} />
    </div>
  );
  // return <></>; // subtitle wrapper??????????????????????????????????????????// ??????????????????????????????????????????????????????????????????
};

// const SubtitleWrapper = (props) => {
//   // const [languageSubtitle, setLanguageSubtitle] = useState('');
//   const [languageSubtitles, setLanguageSubtitles] = useState([]); // ?????????component rerender???????????????useEffect???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   let recognition = useRef();
//   recognition.current = new SpeechRecognition();
//   // recognition.current.continuous = true;
//   recognition.current.interimResults = true;

//   useEffect(() => {
//     if (props.mediaState.callAccepted) {
//       const { currentLanguage } = store.getState().mediaState;
//       recognition.current.lang = currentLanguage.codeForSpeechrecognition;
//       recognition.current.start(); // onend??????????????????continue???160?????????????????????????????????????????????????????????
//       if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
//         // ?????????learning?????????recognition???transcription???setState????????????????????????
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
//           console.log(transcript); // ????????????????????????????????????brazil????????????
//           props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
//             to,
//             nativeLanguageScript: transcript,
//           });
//           props.setLearningLanguageScript((previousState) => [...previousState, transcript]);
//           props.setLanguageSubtitles((previousState) => [...previousState, transcript]); // ????????????????????????????????????
//           // recognition.current.onend = () => {
//           //   recognition.current.start();
//           // }; // ???????????????????????????????????????????????????
//           recognition.current.onend = () => {
//             recognition.current.start();
//           }; // ????????????????????????????????????onspeech?????????????????????????????????????????????
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
//           // ?????????isFinal???????????????????????????
//           props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
//             to,
//             nativeLanguageScript: transcript,
//           });
//           props.setNativeLanguageScript((previousState) => [...previousState, transcript]);
//           props.setLanguageSubtitles((previousState) => [...previousState, transcript]); //????????????????????????????????????
//           recognition.current.onend = () => {
//             recognition.current.start(); // ???????????????????????????????????????????????????????????????????????????
//           }; // ????????????????????????????????????????????????????????????5???????????????????????????????????????
//         };

//       }
//     }
//   }, [props.mediaState.callAccepted, languageSubtitles]); // ?????????????????????????????????getVoiceText??????????????????????????????

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
  alertActionCreator,
})(SubtitleWrapper);
