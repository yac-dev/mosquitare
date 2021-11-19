import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

import Dimer from '../Dimer';
import ConfirmationCard from '../ConfirmationCard';

import '../../styles/worldmap.css';

// action creators
import { answerCallActionCreator } from '../../actionCreators/mediaActionCreator';

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

  const switchRender = () => {
    if (props.mediaState.callAccepted) {
      return null;
    } else {
      if (props.mediaState.amICalling) {
        return <Dimer />;
      } else if (props.mediaState.amIRecieving) {
        return (
          <ConfirmationCard
            user={props.mediaState.callingWith}
            callback={props.answerCallActionCreator} // これいらんわ。confirmationでconnectを使えばいい、もしくはstore使えばいい。
            socket={props.socket}
            myVideo={props.myVideo}
            oppositeVideo={props.oppositeVideo}
            connectionRef={props.connectionRef}
          />
        );
      } else {
        return null;
      }
    }
  };

  // const onHangUpClick = () => {
  //   props.hangUpCallActionCreator(props.connectionRef);
  //   props.setShow1on1(false); // このhangUpCallに関しては、world mapに必要かもな。show1on1のstateを変えたいから。
  // };

  // ここはおそらく、showとfullscreen共にworldmap側で持ってないといかんな。
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

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, { answerCallActionCreator })(FullScreen1on1Modal);
