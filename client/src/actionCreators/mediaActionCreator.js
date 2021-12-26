import {
  GET_MEDIA,
  CALL,
  LISTEN_CALL,
  ANSWER_CALL,
  CALL_ACCEPTED,
  HANG_UP_CALL,
  HOLD_MY_INITIATED_PEER,
  SWITCH_CURRENT_LANGUAGE,
  RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
} from './type';
import {
  SOMEBODY_CALLS_ME,
  I_CALL_SOMEBODY,
  I_ANSWER_THE_CALL,
  MY_CALL_IS_ACCEPTED,
  MY_PARTENER_REQUESTS_MY_VOICE_TEXT,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
  I_WANNA_SWITCH_CURRENT_LANGUAGE,
} from './socketEvents';

import Peer from 'simple-peer';
import store from '../store';

import { updateUserConversationStateActionCreator } from './authActionCreators';
import { updateUserConversationToFalseActionCreator } from './authActionCreators';
import { createConversationActionCreator } from './conversationActionCreators';
import { updateConversationRecievedUserActionCreator } from './conversationActionCreators';
import { createIntegratedUserMediaActionCreator } from './integratedUserMediasActionCreators';
import { sendIntegratedUserMediaActionCeator } from './integratedUserMediasActionCreators';
import { updateConversationIntegratedUserMediaActionCreator } from './integratedUserMediasActionCreators';
// import { updateUserStreamActionCreator } from './conversationActionCreators';
import { createUserMedia } from './userMediasActionCreators';

export const getMediaActionCreator =  // ここのlearningLanguageとnativeLanguage、最初からこれ入れていいかね。空の文字烈で終わりそうだな。。。まあ実験だ。
  (mediaRecorder, chunksForVideo, chunksForAudio, setChunksForVideo, setChunksForAudio, connectionRef) =>
  (dispatch) => {
    const audioConstraints = {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      latency: 0,
      noiseSuppression: false,
      sampleRate: 48000,
      sampleSize: 16,
    };
    navigator.mediaDevices.getUserMedia({ video: true, audio: audioConstraints }).then((stream) => {
      dispatch({
        type: GET_MEDIA,
        payload: stream,
      });
      // 以下record用のsetting。ただそれだけ。
      // const mime = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg'].filter(MediaRecorder.isTypeSupported)[0];
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorder.current.ondataavailable = function (event) {
        setChunksForVideo((prevState) => [...prevState, event.data]);
        setChunksForAudio((prevState) => [...prevState, event.data]);
        // chunksForVideo.push(event.data);
        // chunksForAudio.push(event.data);
      };
      // mediaRecorder.current.onstop = (event) => {
      //   let blobForVideo = new Blob(chunksForVideo, { type: 'video/mp4;' });
      //   let blobForAudio = new Blob(chunksForAudio, { type: 'audio/webm;codecs=opus' });
      //   let blobForLearningLanguage = new Blob([learningLanguageScript], { type: 'text/plain' });
      //   let blobForNativeLanguage = new Blob([nativeLanguageScript], { type: 'text/plain' });

      //   console.log('recore stopped!!!');
      //   chunksForVideo = [];
      //   chunksForAudio = [];
      //   Promise.resolve()
      //     .then(() => {
      //       return dispatch(
      //         createUserMedia(blobForVideo, blobForAudio, blobForLearningLanguage, blobForNativeLanguage, connectionRef)
      //       ); //ここにさらに上で足したanguageのblobを入れるな。
      //     })
      //     .then(() => {
      //       return dispatch(hangUpCallActionCreator(connectionRef));
      //     });
      //   // dispatch(createUserMedia(blobForVideo, blobForAudio, connectionRef));
      //   // ↑createUserMediaをpromisifyすることになるだろう。thenでchainして、integratedの方のupdateとかをやっていくことになるだろう。
      //   // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
      // };
    });
  };

export const callActionCreator =
  (socket, mySocketId, myVideoRef, oppositeSocketId, oppositeVideoRef, connectionRef, mediaRecorderRef, setChunks) =>
  (dispatch, getState) => {
    const { myVideoStreamObject } = getState().mediaState;
    console.log('Im calling...');
    const callerUserInfo = getState().authState.currentUser;
    const startLanguage = callerUserInfo.learningLangs[0];
    console.log(startLanguage);
    const peerInitiator = new Peer({ initiator: true, stream: myVideoStreamObject, trickle: false });
    dispatch({
      type: HOLD_MY_INITIATED_PEER,
      payload: peerInitiator,
    });
    peerInitiator.on('signal', (signalData) => {
      socket.emit(I_CALL_SOMEBODY, { signalData, mySocketId, oppositeSocketId, callerUserInfo, startLanguage }); // ここに、callerのdataを加えよう。
      dispatch({
        type: CALL,
        payload: startLanguage,
      });
    });
    // peerInitiator.on('stream', (stream) => {
    //   myVideoRef.current.srcObject = myVideoStreamObject;
    //   oppositeVideoRef.current.srcObject = stream;
    //   // dispatch(updateUserConversationStateActionCreator(currentUser._id)); // これも外に出すべきでしょう。。。
    //   connectionRef.current = peerInitiator;
    //   console.log('call accepted??????');
    // });
    // ここで一回切るべきね。

    // socket.on(MY_CALL_IS_ACCEPTED, (dataFromServer) => {
    //   console.log('My call is accepted.');
    //   dispatch({
    //     type: CALL_ACCEPTED,
    //     payload: dataFromServer.recieverUserInfo,
    //   });
    //   peerInitiator.signal(dataFromServer.signalData);
    // });

    // peerInitiator.on('stream', (stream) => {
    //   myVideoRef.current.srcObject = myVideoStreamObject;
    //   oppositeVideoRef.current.srcObject = stream;
    //   dispatch(updateUserConversationStateActionCreator(callerUserInfo._id));
    //   connectionRef.current = peerInitiator;
    //   console.log('call accepted??????');

    //   // ここで切ろう。
    //   // dispatch(updateUserConversationStateActionCreator());
    //   mediaRecorderRef.start();
    //   dispatch(createConversationActionCreator(socket))
    //     .then(() => {
    //       return dispatch(createIntegratedUserMediaActionCreator());
    //     })
    //     .then(() => {
    //       return dispatch(sendIntegratedUserMediaActionCeator(socket));
    //     })
    //     .then(() => {
    //       return dispatch(updateConversationIntegratedUserMediaActionCreator());
    //     });
    // });
  };

export const completeConnectionWithMyPartnerActionCreator =
  (socket, peerInitiator, myVideoRef, oppositeVideoRef, connectionRef, mediaRecorder) => (dispatch, getState) => {
    // return new Promise((resolve, reject) => {
    socket.on(MY_CALL_IS_ACCEPTED, (dataFromServer) => {
      // このcompleteConnectionっていうacを分解したほうがいいな。socket.onを、fullの方に書く。その後に、acを連ねて書いていく、って言うほうが確実に分かりやすいな。後で直したほうがいい。
      const { peerInitiator } = getState().peerState;
      const { myVideoStreamObject } = getState().mediaState;
      console.log('My call is accepted.');
      const startLanguage = getState().authState.currentUser.learningLangs[0];
      dispatch({
        type: CALL_ACCEPTED,
        payload: { recieverUserInfo: dataFromServer.recieverUserInfo, startLanguage }, // callが受け入れられたら、相手のinfoとcurrentLanguageを埋める。
      });
      peerInitiator.signal(dataFromServer.signalData);
      peerInitiator.on('stream', (stream) => {
        myVideoRef.current.srcObject = myVideoStreamObject;
        oppositeVideoRef.current.srcObject = stream;
        connectionRef.current = peerInitiator;
        console.log('call accepted??????');
      });
      Promise.resolve()
        .then(() => {
          return dispatch(updateUserConversationStateActionCreator());
        })
        .then(() => {
          return dispatch(startMediaRecorder(mediaRecorder));
        })
        .then(() => {
          return dispatch(createConversationActionCreator(socket)); // 多分ここも分けることになる。
        })
        .then(() => {
          return dispatch(createIntegratedUserMediaActionCreator());
        })
        .then(() => {
          return dispatch(sendIntegratedUserMediaActionCeator(socket));
        })
        .then(() => {
          return dispatch(updateConversationIntegratedUserMediaActionCreator());
        });
    });
  };

export const startMediaRecorder = (mediaRecorderRef) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    mediaRecorderRef.current.start();
    resolve();
  });
};

// これをcompleteconnection, answerの後に続けていく感じかね。。。
export const startSpeechRecognition = (recognition) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const language = getState().mediaState.currentLanguage;
    recognition.lang = language;
    recognition.start();
    resolve();
  });
};

export const listenCallActionCreator = (socket, setFullscreen1on1Modal, setShow1on1) => (dispatch) => {
  socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
    console.log('somebody calls me!!!');
    const { signalData, whoIsCalling, callerUserInfo, startLanguage } = dataFromServer;
    console.log(signalData, whoIsCalling);
    setFullscreen1on1Modal(true);
    setShow1on1(true);
    // myVideo.current.srcObject = myVideoStreamObject;
    dispatch({
      type: LISTEN_CALL,
      payload: { signalData, whoIsCalling, callerUserInfo, startLanguage },
    });
  });
};

export const answerCallActionCreator =
  (socket, myVideoRef, oppositeVideoRef, connectionRef, mediaRecorderRef) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: ANSWER_CALL,
        payload: '',
      });
      console.log('Im answering.');
      // 確かに、こういう場合はcallerが誰か持ってなきゃな。
      const { myVideoStreamObject } = getState().mediaState;
      const { whoIsCalling } = getState().mediaState;
      const { callerSignal } = getState().mediaState;

      const recieverUserInfo = getState().authState.currentUser;
      console.log(callerSignal);
      const peerReciever = new Peer({ initiator: false, stream: myVideoStreamObject, trickle: false });
      myVideoRef.current.srcObject = myVideoStreamObject;

      peerReciever.on('stream', (stream) => {
        console.log('working??');
        console.log(stream);
        oppositeVideoRef.current.srcObject = stream;
      });

      peerReciever.on('signal', (signalData) => {
        socket.emit(I_ANSWER_THE_CALL, { signalData, whoIsCalling, recieverUserInfo });
        // store.dispatch(updateUserConversationStateActionCreator(recieverUserInfo._id));
      });

      peerReciever.signal(callerSignal);
      connectionRef.current = peerReciever;
      console.log('I answered');
      // dispatch(updateConversationRecievedUserActionCreator());
      // mediaRecorderRef.current.start();
      resolve();
    });
    // mediaRecorderRef.current = new MediaRecorder(myVideoStreamObject);
    // mediaRecorderRef.current.ondataavailable = function (event) {
    //   console.log('ondataavai');
    //   console.log(event.data); // ここにはちゃんとdataが入っている。
    //   // setChunks((oldChunks) => {
    //   //   return [...oldChunks, event.data];
    //   // });
    //   chunksBuffer.push(event.data);
    // };
    // mediaRecorderRef.current.onstop = (event) => {
    //   let blob = new Blob(chunksBuffer, { type: 'video/mp4;' }); // blob自体は、object。
    //   // ここでmp4のdataが作られたらこれをmongoとs3に保存していくapi requestをすることだ。
    //   // chunks = [];
    //   chunksBuffer = [];
    //   updateUserStreamActionCreator(blob, connectionRef); // connectionRefも引数に入れなきゃだ。chunksBufferもpropsバケツしなきゃだ。
    //   // setChunks([]); // arrayを空にするのってどうやるんだっけ？？
    //   // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
    // }; // これ自体、asyncな動きをしている、おそらく。だからhangupcallが先に動いちゃっている。
  }; // ここは、startRecor、updateUserConversationStateActionCreator、updateConversationRecievedUserActionCreatorの順でpromisifyだな。

// export const callAcceptedActionCreator = (oppositeVideoRef, connectionRef) => (dispatch) => {
//   socket.on(MY_CALL_IS_ACCEPTED, (signalData) => {
//     console.log('My call is accepted.');
//     console.log(signalData);

//     dispatch({
//       type: CALL_ACCEPTED,
//       payload: '',
//     });
//     peerInitiator.signal(signalData);
//     console.log('not sure...');
//   });

//   peerInitiator.on('stream', (stream) => {
//     oppositeVideoRef.current.srcObject = stream;
//   });

//   connectionRef.current = peerInitiator;
// };

export const hangUpCallActionCreator = (connectionRef) => (dispatch) => {
  console.log('should be working!!');
  dispatch(updateUserConversationToFalseActionCreator()); // ここpromisifyね。これだめ。
  connectionRef.current.destroy();
  dispatch({
    type: HANG_UP_CALL,
    payload: '',
  });
  // history.push('/worldmap'); こうではなくて、modalを閉じることが必要だ。
  // その前にrecordingだ。
  // window.location = '/worldmap'; // まあこれでいいのかね。
};

// こことか、redux thunk使う必要ないな。
export const sendVoiceTextActionCreator = (socket, nativeLanguageScript) => (dispatch, getState) => {
  socket.on(MY_PARTENER_REQUESTS_MY_VOICE_TEXT, () => {
    console.log(nativeLanguageScript);
    console.log('gonna send voice text');
    // setRequestedSubtitle(true);
    const to = getState().mediaState.callingWith.socketId;
    // ここに何かいるのか。もしかしたら、ここでmicrophoneのresultのcallbackとして入れるのがいいかもしれん。setRequestedはいらないかも。
    // ここで、自分のnativeLangのreact stateを全部送る。
    socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, { to, nativeLanguageScript });

    // microphone.start();
    // microphone.onresult = (event) => {
    //   // console.log(event);
    //   const transcript = Array.from(event.results)
    //     .map((result) => result[0])
    //     .map((result) => result.transcript)
    //     .join('');
    //   console.log(transcript);
    //   // setVoiceText(transcript);
    //   // props.sendVoiceTextActionCreator(props.socket, voiceText, setRequestedSubtitle);
    //   socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
    //     to: to,
    //     voiceText: transcript,
    //   });
    // };
  });
};

export const getVoiceTextActionCreator = (socket, setLanguageSubtitle) => () => {
  socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (dataFromServer) => {
    // ここにrenderするfunctionを作る感じかな。
    console.log('partner sent to me...');
    console.log(dataFromServer.nativeLanguageScript); // koko
    // display(voiceText)
    setLanguageSubtitle(dataFromServer.nativeLanguageScript);
  });
};

// recognitionのargumentには、recognition.currentを渡す。
export const switchCurrentLanguageActionCreator =
  (socket, recognition, setLearningLanguageScript, setNativeLanguageScript) => (dispatch, getState) => {
    const switchingLanguage = getState().authState.currentUser.learningLangs[0];
    dispatch({
      type: SWITCH_CURRENT_LANGUAGE,
      payload: switchingLanguage,
    });
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    socket.emit(I_WANNA_SWITCH_CURRENT_LANGUAGE, { to: partnerSocketId, switchingLanguage });
    // こっからrecognition
    recognition.stop();
    recognition.lang = switchingLanguage.codeForSpeechRecognition;
    recognition.onresult = (event) => {
      // console.log(event);
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      setLearningLanguageScript((prev) => prev + transcript);
      recognition.onerror = (event) => {
        console.log(event.error);
      };
    };
    recognition.start(); //逆に、何で練習の方ではこれ動いてくれなかったんだろね。。。
    // recognition.onend = () => {
    //   recognition.lang = switchingLanguage.codeForSpeechRecognition;
    //   recognition.start();
    // };
    // recognition.stop();
    // こっから下に、onresultをやるべきだ。
    // recognition.onresult = (event) => {
    //   // console.log(event);
    //   const transcript = Array.from(event.results)
    //     .map((result) => result[0])
    //     .map((result) => result.transcript)
    //     .join('');
    //   console.log(transcript);
    //   setLearningLanguageScript(transcript);
    //   recognition.current.onerror = (event) => {
    //     console.log(event.error);
    //   };
    // };
  };

// 直すのはこっちね。
// recognitionのargumentには、recognition.currentを渡す。
export const recieveSwitchingLanguageRequestActionCreator =
  (switchingLanguage, recognition, setNativeLanguageScript) => (dispatch, getState) => {
    dispatch({
      type: RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
      payload: switchingLanguage,
    });
    // こっからrecognitionに関するもの。
    recognition.stop();
    recognition.lang = switchingLanguage.codeForSpeechRecognition;
    recognition.onresult = (event) => {
      // console.log(event);
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      setNativeLanguageScript((prev) => prev + transcript);
      recognition.onerror = (event) => {
        console.log(event.error);
      };
    };
    recognition.start();
    // recognition.onend = () => {
    //   recognition.lang = switchingLanguage.codeForSpeechRecognition;
    //   recognition.start();
    // };
    // recognition.stop();
    // ここから下にonresultを書くべきだわ。 ↓startの後にonresultをもってくるのはどうなんだろう。。。
    // recognition.onresult = (event) => {
    //   // console.log(event);
    //   const transcript = Array.from(event.results)
    //     .map((result) => result[0])
    //     .map((result) => result.transcript)
    //     .join('');
    //   console.log(transcript);
    //   setNativeLanguageScript(transcript);
    //   recognition.current.onerror = (event) => {
    //     console.log(event.error);
    //   };
    // };
  };
