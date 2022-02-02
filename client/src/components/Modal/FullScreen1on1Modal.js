import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

// components
import MediaRecorder from '../MediaRecord';
import VideosWrapper from '../VideosWrapper';
import VerticalTabsWrapper from '../VerticalTabsWrapper';
import AppsWrapper from '../ConversationApps/AppsWrapper';

// css
import '../../styles/1on1.css';

const FullScreen1on1Modal = (props) => {
  // これでも分かる通り、基本modalはdefaultでrenderされていることになるね。違うやり方だ。要は、このmodalがセットされたときに実行するって言うことをやりたいのよ。もう最初からこれ実行されている。
  useEffect(() => {
    console.log('when mounted fullscreen');
  }, []);

  const screenRender = () => {
    if (props.mediaState.callAccepted) {
      return (
        <Modal
          show={props.show1on1}
          fullscreen={props.fullscreen1on1Modal}
          onHide={() => props.setShow1on1(false)}
          // style={{ backgroundColor: 'black' }}
        >
          <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
            <MediaRecorder />
            <VideosWrapper show1on1={props.show1on1} setShow1on1={props.setShow1on1} socket={props.socket} />
            <VerticalTabsWrapper socket={props.socket} />
            {/* <AppsWrapper /> */}
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  };

  return <>{screenRender()}</>;
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, authState: state.authState };
};

export default connect(mapStateToProps, {})(FullScreen1on1Modal);
