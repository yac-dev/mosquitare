import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:3500');

const Socket = () => {
  // hooks states
  const [myStream, setMyStream] = useState(null);
  const [me, setMe] = useState(null);

  // callを受けた場合
  const [isRecievingCall, setIsRecievingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState();

  //answer関連。
  const [callAccepted, setCallAccepted] = useState(false);

  // callする。
  const [oppositeIdToCall, setOppositeIdToCall] = useState('');

  // hooks useRef
  const myVideo = useRef();
  const oppositeVideo = useRef();
  const connectionRef = useRef();

  // hooks useEffect
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMyStream(stream);

      // 確かに、[]でuseStateを使うのは良くない。
      // myVideo.current.srcObject = myStream;
      myVideo.current.srcObject = stream;
    });

    // signaling serverからsocketのidがemitされている。
    socket.on('ME', (socketIDfromServer) => {
      setMe(socketIDfromServer);
    });

    // signaling serverからCALLUSER eventが来たら、そのeventをlistenする。
    // これは基本、callを受けたclientのmemoryに保存される。
    socket.on('CALL', (data) => {
      setIsRecievingCall(true);
      setCaller(data.caller);
      setCallerSignal(data.signalData);
    });
  }, []);

  const call = (oppositeId) => {
    const peer = new Peer({ initiator: true, stream: myStream, trickle: false });

    // signaling serverへデータを渡す。typeはofferで、media config（video, audio）をsdpとする。送信元は誰で、送信先が誰であるか。
    peer.on('signal', (signalData) => {
      console.log('Im calling...');
      socket.emit('CALL', { signalData, me, oppositeId });
    });

    // clientBがanswerした後、ここがなんかおかしくなる。。。
    socket.on('ACCEPTED', (signalData) => {
      console.log('My call is accepted.');
      console.log(signalData);
      setCallAccepted(true);
      peer.signal(signalData);
    });

    peer.on('stream', (stream) => {
      oppositeVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

  const answer = () => {
    setCallAccepted(true);
    console.log('I answered.');

    const peer = new Peer({ initiator: false, stream: myStream, trickle: false });

    peer.on('stream', (stream) => {
      oppositeVideo.current.srcObject = stream;
    });

    peer.on('signal', (signalData) => {
      socket.emit('ANSWER', { signalData, caller });
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // rendering
  console.log(caller);

  return (
    <div>
      Socket page
      <div className='video-container'>
        <div className='video'>
          <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
          <div>{me}</div>
        </div>
        <div className='video'>
          <video playsInline ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
        </div>
      </div>
      <label>Opposite ID to call</label>
      <input value={oppositeIdToCall} onChange={(e) => setOppositeIdToCall(e.target.value)} />
      <button onClick={() => call(oppositeIdToCall)}>Call</button>
      <div>
        <div className='caller'>
          {/* <h1>Someone is calling...</h1> */}
          <button onClick={answer}>Answer</button>
        </div>
      </div>
    </div>
  );
};

export default Socket;
