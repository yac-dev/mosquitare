import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

import Dimer from '../Dimer';
import ConfirmationCard from '../ConfirmationCard';
import UserInfoCard from '../UserInfoCard';

import '../../styles/1on1.css';
import {
  I_REQUEST_PARTNERS_VOICE_TEXT,
  MY_PARTENER_REQUESTS_MY_VOICE_TEXT,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
} from '../../actionCreators/socketEvents';

// action creators
import { answerCallActionCreator } from '../../actionCreators/mediaActionCreator';
import { sendVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';
import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphone = new SpeechRecognition();
microphone.continuous = true;
microphone.interimResults = true;
microphone.lang = 'en-US';

const FullScreen1on1Modal = (props) => {
  const [isInConversation, setIsInConversation] = useState(false);
  const [requestedSubtitle, setRequestedSubtitle] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isMinimumTimePassed, setIsMinimumTimePassed] = useState(false);

  // 「videoRef、oppositeVideoRef, onHangUpClick, switchRender」　をworldmapからprops使って、このcomponentに渡す。
  const handleListen = () => {
    if (requestedSubtitle) {
      microphone.start();
      microphone.onend = () => {
        console.log('continue..');
        microphone.start();
      };
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
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      setVoiceText(transcript);
      // props.sendVoiceTextActionCreator(props.socket, voiceText, setRequestedSubtitle);
      microphone.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  // useEffect(() => {
  //   handleListen();
  // }, [requestedSubtitle]);
  // ここでもsocketだな。こっちでまず、request your voice textみたいなeventを送って、それに対してvoiceの方が答えて、こっちのvoice textを送る、みたいな実装になるだろね。

  useEffect(() => {
    console.log('subtitle request coming...');
    // props.socket.on(MY_PARTENER_REQUESTS_MY_VOICE_TEXT, () => {
    //   props.socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
    //     to: 0,
    //     voiceText: voiceText,
    //   });
    // });

    props.sendVoiceTextActionCreator(props.socket, voiceText, microphone);

    // props.socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (voiceTetx) => {
    //   // ここにrenderするfunctionを作る感じかな。
    //   // display(voiceText)
    //   setVoiceText(voiceTetx);
    // });
    props.getVoiceTextActionCreator(props.socket, setVoiceText);
  }, []);

  useEffect(() => {
    // これはここでいいと思う。chatが始まって二人のchatが始まったらこれを実行する。ここはmodul化した方がいいな。というか、action creatorかどっかに入れてmodule化する方がいい。
    const screenConstraint = {
      video: true,
      // {
      //   mediaSource: 'screen',
      //   // cursor: 'always'
      // },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        // sampleRate: 44100
      },
    };
    navigator.mediaDevices.getDisplayMedia(screenConstraint).then((screenStream) => {
      let mediaRecorder = new MediaRecorder(screenStream);
      // いや。違うわ。webcamを保存しても意味がない。必要なのは、screen の保存だよ。html fileの保存とでもいうべきか。それもmedia audio付きの。
      const chunks = [];
      mediaRecorder.start();
      mediaRecorder.ondataavailable = function (event) {
        chunks.push(event.data);
      };
      mediaRecorder.onstop = (event) => {
        let blob = new Blob(chunks, { type: 'video/mp4;' });
        // ここでmp4のdataが作られたらこれをmongoとs3に保存していくapi requestをすることだ。
        chunks = [];
        // ここからはapi requestだろう。今回の俺の場合はdatabase、s3に保存することだからね。
      };
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsMinimumTimePassed(true);
    }, 10 * 60 * 1000);
  }, []);

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
              <Button
                positive
                onClick={() =>
                  props.answerCallActionCreator(props.socket, props.myVideo, props.oppositeVideo, props.connectionRef)
                }
                style={{ width: '100%' }}
              >
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
              disabled={!isMinimumTimePassed}
              className='hang-up-button'
              onClick={() => props.onHangUpClick()}
            >
              Hang up
            </Button>
            <Button onClick={() => onActivateSubtitleClick()}>activate partners subtitle</Button>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, authState: state.authState };
};

export default connect(mapStateToProps, {
  answerCallActionCreator,
  sendVoiceTextActionCreator,
  getVoiceTextActionCreator,
})(FullScreen1on1Modal);
