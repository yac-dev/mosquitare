import {
  GET_MEDIA,
  CALL,
  LISTEN_CALL,
  ANSWER_CALL,
  MY_CALL_ACCEPTED,
  GET_PARTNER_MEDIA,
  CALL_ACCEPTED,
  HANG_UP_CALL,
  DISCONNECT_CALL,
  HOLD_MY_INITIATED_PEER,
  SWITCH_CURRENT_LANGUAGE,
  RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
  GOT_REJECTED,
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
  OUR_BLOB_SIZE_SHOULD_BE_THIS,
  SORRY_I_DONT_WANNA_CHAT_WITH_YOU,
  MY_CALL_IS_REJECTED,
} from './socketEvents';

import Peer from 'simple-peer';
import store from '../store';

import { updateUserConversationStateActionCreator } from './authActionCreators';
import { createConversationActionCreator } from './conversationActionCreators';
import { sendConversationIdActionCreator } from './conversationActionCreators';
import { updateConversationRecievedUserActionCreator } from './conversationActionCreators';
import { createIntegratedUserMediaActionCreator } from './integratedUserMediasActionCreators';
import { sendIntegratedUserMediaActionCeator } from './integratedUserMediasActionCreators';
import { updateConversationIntegratedUserMediaActionCreator } from './integratedUserMediasActionCreators'; //これ自体、違うところにやらんといかん。
import { updateUserConversationsActionCreator } from './authActionCreators';
// import { updateUserStreamActionCreator } from './conversationActionCreators';
import { createUserMedia } from './userMediasActionCreators';
import { updateConversationUserMediaActionCreator } from './conversationActionCreators';
import { updateIntegratedUserMediaActionCreator } from './integratedUserMediasActionCreators';
import { updateUserConversationToFalseActionCreator } from './authActionCreators';

export const getMediaActionCreator = // ここのlearningLanguageとnativeLanguage、最初からこれ入れていいかね。空の文字烈で終わりそうだな。。。まあ実験だ。

    (mediaRecorder, chunksForVideo, chunksForAudio, learningLanguageScript, nativeLanguageScript, connectionRef) =>
    (dispatch) => {
      const videoConstrains = {
        width: { ideal: 480 },
        height: { ideal: 270 },
      };
      const audioConstraints = {
        autoGainControl: false,
        channelCount: 2,
        echoCancellation: true,
        latency: 0,
        noiseSuppression: false, // これあると聞こえづらくなるわ。
        // sampleRate: 48000,
        // sampleSize: 16,
        // volume: 1.0,
      };
      navigator.mediaDevices.getUserMedia({ video: videoConstrains, audio: audioConstraints }).then((stream) => {
        dispatch({
          type: GET_MEDIA,
          payload: stream,
        });
        // 以下record用のsetting。ただそれだけ。
        // const mime = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg'].filter(MediaRecorder.isTypeSupported)[0];
        // ----------------------
        // mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        // mediaRecorder.current.ondataavailable = function (event) {
        //   // setChunksForVideo((prevState) => [...prevState, event.data]);
        //   // setChunksForAudio((prevState) => [...prevState, event.data]);
        //   chunksForVideo.push(event.data);
        //   chunksForAudio.push(event.data);
        //   console.log(chunksForVideo);
        //   console.log(chunksForAudio);
        // };
        // mediaRecorder.current.onstop = (event) => {
        //   let blobForVideo = new Blob(chunksForVideo, { type: 'video/mp4;' });
        //   let blobForAudio = new Blob(chunksForAudio, { type: 'audio/webm;codecs=opus' });
        //   // let blobForLearningLanguage = new Blob([learningLanguageScript], { type: 'text/plain' });
        //   // let blobForNativeLanguage = new Blob([nativeLanguageScript], { type: 'text/plain' });

        //   console.log('record stopped!!!');
        //   chunksForVideo = [];
        //   chunksForAudio = [];
        //   Promise.resolve()
        //     .then(() => {
        //       return dispatch(createUserMedia(blobForVideo, blobForAudio));
        //     }) // ここでconversatonのupdateだね。
        //     .then((userMedia) => {
        //       return dispatch(updateConversationUserMediaActionCreator(userMedia));
        //     })
        //     // .then((userMedia) => {
        //     //   return dispatch(updateIntegratedUserMediaActionCreator(userMedia));
        //     // })
        //     .then(() => {
        //       return dispatch(hangUpCallActionCreator(connectionRef));
        //     })
        //     .then(() => {
        //       return dispatch(updateUserConversationToFalseActionCreator());
        //     });
        //   // dispatch(createUserMedia(blobForVideo, blobForAudio, connectionRef));
        //   // ↑createUserMediaをpromisifyすることになるだろう。thenでchainして、integratedの方のupdateとかをやっていくことになるだろう。
        //   // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
        // };
      });
    };

// callする側、worldmapで実行されるやつら。
export const callActionCreator =
  (socket, mySocketId, oppositeSocketId, exchangingLanguages) => (dispatch, getState) => {
    // startLanguageはobjectな。
    const { myVideoStreamObject } = getState().mediaState;
    console.log('Im calling...');
    const callerUserInfo = getState().authState.currentUser;
    // const startLanguage = callerUserInfo.learningLangs[0];
    // console.log(startLanguage);
    console.log(exchangingLanguages);

    const peerInitiator = new Peer({
      initiator: true,
      stream: myVideoStreamObject,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: 'stun:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
        ],
      },
    });
    dispatch({
      type: HOLD_MY_INITIATED_PEER,
      payload: peerInitiator,
    });
    peerInitiator.on('signal', (signalData) => {
      socket.emit(I_CALL_SOMEBODY, { signalData, mySocketId, oppositeSocketId, callerUserInfo, exchangingLanguages }); // ここに、callerのdataを加えよう。
      dispatch({
        type: CALL,
        payload: exchangingLanguages,
      });
    });
  };

// callする側、callingModalで実行されるやつら。
export const myCallIsAcceptedActionCreator = (socket, setShowCallingModal) => (dispatch, getState) => {
  socket.on(MY_CALL_IS_ACCEPTED, (dataFromServer) => {
    const { peerInitiator } = getState().peerState;
    console.log('My call is accepted.');
    const startLanguage = getState().authState.currentUser.learningLangs[0];
    dispatch({
      type: MY_CALL_ACCEPTED,
      payload: {
        recieverUserInfo: dataFromServer.recieverUserInfo,
        startLanguage,
        partnerSignalData: dataFromServer.signalData,
      },
    });
    setShowCallingModal(false);
  });
};

// callする側、fullscreenで実行されるやつら。
export const completeConnectionWithMyPartnerActionCreator1 =
  (myVideoRef, oppositeVideoRef, connectionRef) => (dispatch, getState) => {
    const { peerInitiator } = getState().peerState;
    const { myVideoStreamObject } = getState().mediaState;
    const { partnerSignalData } = getState().mediaState;
    const { partnerVideoStreamObject } = getState().mediaState;
    peerInitiator.signal(partnerSignalData);
    peerInitiator.on('stream', (stream) => {
      console.log('INITIATOR on stream should be working');
      myVideoRef.current.srcObject = myVideoStreamObject;
      oppositeVideoRef.current.srcObject = stream;
      connectionRef.current = peerInitiator;
    });
    return Promise.resolve();
  };

// call受ける側、worldmapで実行されるやつら。
export const listenCallActionCreator = (socket, setShowCallingModal) => (dispatch) => {
  socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
    console.log('Somebody calls me.');
    const { signalData, whoIsCalling, callerUserInfo, exchangingLanguages } = dataFromServer;
    console.log(exchangingLanguages);
    setShowCallingModal(true);
    dispatch({
      type: LISTEN_CALL,
      payload: { signalData, whoIsCalling, callerUserInfo, exchangingLanguages },
    });
  });
};

// call受ける側、callingmodalで実行されるやつら。
export const answerCallActionCreator1 = (socket) => (dispatch, getState) => {
  dispatch({
    type: ANSWER_CALL,
    payload: '',
  });
};

// call 受ける側、fullscxreenで実行されるやつら。
export const answerCallActionCreator2 =
  (socket, myVideoRef, oppositeVideoRef, connectionRef) => (dispatch, getState) => {
    console.log('answerCallAC2 working???');
    const { myVideoStreamObject } = getState().mediaState;
    const { partnerVideoStreamObject } = getState().mediaState;
    const { callerSignal } = getState().mediaState;
    const recieverUserInfo = getState().authState.currentUser;

    const { whoIsCalling } = getState().mediaState;
    const peerReciever = new Peer({
      initiator: false,
      stream: myVideoStreamObject,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: 'stun:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
        ],
      },
      // config: {
      //   iceServers: [
      //     {
      //       url: 'stun:stun.l.google.com:19302',
      //     },
      //     {
      //       url: 'turn:18.191.241.72:3478',
      //       username: 'yosukekoji',
      //       credential: '123456',
      //     },
      //   ],
      // },
    });
    dispatch({
      type: HOLD_MY_INITIATED_PEER,
      payload: peerReciever,
    });
    peerReciever.on('signal', (signalData) => {
      socket.emit(I_ANSWER_THE_CALL, { signalData, whoIsCalling, recieverUserInfo });
    });

    peerReciever.on('stream', (stream) => {
      console.log('peerReciever.on stream should be working.');
      myVideoRef.current.srcObject = myVideoStreamObject;
      oppositeVideoRef.current.srcObject = stream;
      connectionRef.current = peerReciever;
    });
    peerReciever.signal(callerSignal);
    console.log('I answered');
    return Promise.resolve();
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
        payload: {
          recieverUserInfo: dataFromServer.recieverUserInfo,
          startLanguage,
        }, // callが受け入れられたら、相手のinfoとcurrentLanguageを埋める。
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
          return dispatch(sendConversationIdActionCreator(socket));
        })
        .then(() => {
          return dispatch(updateUserConversationsActionCreator()); // まずは実験。どうなるでしょうか。→だめ。userのinstanceをまんま渡してpatchはうまく動かん見たいだ。
        });
      // .then(() => {
      //   return dispatch(createIntegratedUserMediaActionCreator());
      // })
      // .then(() => {
      //   return dispatch(sendIntegratedUserMediaActionCeator(socket));
      // })
      // .then(() => {
      //   return dispatch(updateConversationIntegratedUserMediaActionCreator());
      // });
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

// export const listenCallActionCreator = (socket, setFullscreen1on1Modal, setShow1on1) => (dispatch) => {
//   socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
//     console.log('somebody calls me!!!');
//     const { signalData, whoIsCalling, callerUserInfo, startLanguage } = dataFromServer;
//     console.log(signalData, whoIsCalling);
//     setFullscreen1on1Modal(true);
//     setShow1on1(true);
//     // myVideo.current.srcObject = myVideoStreamObject;
//     dispatch({
//       type: LISTEN_CALL,
//       payload: { signalData, whoIsCalling, callerUserInfo, startLanguage },
//     });
//   });
// };

// export const answerCallActionCreator2 = (socket, myVideoRef, oppositeVideoRef, connectionRef) => (_, getState) => {
//   const { myVideoStreamObject } = getState().mediaState;
//   const { whoIsCalling } = getState().mediaState;
//   const { callerSignal } = getState().mediaState;

//   const recieverUserInfo = getState().authState.currentUser;
//   console.log(callerSignal);
//   // answerでは、まずcalling modalを閉じて、その後fullscreenを出すっていうだけにした方がいいのかね。
//   const peerReciever = new Peer({ initiator: false, stream: myVideoStreamObject, trickle: false });
//   myVideoRef.current.srcObject = myVideoStreamObject;

//   peerReciever.on('stream', (stream) => {
//     console.log('working??');
//     console.log(stream);
//     oppositeVideoRef.current.srcObject = stream;
//   });

//   peerReciever.on('signal', (signalData) => {
//     socket.emit(I_ANSWER_THE_CALL, { signalData, whoIsCalling, recieverUserInfo });
//     // store.dispatch(updateUserConversationStateActionCreator(recieverUserInfo._id));
//   });

//   peerReciever.signal(callerSignal);
//   connectionRef.current = peerReciever;
//   console.log('I answered');
//   // component rerenderのために何かのacをdispatchした方がいいんかもしれんな。。。。
//   return Promise.resolve();
// };

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
      // answerでは、まずcalling modalを閉じて、その後fullscreenを出すっていうだけにした方がいいのかね。
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

export const hangUpCallActionCreator = () => {
  // dispatch(updateUserConversationToFalseActionCreator()); // ここpromisifyね。これだめ。
  // connectionRef.current.destroy();
  // dispatch({
  //   type: HANG_UP_CALL,
  //   payload: '',
  // });
  // history.push('/worldmap'); こうではなくて、modalを閉じることが必要だ。
  // その前にrecordingだ。
  // window.location = '/worldmap'; // まあこれでいいのかね。
  return {
    type: HANG_UP_CALL,
    payload: '',
  };
};

export const disconnectCallActionCreator = (connectionRef) => (dispatch) => {
  connectionRef.current.destroy();
  dispatch({
    type: DISCONNECT_CALL,
    payload: '',
  });
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
    setLanguageSubtitle((previousState) => [...previousState, dataFromServer.nativeLanguageScript]);
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
  (switchingLanguage, recognition, setNativeLanguageScript, socket) => (dispatch, getState) => {
    dispatch({
      type: RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
      payload: switchingLanguage,
    });
    // こっからrecognitionに関するもの。
    const to = getState().mediaState.callingWith.socketId;
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
      socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, { to, nativeLanguageScript: transcript });
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

export const forChunks = (chunksData) => {
  return {
    type: 'SET_CHUNKS',
    payload: chunksData,
  };
};

export const switchCurrentLanguageActionCreator1 = (socket) => (dispatch, getState) => {
  let switchingLanguage;
  const { currentLanguage } = getState().mediaState;
  const { exchangingLanguages } = getState().mediaState; // array
  const [lang1, lang2] = exchangingLanguages;
  if (currentLanguage.name === lang1.name) {
    switchingLanguage = lang2;
  } else if (currentLanguage.name === lang2.name) {
    switchingLanguage = lang1;
  }
  // const switchingLanguage = getState().authState.currentUser.learningLangs[0];
  const partnerSocketId = getState().mediaState.callingWith.socketId;
  dispatch({
    type: SWITCH_CURRENT_LANGUAGE,
    payload: switchingLanguage,
  });
  socket.emit(I_WANNA_SWITCH_CURRENT_LANGUAGE, { to: partnerSocketId, switchingLanguage });
};

export const recieveSwitchingLanguageRequestActionCreator1 = (switchingLanguage) => {
  return {
    type: RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
    payload: switchingLanguage,
  };
};

// もう使わない。
export const sendBlobSizeToMyPartnerActionCreator = (socket, blobSize) => (dispatch, getState) => {
  try {
    // const blobSize = getState();
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    socket.emit(OUR_BLOB_SIZE_SHOULD_BE_THIS, { to: partnerSocketId, blobSize });
  } catch (error) {
    console.log(error);
  }
};

export const getBlobSizeFromPartnerActionCreator = (socket) => (dispatch, getState) => {
  try {
    socket.on('I_GOT_BLOB_SIZE_FROM_MY_PARTNER', (dataFromServer) => {
      dispatch({
        type: 'GET_BLOBSIZE',
        payload: dataFromServer.blobSize,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const rejectCallActionCreator = (socket) => (dispatch, getState) => {
  try {
    const partnerSocketId = getState().mediaState.callingWith.socketId;
    const mySocketId = getState().authState.socketId;
    socket.emit(SORRY_I_DONT_WANNA_CHAT_WITH_YOU, {
      to: partnerSocketId,
      from: mySocketId,
      message: "Sorry. I can't chat with you now.", // まあこれいらないかな。。。
    });
  } catch (error) {
    console.log(error);
  }
};

export const gotRejectedMyCallActionCreator = (socket) => (dispatch, getState) => {
  try {
    socket.on(MY_CALL_IS_REJECTED, (dataFromServer) => {
      dispatch({
        type: GOT_REJECTED,
        payload: '',
      });
    });
  } catch (error) {
    console.log(error);
  }
};
