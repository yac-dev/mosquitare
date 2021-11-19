import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphone = new SpeechRecognition();
microphone.continuous = true;
microphone.interimResults = true;
microphone.lang = 'en-US';

const FullScreen1on1Modal = (props) => {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [isInConversation, setIsInConversation] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  // 「videoRef、oppositeVideoRef, onHangUpClick, switchRender」　をworldmapからprops使って、このcomponentに渡す。
  const handleListen = () => {
    if (isInConversation) {
      microphone.start();
      microphone.onend = () => {
        console.log('continue..');
        microphone.start();
      }; // ここの必要はあるんだろか？？いらない気がするんだよな。
    } else {
      microphone.stop();
      microphone.onend = () => {
        console.log('Stopped microphone on Click');
      };
    }

    microphone.onstart = () => {
      console.log('microphones on');
    };

    microphone.onresult = (event) => {
      // console.log(event);
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      setVoiceText(transcript);
      microphone.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  useEffect(() => {
    handleListen();
  }, [isInConversation]);

  // ここでもsocketだな。こっちでまず、request your voice textみたいなeventを送って、それに対してvoiceの方が答えて、こっちのvoice textを送る、みたいな実装になるだろね。

  useEffect(() => {
    props.socket.on('YOUR_PARTENER_REQUESTS_YOUR_VOICE_TEXT', () => {
      props.socket.emit('I_SEN_YOU_MY_VOICE_TEXT', { from: 'me', to: 'partner', voiceText: voiceText });
    });

    props.socket.on('PARTENER_SEND_ME_VOICE_TEXT', (voiceTetx) => {
      // ここにrenderするfunctionを作る感じかな。
      // display(voiceText)
    });
  }, []);
  // おおよその設計はこんな感じだろうな。
  // 正直、まずはrefactoringが必要。それが面倒臭いんだよ。

  const onActivateSubtitleClick = () => {
    props.socket.emit('I_REQUEST_YOUR_VOICE_TEXT'); // ただsignaling serverにeventをemitするだけで、特にこっちから出す情報はいらない。
  };

  return (
    <Modal
      className='chat-modal'
      show={show}
      fullscreen={fullscreen}
      onHide={() => setShow(false)}
      style={{ backgroundColor: 'blue' }}
    >
      <Modal.Body style={{ backgroundColor: 'rgb(8, 18, 23)' }}>
        {props.switchRender()}
        <div className='video-container'>
          <div className='video' style={{ marginTop: '100px' }}>
            <video playsInline muted ref={props.myVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
            <video playsInline ref={props.oppositeVideo} autoPlay style={{ width: '600px', borderRadius: '20px' }} />
          </div>
        </div>
        {props.mediaState.callAccepted ? (
          <div className='button-wrapper'>
            <Button negative className='hang-up-button' onClick={() => props.onHangUpClick()}>
              Hang up
            </Button>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default FullScreen1on1Modal;
