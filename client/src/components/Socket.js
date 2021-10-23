import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Peer } from 'simple-peer';

const socket = io('http://localhost:3500');

const Socket = () => {
  // hooks states
  const [myStream, setMyStream] = useState(null);
  const [me, setMe] = useState(null);

  // callを受けた場合
  const [isRecievingCall, setIsRecievingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);

  //answer関連。
  const [callAccepted, setCallAccepted] = useState(false);

  // hooks useRef
  const myVideo = useRef();
  const oppositeVideo = useRef();
  const connectionRef = useRef();

  // hooks useEffect
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMyStream(stream);
    });

    // signaling serverからsocketのidがemitされている。
    socket.on('ME', (socketIDfromServer) => {
      setMe(socketIDfromServer);
    });

    // signaling serverからCALLUSER eventが来たら、そのeventをlistenする。
    // これは基本、callを受けたclientのmemoryに保存される。
    socket.on('CALL', (callingDataFromServer) => {
      setIsRecievingCall(true);
      setCaller(callingDataFromServer.from);
      setCallerSignal(callingDataFromServer.signalData);
    });
  }, []);

  const call = (userToCall) => {
    const peer = new Peer({ initiator: true, stream: myStream, tricke: false });

    // signaling serverへデータを渡す。typeはofferで、media config（video, audio）をsdpとする。送信元は誰で、送信先が誰であるか。
    peer.on('signal', (signalData) => {
      socket.emit('CALL', { signalData, me, userToCall });
    });

    socket.on('ACCEPTED', (signalData) => {
      console.log('My call is accepted.');
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

    const peer = new Peer({ initiator: false, stream: myStream, tricke: false });

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
  return (
    <div>
      Socket page
      <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
      <video playsInline muted ref={oppositeVideo} autoPlay style={{ width: '300px' }} />
    </div>
  );
};

export default Socket;
