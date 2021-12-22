import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import store from '../../store';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

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
import { getIntegratedUserMediaIdFromCalledUserActionCreator } from '../../actionCreators/integratedUserMediasActionCreators';
import { switchCurrentLanguageActionCreator } from '../../actionCreators/mediaActionCreator';
import { recieveSwitchingLanguageRequestActionCreator } from '../../actionCreators/mediaActionCreator';

// import { recordStreamActionCreator } from '../../actionCreators/mediaActionCreator';

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const microphone = new SpeechRecognition();
// microphone.continuous = true;
// microphone.interimResults = true;
// microphone.lang = 'en-US';

const FullScreen1on1Modal = (props) => {
  const [isInConversation, setIsInConversation] = useState(false);
  const [requestedSubtitle, setRequestedSubtitle] = useState(false);
  const [voiceText, setVoiceText] = useState(''); // 字幕は、learningのときだけ動くのでいいや。
  const [isMinimumTimePassed, setIsMinimumTimePassed] = useState(false);
  // const [learningLanguageScript, setLearningLanguageScript] = useState('');
  // const [nativeLanguageScript, setNativeLanguageScript] = useState('');
  // const [chunks, setChunks] = useState([]);
  // let mediaRecorder;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = useRef();
  recognition.current = new SpeechRecognition();
  recognition.current.continuous = true;
  recognition.current.interimResults = true;

  // useEffect(() => {
  //   if (props.mediaState.amICalling) {
  //     recognition.current.lang = props.authState.currentUser.learningLangs[0].codeForSpeechRecognition;
  //     recognition.current.start();
  //     console.log(recognition.current);
  //   }
  //   // どっかのタイミングでlanguage switch、要はrecognition一旦ストップがされることを前提にまずは。
  //   // recognition.current.onend = () => {
  //   //   // props.ac() // この実行でmediaStateのcurrent languageに自分のpractice 言語が入る。dispatchだけ。
  //   //   // ここでsocket.emit('switch language', {to: '', language: ''})
  //   //   // recognition.current.lang = 'practice langauge'
  //   //   // recognition.current.start()
  //   //   console.log('Stopped mic.current on Click'); // ここと下いらない。
  //   //   recognition.current.lang = 'ja-JP';
  //   //   // recognition.current.start(); // ここでstartして再び、onstartのsetSpeakingLearningLangOrNativeLang('learning');が再び動いちまうんだ。
  //   // };
  // }, [props.mediaState.amICalling]);
  // というよりも、recognition.onend自体をswitch functionの中に含めて書いて、その直後にstop()を実行するといいね。上のを全部移す。

  useEffect(() => {
    props.socket.on(MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE, (dataFromServer) => {
      props.recieveSwitchingLanguageRequestActionCreator(
        dataFromServer.switchingLanguage,
        recognition.current,
        props.setNativeLanguageScript
      );
      // props.recieveSwitchLanguage(dataFromServer.language); // ここで、向こうからのlanguageをredux stateに入れる。
      // const language = store.getState().mediaState.currentLanguage;
      // recognition.current.onend = () => {
      //   recognition.current.lang = language;
      //   recognition.current.start();
      // };
    });
  }, []);

  useEffect(() => {
    // ここで、多分transcriptionな感じのを書くのかね。。。
    // 最初の1回目には、実行せん。
    if (props.mediaState.callAccepted) {
      const { currentLanguage } = store.getState().mediaState;
      recognition.current.lang = currentLanguage.codeForSpeechRecognition;
      recognition.current.start();
      console.log(recognition.current);
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
          recognition.current.onerror = (event) => {
            console.log(event.error);
          };
        };
      } else if (props.mediaState.currentLanguage.name === props.authState.currentUser.nativeLangs[0].name) {
        console.log('india side should be working'); // 音声apiを一つのpcで二つ動かすのは無理みたいだな。。。
        recognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
          console.log(transcript);
          props.setNativeLanguageScript(transcript);
          recognition.current.onerror = (event) => {
            console.log(event.error);
          };
        };
      }
    }
  }, [props.mediaState.callAccepted]); // 実験して、おそらくちゃんと動いていることが分かった。

  useEffect(() => {}, [props.mediaState.currentLanguage]);

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

  // const handleSpeechRecognition = () => {
  //   // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   microphone = new SpeechRecognition();
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

    // props.sendVoiceTextActionCreator(props.socket, voiceText, microphone);

    // props.socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (voiceTetx) => {
    //   // ここにrenderするfunctionを作る感じかな。
    //   // display(voiceText)
    //   setVoiceText(voiceTetx);
    // });
    props.getVoiceTextActionCreator(props.socket, setVoiceText);

    props.getConversationIdFromCalledUserActionCreator(props.socket).then((conversationId) => {
      props.updateConversationRecievedUserActionCreator(conversationId);
    });

    props.getIntegratedUserMediaIdFromCalledUserActionCreator(props.socket);
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
    // recognition.lang = currentLanguage.codeForSpeechRecognition;
    // recognition.start();
    // console.log(recognition);
  };

  const onActivateSubtitleClick = () => {
    console.log('activate subtitle');
    props.socket.emit(I_REQUEST_PARTNERS_VOICE_TEXT, {
      to: props.mediaState.callingWith.socketId,
    });
  };

  const displaySubtitle = () => {
    if (voiceText) {
      return (
        <>
          <p className='voice-text'>{voiceText}</p>
        </>
      );
    } else {
      return null;
    }
  };

  const displayCurrentLanguage = () => {
    if (props.mediaState.currentLanguage) {
      return (
        <>
          <div style={{ color: 'white' }}>Now, We are speaking {props.mediaState.currentLanguage.name}</div>
        </>
      );
    } else {
      return null;
    }
  };

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

  const displaySwitchCurrentLanguageButton = () => {
    if (props.authState.currentUser.learningLangs[0].name === props.mediaState.currentLanguage.name) {
      return null;
    } else {
      return (
        <>
          <Button
            onClick={() =>
              props.switchCurrentLanguageActionCreator(
                props.socket,
                recognition.current,
                props.setLearningLanguageScript,
                props.setNativeLanguageScript
              )
            }
          >
            Switch
          </Button>
        </>
      );
    }
  };

  const switchRender = () => {
    if (props.mediaState.callAccepted) {
      return null;
    } else {
      if (props.mediaState.amICalling) {
        return <Dimer />;
      } else if (props.mediaState.amIRecieving) {
        return (
          <>
            <div className='confirmation'>
              <UserInfoCard user={props.mediaState.callingWith} />
              <Button positive onClick={() => handleAnswerCall(recognition.current)} style={{ width: '100%' }}>
                <i className='handshake icon' />
                Yes
              </Button>
              <Button negative style={{ width: '100%' }}>
                <i className='x icon' />
                No
              </Button>
            </div>
          </>
        );
      } else {
        return null;
      }
    }
  };

  return (
    <Modal
      className='chat-modal'
      show={props.show1on1}
      fullscreen={props.fullscreen1on1Modal}
      onHide={() => props.setShow1on1(false)}
      style={{ backgroundColor: 'rgb(8, 18, 23)' }}
    >
      <Modal.Body style={{ backgroundColor: 'rgb(8, 18, 23)' }}>
        {switchRender()}
        <div className='videos-container' style={{ marginTop: '80px' }}>
          <div className='myvideo-container'>
            <div className='myvideo'>
              <video playsInline muted ref={props.myVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
            </div>
            <div></div>
          </div>
          <div className='partner-video-container'>
            <div className='partner-video'>
              <video playsInline ref={props.oppositeVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
            </div>
            {displaySubtitle()}
          </div>
        </div>

        {props.mediaState.callAccepted ? (
          <div className='button-wrapper'>
            <Button
              negative
              // disabled={!isMinimumTimePassed}
              className='hang-up-button'
              onClick={() => props.onHangUpClick()} // ここで、recorderのstopがかかって、onstopのeventが動くようになる。
            >
              Hang up
            </Button>
            <Button onClick={() => onActivateSubtitleClick()}>activate partners subtitle</Button>
            {displaySwitchCurrentLanguageButton()}
          </div>
        ) : null}
        {displayCurrentLanguage()}
      </Modal.Body>
    </Modal>
  );
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
  // recordStreamActionCreator,
  getIntegratedUserMediaIdFromCalledUserActionCreator,
  switchCurrentLanguageActionCreator,
  recieveSwitchingLanguageRequestActionCreator,
})(FullScreen1on1Modal);
