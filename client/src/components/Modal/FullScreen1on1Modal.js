import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import store from '../../store';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';
import { Tooltip } from '@mui/material';

// components
import PersonalInfo from './PersonalInfo';
import VideosWrapper from '../VideosWrapper';
import ConversationApps from './ConversationApps';
import VerticalTabs from '../VerticalTabs';
// import Texts from './Texts';
import MediaRecorder from '../MediaRecord';

import Dimer from '../Dimer';
import UserInfoCard from '../UserInfoCard';

import '../../styles/1on1.css';
import {
  I_REQUEST_PARTNERS_VOICE_TEXT,
  MY_PARTENER_REQUESTS_MY_VOICE_TEXT,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
} from '../../actionCreators/socketEvents';

// action creators
import { answerCallActionCreator } from '../../actionCreators/mediaActionCreator';
import { startMediaRecorder } from '../../actionCreators/mediaActionCreator';
import { updateUserConversationStateActionCreator } from '../../actionCreators/authActionCreators';
import { updateConversationRecievedUserActionCreator } from '../../actionCreators/conversationActionCreators';

import { sendVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';
import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';
import { getConversationIdFromCalledUserActionCreator } from '../../actionCreators/conversationActionCreators';
import { updateUserConversationsActionCreator } from '../../actionCreators/authActionCreators';
import { getIntegratedUserMediaIdFromCalledUserActionCreator } from '../../actionCreators/integratedUserMediasActionCreators';
import { switchCurrentLanguageActionCreator } from '../../actionCreators/mediaActionCreator';
import { recieveSwitchingLanguageRequestActionCreator } from '../../actionCreators/mediaActionCreator';
// import Speechrecognition, { useSpeechrecognition } from 'react-speech-recognition';

import { answerCallActionCreator2 } from '../../actionCreators/mediaActionCreator';
import { completeConnectionWithMyPartnerActionCreator1 } from '../../actionCreators/mediaActionCreator';

// import { recordStreamActionCreator } from '../../actionCreators/mediaActionCreator';

const FullScreen1on1Modal = (props) => {
  const [isInConversation, setIsInConversation] = useState(false);
  const [requestedSubtitle, setRequestedSubtitle] = useState(false);
  // activate用のboolean state
  const [isLanguageSubtitleActivated, setIsLanguageSubtitleActivated] = useState(false);
  const [languageSubtitle, setLanguageSubtitle] = useState(''); // 字幕は、learningのときだけ動くのでいいや。
  const [isFinal, setIsFinal] = useState();
  const [isMinimumTimePassed, setIsMinimumTimePassed] = useState(false);

  // const myVideoRef = useRef(); // ここの部分は、if文でrenderするようにしようか。
  // const oppositeVideoRef = useRef();
  // const connectionRef = useRef();
  // const [learningLanguageScript, setLearningLanguageScript] = useState('');
  // const [nativeLanguageScript, setNativeLanguageScript] = useState('');
  // const [chunks, setChunks] = useState([]);
  // let mediaRecorder;

  // こっから。。。
  // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  // let recognition = useRef();
  // recognition.current = new SpeechRecognition();
  // recognition.current.continuous = true;
  // recognition.current.interimResults = true;

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
  //   if (props.mediaState.callAccepted) {
  //     const { currentLanguage } = store.getState().mediaState;
  //     recognition.current.lang = currentLanguage.codeForSpeechrecognition;
  //     recognition.current.start(); // onendをつけると、continueが160回繰り返されるのはなぜ。。。まじなぞ。
  //     if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
  //       // ここでlearning用の、recognitionでtranscriptionをsetStateするようにする。
  //       console.log('in useEffect');
  //       recognition.current.onresult = (event) => {
  //         // console.log(event);
  //         const transcript = Array.from(event.results)
  //           .map((result) => result[0])
  //           .map((result) => result.transcript)
  //           .join('');
  //         console.log(transcript);
  //         props.setLearningLanguageScript(transcript);
  //       };

  //       // recognition.current.onerror = (event) => {
  //       //   console.log(event.error);
  //       // };
  //       // recognition.current.onend = () => {
  //       //   recognition.current.start();
  //       // }; // ほんと謎だわこれ。。。。
  //     } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
  //       const to = store.getState().mediaState.callingWith.socketId;
  //       console.log('india side workinggggggg???');
  //       recognition.current.onresult = (event) => {
  //         console.log('sending isFinal text.');
  //         const transcript = Array.from(event.results)
  //           .map((result) => result[0])
  //           .map((result) => result.transcript)
  //           .join('');
  //         console.log(transcript);
  //         // やっぱisFinalは必要かもしれん。
  //         props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
  //           to,
  //           nativeLanguageScript: transcript,
  //         });
  //         props.setNativeLanguageScript(transcript);
  //       };
  //       // recognition.current.onspeechend = () => {
  //       //   recognition.current.stop();
  //       // };
  //       // recognition.current.onerror = (event) => {
  //       //   console.log(event.error);
  //       // };
  //       // recognition.current.onend = () => {
  //       //   recognition.current.start(); // ここで確実に繰り返されるのかね。。。。分からんん。
  //       // };
  //       // recognition.current.start();
  //     }
  //   }
  // }, [props.mediaState.callAccepted]);
  // ここまで、違うcomponentに移した。

  // useEffect(() => {
  //   // ここで、多分transcriptionな感じのを書くのかね。。。
  //   // 最初の1回目には、実行せん。
  //   if (props.mediaState.callAccepted) {
  //     const { currentLanguage } = store.getState().mediaState;
  //     recognition.lang = currentLanguage.codeForSpeechrecognition;
  //     recognition.start(); // onendをつけると、continueが160回繰り返されるのはなぜ。。。まじなぞ。
  //     recognition.onspeechend = () => {
  //       console.log('stop one sec...and start');
  //       recognition.stop();
  //       recognition.start();
  //     };
  //     if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
  //       // ここでlearning用の、recognitionでtranscriptionをsetStateするようにする。
  //       console.log('in useEffect');
  //       recognition.onresult = (event) => {
  //         // console.log(event);
  //         const transcript = Array.from(event.results)
  //           .map((result) => result[0])
  //           .map((result) => result.transcript)
  //           .join('');
  //         console.log(transcript);
  //         props.setLearningLanguageScript(transcript);
  //         recognition.onerror = (event) => {
  //           console.log(event.error);
  //         };
  //       };
  //     } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
  //       const to = store.getState().mediaState.callingWith.socketId;
  //       console.log('india side workinggggggg???');
  //       recognition.onresult = (event) => {
  //         if (event.results[0].isFinal) {
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
  //             isFinal: true,
  //           });
  //           props.setNativeLanguageScript(transcript);
  //           recognition.stop(); // こうしておけば、たまったresultsは掃除されるだろう。→何で動かねー？？？

  //           // recognition.current.onerror = (event) => {
  //           //   console.log(event.error);
  //           // };
  //         } else {
  //           console.log('working in NOT isFinal side');
  //           const transcript = Array.from(event.results)
  //             .map((result) => result[0])
  //             .map((result) => result.transcript)
  //             .join('');
  //           console.log(transcript);
  //           props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, { to, nativeLanguageScript: transcript });
  //           props.setNativeLanguageScript(transcript);
  //           recognition.onerror = (event) => {
  //             console.log(event.error);
  //           };
  //         }
  //       };
  //     }
  //   }
  // }, [props.mediaState.callAccepted]); // 実験して、おそらくちゃんと動いていることが分かった。

  // useEffect(() => {
  //   if (props.mediaState.callAccepted) {
  //     const { currentLanguage } = store.getState().mediaState;
  //     console.log(currentLanguage);
  //     Speechrecognition.startListening({ language: currentLanguage.codeForSpeechrecognition }).then(() => {
  //       if (props.mediaState.currentLanguage.name === props.authState.currentUser.learningLangs[0].name) {
  //         console.log('learning side');
  //         props.setLearningLanguageScript(transcript);
  //       } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
  //         const to = store.getState().mediaState.callingWith.socketId;
  //         console.log('india side workinggggggg???');
  //         console.log(transcript);
  //         props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, { to, nativeLanguageScript: transcript });
  //         props.setNativeLanguageScript(transcript);
  //       }
  //     });
  //   }
  // }, [props.mediaState.callAccepted]);

  // 「videoRef、oppositeVideoRef, onHangUpClick, switchRender」　をworldmapからprops使って、このcomponentに渡す。
  // const handleListen = () => {
  //   if (requestedSubtitle) {
  //     microphone.start();
  //     microphone.onend = () => {
  //       console.log('continue..');
  //       microphone.start();
  //     };
  //   } else {
  //     microphone.stop();
  //     microphone.onend = () => {
  //       console.log('Stopped microphone on Click');
  //     };
  //   }

  //   microphone.onstart = () => {
  //     console.log('microphones on');
  //   };

  //   microphone.onresult = (event) => {
  //     const transcript = Array.from(event.results)
  //       .map((result) => result[0])
  //       .map((result) => result.transcript)
  //       .join('');
  //     console.log(transcript);
  //     setVoiceText(transcript);
  //     // props.sendVoiceTextActionCreator(props.socket, voiceText, setRequestedSubtitle);
  //     microphone.onerror = (event) => {
  //       console.log(event.error);
  //     };
  //   };
  // };

  // const handleSpeechrecognition = () => {
  //   // const Speechrecognition = window.Speechrecognition || window.webkitSpeechrecognition;
  //   microphone = new Speechrecognition();
  //   microphone.continuous = true;
  //   microphone.interimResults = true;
  //   microphone.lang = 'en-US';
  //   microphone.onstart = () => {
  //     console.log('microphones on');
  //   };
  //   microphone.start();

  //   // microphone.stop();

  //   microphone.onresult = (event) => {
  //     const transcript = Array.from(event.results)
  //       .map((result) => result[0])
  //       .map((result) => result.transcript)
  //       .join('');
  //     console.log(transcript);
  //     setVoiceText(transcript);
  //     // props.sendVoiceTextActionCreator(props.socket, voiceText, setRequestedSubtitle);
  //     microphone.onerror = (event) => {
  //       console.log(event.error);
  //     };
  //   };
  // }; // useEffectで、特定のcall acceptedの時だけこれを実行させたいね。

  // useEffect(() => {
  //   handleListen();
  // }, [requestedSubtitle]);
  // ここでもsocketだな。こっちでまず、request your voice textみたいなeventを送って、それに対してvoiceの方が答えて、こっちのvoice textを送る、みたいな実装になるだろね。

  useEffect(() => {
    // props.socket.on(MY_PARTENER_REQUESTS_MY_VOICE_TEXT, () => {
    //   props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
    //     to: 0,
    //     voiceText: voiceText,
    //   });
    // });

    // props.sendVoiceTextActionCreator(props.socket, props.nativeLanguageScript);

    // props.socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (voiceTetx) => {
    //   // ここにrenderするfunctionを作る感じかな。
    //   // display(voiceText)
    //   setVoiceText(voiceTetx);
    // });

    // props.getVoiceTextActionCreator(props.socket, setLanguageSubtitle, isFinal, setIsFinal); ここはもういらないだろ。

    props
      .getConversationIdFromCalledUserActionCreator(props.socket)
      .then(() => {
        return props.updateUserConversationsActionCreator();
      })
      .then(() => {
        props.updateConversationRecievedUserActionCreator();
      });

    // props.getIntegratedUserMediaIdFromCalledUserActionCreator(props.socket);
  }, []);

  // ここにまんま書いていいのかね。reduxのstateの部分。→いや。reduxにしろcomponentのstateが変わっても毎回実行されちまう、それは良くない。
  // const a = useSelector((state) => state.mediaState.callAccepted);
  // console.log(a);
  // useState(() => {
  //   console.log('mediarecorder part!!!');
  //   if (a) {
  //     // この部分が動いていない。
  //     props.recordStreamActionCreator(mediaRecorder, setChunks); // ここにmedia recorderのinstanceを引数で入れる感じの方がいいな。多分。
  //   }
  // }, [a]); // これやっぱ最初のrendering後も動いているな。。。

  // useEffect(() => {
  //   // これはここでいいと思う。chatが始まって二人のchatが始まったらこれを実行する。ここはmodul化した方がいいな。というか、action creatorかどっかに入れてmodule化する方がいい。
  //   const screenConstraint = {
  //     video: true,
  //     // {
  //     //   mediaSource: 'screen',
  //     //   // cursor: 'always'
  //     // },
  //     audio: {
  //       echoCancellation: true,
  //       noiseSuppression: true,
  //       // sampleRate: 44100
  //     },
  //   };
  //   navigator.mediaDevices.getDisplayMedia(screenConstraint).then((screenStream) => {
  //     let mediaRecorder = new MediaRecorder(screenStream);
  //     // いや。違うわ。webcamを保存しても意味がない。必要なのは、screen の保存だよ。html fileの保存とでもいうべきか。それもmedia audio付きの。
  //     const chunks = [];
  //     mediaRecorder.start();
  //     mediaRecorder.ondataavailable = function (event) {
  //       chunks.push(event.data);
  //     };
  //     mediaRecorder.onstop = (event) => {
  //       let blob = new Blob(chunks, { type: 'video/mp4;' });
  //       // ここでmp4のdataが作られたらこれをmongoとs3に保存していくapi requestをすることだ。
  //       chunks = [];
  //       // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
  //     };
  //   });
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsMinimumTimePassed(true);
  //   }, 10 * 60 * 1000);
  // }, []);

  const handleAnswerCall = (recognition) => {
    props
      .answerCallActionCreator(
        props.socket,
        props.myVideo,
        props.oppositeVideo,
        props.connectionRef,
        props.mediaRecorder,
        props.chunksBuffer
      )
      .then(() => {
        return props.startMediaRecorder(props.mediaRecorder);
      })
      .then(() => {
        return props.updateUserConversationStateActionCreator();
      });

    // const { currentLanguage } = store.getState().mediaState;
    // recognition.lang = currentLanguage.codeForSpeechrecognition;
    // recognition.start();
    // console.log(recognition);
  };

  // 多分、字幕onですよっていうstateを用意したほうがいいわ。useEffectでその字幕onですよstateが変わるたびに色々やるっていう感じかね。。。
  const onActivateSubtitleClick = () => {
    console.log('activate subtitle');
    // 表示するようにする感じかな。
    // props.socket.emit(I_REQUEST_PARTNERS_VOICE_TEXT, {
    //   to: props.mediaState.callingWith.socketId,
    // });
  };

  // ここで文字数制限やら、字幕の高さを決めておいて、はみ出したらそこを表示しないようにする、くらいしかないかね。
  // const displaySubtitle = () => {
  //   if (languageSubtitle) {
  //     return (
  //       <div className='partner-subtitle'>
  //         <p className='voice-text'>{languageSubtitle}</p>
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  // const displayCurrentLanguage = () => {
  //   if (props.mediaState.currentLanguage) {
  //     return (
  //       <>
  //         <div style={{ color: 'white' }}>Now, We are speaking {props.mediaState.currentLanguage.name}</div>
  //       </>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  // const switchCurrentLanguage = () => {
  //   props.switchCurrentLanguage(); // この実行でmediaStateのcurrent languageに自分のpractice 言語が入る。dispatchだけ。
  //   const partnerSocketId = store.getState().mediaState.callingWith;
  //   const language = store.getState().mediaState.currentLanguage;
  //   props.socket.emit('I_WANNA_PRACTICE_MY_LEARNING_LANGUAGE', { to: partnerSocketId, language: language });
  //   // recognition.current.onend = () => {
  //   //   recognition.current.lang = language;
  //   //   recognition.current.start();
  //   // };
  //   // recognition.current.stop();
  // }; // ここで直接書くより、acにしたほうがいいね。

  // const displaySwitchCurrentLanguageButton = () => {
  //   if (props.authState.currentUser.learningLangs[0].name === props.mediaState.currentLanguage.name) {
  //     return null;
  //   } else {
  //     return (
  //       <>
  //         {/* <Button
  //           onClick={() =>
  //             props.switchCurrentLanguageActionCreator(
  //               props.socket,
  //               recognition.current,
  //               props.setLearningLanguageScript,
  //               props.setNativeLanguageScript
  //             )
  //           }
  //         >
  //           Switch
  //         </Button> */}
  //       </>
  //     );
  //   }
  // };

  // const switchRender = () => {
  //   if (props.mediaState.callAccepted) {
  //     return null;
  //   } else {
  //     if (props.mediaState.amICalling) {
  //       return <Dimer />;
  //     } else if (props.mediaState.amIRecieving) {
  //       return (
  //         <>
  //           <div className='confirmation'>
  //             <UserInfoCard user={props.mediaState.callingWith} />
  //             <Button positive onClick={() => handleAnswerCall()} style={{ width: '100%' }}>
  //               <i className='handshake icon' />
  //               Yes
  //             </Button>
  //             <Button negative style={{ width: '100%' }}>
  //               <i className='x icon' />
  //               No
  //             </Button>
  //           </div>
  //         </>
  //       );
  //     } else {
  //       return null;
  //     }
  //   }
  // };

  // // 一番最初のrenderでmodalだけ出すのでいいと思う。ただ、その最初のmodalのinitial render後に、videoのsrc objectをセットするように書いていく。
  // useEffect(() => {
  //   // ここでpeerInitiatorをはじめ、videoのsrcObjectのセットをする。ただこれだと、callした側がここに来た時もこれを実行しちゃうな。。。
  //   if (props.mediaState.amIRecieving) {
  //     props.answerCallActionCreator2(props.socket, myVideoRef, oppositeVideoRef, connectionRef);
  //     console.log('useEffect of fullscreen');
  //   }
  // }, []);

  // useEffect(() => {
  //   if (props.mediaState.amICalling) {
  //     // completeっぽいaction creatorを実行する。
  //     props.completeConnectionWithMyPartnerActionCreator1(myVideoRef, oppositeVideoRef, connectionRef);
  //   }
  // }, []); // これでいいのかね。。。

  // これでも分かる通り、基本modalはdefaultでrenderされていることになるね。違うやり方だ。要は、このmodalがセットされたときに実行するって言うことをやりたいのよ。もう最初からこれ実行されている。
  useEffect(() => {
    console.log('when mounted fullscreen');
  }, []);

  // modalがセットされたらここを実行してもらう。
  // useEffect(() => {
  //   if (props.show1on1) {
  //     if (props.mediaState.amIRecieving) {
  //       props.answerCallActionCreator2(props.socket, myVideoRef, oppositeVideoRef, connectionRef);
  //       console.log('useEffect of fullscreen');
  //     } else if (props.mediaState.amICalling) {
  //       props.completeConnectionWithMyPartnerActionCreator1(myVideoRef, oppositeVideoRef, connectionRef);
  //     }
  //   }
  // }, [props.show1on1]);

  const screenRender = () => {
    if (props.mediaState.callAccepted) {
      return (
        <Modal
          className='chat-modal'
          show={props.show1on1}
          fullscreen={props.fullscreen1on1Modal}
          onHide={() => props.setShow1on1(false)}
          style={{ backgroundColor: 'black' }}
        >
          <Modal.Body bsPrefix='modal-body'>
            <MediaRecorder />
            {/* <div></div>
            <div className='videos-wrapper'>
              <video
                className='partner-video'
                playsInline
                ref={oppositeVideoRef}
                autoPlay
                style={{ width: '960px', height: '540px' }} // これだとなんで真ん中に寄ってくれるの？？
                // style={{ width: '400px', height: '500px' }}
              />
              <video
                className='myvideo'
                playsInline
                muted
                ref={myVideoRef}
                autoPlay
                style={{ width: '160px', height: '90px' }}
              />
              <div className='button-wrapper'>
                <Button
                  negative
                  // disabled={!isMinimumTimePassed}
                  className='hang-up-button'
                  circular
                  icon='sign out'
                  onClick={() => props.onHangUpClick()} // ここで、recorderのstopがかかって、onstopのeventが動くようになる。
                ></Button>
              </div>
            </div> */}
            <VideosWrapper show1on1={props.show1on1} setShow1on1={props.setShow1on1} socket={props.socket} />
            <div className='info-and-app-wrapper'>
              <VerticalTabs
                socket={props.socket}
                setLearningLanguageScript={props.setLearningLanguageScript}
                setNativeLanguageScript={props.setNativeLanguageScript}
              />
              <ConversationApps />
            </div>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  };

  return <>{screenRender()}</>;

  // return (
  //   <Modal
  //     className='chat-modal'
  //     show={props.show1on1}
  //     fullscreen={props.fullscreen1on1Modal}
  //     onHide={() => props.setShow1on1(false)}
  //     style={{ backgroundColor: 'black' }}
  //   >
  //     {/* <Modal.Body bsPrefix='modal-body' style={{ backgroundColor: 'rgb(0, 25, 35)' }}> */}
  //     <Modal.Body bsPrefix='modal-body'>
  //       {/* {switchRender()} */}
  //       {/* <div className='videos-container' style={{ marginTop: '80px' }}>
  //         <div className='myvideo-container'>
  //           <div className='myvideo'>
  //             <video playsInline muted ref={props.myVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
  //           </div>
  //         </div>
  //         <div className='partner-video-container'>
  //           <div className='partner-video'>
  //             <video playsInline ref={props.oppositeVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
  //           </div>
  //           {displaySubtitle()}
  //         </div>
  //       </div> */}
  //       {/* <div className='modal-container'> */}
  //       {/* {displayCurrentLanguage()} */}
  //       {/* <div className='partner-video-container'> */}
  //       {/* <div className='partner-video'> */}
  //       <div></div>
  //       <div className='videos-wrapper'>
  //         <video
  //           className='partner-video'
  //           playsInline
  //           ref={props.oppositeVideo}
  //           autoPlay
  //           style={{ width: '960px', height: '540px' }} // これだとなんで真ん中に寄ってくれるの？？
  //           // style={{ width: '400px', height: '500px' }}
  //         />
  //         <video
  //           className='myvideo'
  //           playsInline
  //           muted
  //           ref={props.myVideo}
  //           autoPlay
  //           style={{ width: '160px', height: '90px' }}
  //         />
  //         {props.mediaState.callAccepted ? (
  //           <div className='button-wrapper'>
  //             {/* <Tooltip title='hang up call'> tooltip バグるね。他の方法試そう。 */}
  //             <Button
  //               negative
  //               // disabled={!isMinimumTimePassed}
  //               className='hang-up-button'
  //               circular
  //               icon='sign out'
  //               onClick={() => props.onHangUpClick()} // ここで、recorderのstopがかかって、onstopのeventが動くようになる。
  //             >
  //               {/* <i className='sign out alternate icon'></i> */}
  //             </Button>
  //             {/* </Tooltip> */}

  //             {/* {displaySwitchCurrentLanguageButton()} */}
  //           </div>
  //         ) : null}
  //       </div>
  //       {/* </div> */}
  //       {/* {displaySubtitle()} divでその中にpが入っている。 */}
  //       {/* </div> */}
  //       {/* <div className='myvideo-container'> */}
  //       {/* <div className='myvideo'> */}
  //       {/* </div> */}
  //       <div className='info-and-app-wrapper'>
  //         <Texts
  //           socket={props.socket}
  //           setLearningLanguageScript={props.setLearningLanguageScript}
  //           setNativeLanguageScript={props.setNativeLanguageScript}
  //         />
  //         <ConversationApps />
  //       </div>
  //     </Modal.Body>
  //   </Modal>
  // );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, authState: state.authState };
};

export default connect(mapStateToProps, {
  answerCallActionCreator,
  startMediaRecorder,
  updateUserConversationStateActionCreator,
  updateConversationRecievedUserActionCreator,
  sendVoiceTextActionCreator,
  getVoiceTextActionCreator,
  getConversationIdFromCalledUserActionCreator,
  updateUserConversationsActionCreator,
  // recordStreamActionCreator,
  getIntegratedUserMediaIdFromCalledUserActionCreator,
  switchCurrentLanguageActionCreator,
  recieveSwitchingLanguageRequestActionCreator,
  answerCallActionCreator2,
  completeConnectionWithMyPartnerActionCreator1,
})(FullScreen1on1Modal);
