import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

// mui
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// components
import MediaRecorder from '../MediaRecord';
import VideosWrapper from '../VideosWrapper';
import Chat from '../Chat';
import SubtitleWrapper from './SubtitleWrapper';
import MyClock from '../MyClock';
// import VerticalTabsWrapper from '../VerticalTabsWrapper';
import AppsWrapper from '../ConversationApps/AppsWrapper';

// css
import '../../styles/1on1.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ minWidth: 320, maxWidth: 767 });
  return isMobile ? children : null;
};

// const Default = ({ children }) => {
//   const isNotMobile = useMediaQuery({ minWidth: 768 });
//   return isNotMobile ? children : null;
// };

const FullScreen1on1Modal = (props) => {
  // これでも分かる通り、基本modalはdefaultでrenderされていることになるね。違うやり方だ。要は、このmodalがセットされたときに実行するって言うことをやりたいのよ。もう最初からこれ実行されている。
  const [open, setOpen] = useState(false);
  const [countLearningLangLength, setCountLearningLangLength] = useState(0);
  const [countNativeLangLength, setCountNativeLangLength] = useState(0);
  const [openChatComponent, setOpenChatComponent] = useState(false);
  const [openTranscriptComponent, setOpenTranscriptComponent] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    console.log('when mounted fullscreen');
  }, []);

  const screenRender = () => {
    if (props.mediaState.callAccepted) {
      return (
        <>
          <Desktop>
            <Modal
              show={props.show1on1}
              fullscreen={props.fullscreen1on1Modal}
              onHide={() => props.setShow1on1(false)}
              // style={{ backgroundColor: 'black' }}
            >
              {/* 単純に、propsでstyling用のwidthをvideos wrapperとverticalTabsWrapperそれぞれに渡せばいいや。*/}
              <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
                <MediaRecorder />
                <MyClock />
                <VideosWrapper
                  show1on1={props.show1on1}
                  setShow1on1={props.setShow1on1}
                  socket={props.socket}
                  setOpenChatComponent={setOpenChatComponent}
                  setOpenTranscriptComponent={setOpenTranscriptComponent}
                />
                <Chat
                  socket={props.socket}
                  openChatComponent={openChatComponent}
                  setOpenChatComponent={setOpenChatComponent}
                />
                <SubtitleWrapper
                  socket={props.socket}
                  openTranscriptComponent={openTranscriptComponent}
                  setOpenTranscriptComponent={setOpenTranscriptComponent}
                  setCountLearningLangLength={setCountLearningLangLength}
                  setCountNativeLangLength={setCountNativeLangLength}
                />
                {/* <AppsWrapper /> */}
              </Modal.Body>
            </Modal>
          </Desktop>

          <Tablet>
            <Modal
              show={props.show1on1}
              fullscreen={props.fullscreen1on1Modal}
              onHide={() => props.setShow1on1(false)}
              // style={{ backgroundColor: 'black' }}
            >
              <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
                {/* <MediaRecorder /> */}
                <VideosWrapper show1on1={props.show1on1} setShow1on1={props.setShow1on1} socket={props.socket} />
                {/* <VerticalTabsWrapper socket={props.socket} /> */}
                {/* <AppsWrapper /> */}
              </Modal.Body>
            </Modal>
          </Tablet>

          <Mobile>
            <Modal
              show={props.show1on1}
              fullscreen={props.fullscreen1on1Modal}
              onHide={() => props.setShow1on1(false)}
              // style={{ backgroundColor: 'black' }}
            >
              <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
                {/* <MediaRecorder /> */}
                <VideosWrapper show1on1={props.show1on1} setShow1on1={props.setShow1on1} socket={props.socket} />
                {/* <VerticalTabsWrapper socket={props.socket} /> */}
                {/* <AppsWrapper /> */}
              </Modal.Body>
            </Modal>
          </Mobile>
        </>
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
