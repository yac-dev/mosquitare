import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

// "build:production-aws-test": "env-cmd -f ./config/.env.production-aws-test react-scripts build",
// mui
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';

// components
import MediaRecorder from '../MediaRecord';
import VideosWrapper from '../VideosWrapper';
import Chat from '../Chat';
import SubtitleWrapper from './SubtitleWrapper';
import LanguageStatus from '../LanguageStatus';
import LanguageStatusAndTranscript from './LanguageStatusAndTranscript';
import DocEditor from '../DocEditor';
import PartnerUserInfo from '../PartnerUserInfo';
import MyClock from '../MyClock';
// import VerticalTabsWrapper from '../VerticalTabsWrapper';
import AppsWrapper from '../ConversationApps/AppsWrapper';
// components
import SnackBar from '../Snackbar';

// css
import '../../styles/1on1.css';

//ac
import { callWasCanceldActionCreator } from '../../actionCreators/mediaActionCreator';
import { recieveCanceledCallActionCreator } from '../../actionCreators/mediaActionCreator';

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
  const [openLanguageStatus, setOpenLanguageStatus] = useState(false);
  const [openLanguageStatusAndTranscript, setOpenLanguageStatusAndTranscript] = useState(false);
  const [openDoc, setOpenDoc] = useState(false);
  const [openPartnerUserInfo, setOpenPartnerUserInfo] = useState(false);
  const [showCanceledModal, setShowCanceledModal] = useState(false);

  // useEffect(() => {
  //   // 少なくとも、ここのcomponentでは、refをもたない。refを持つのはfulscreenの方だからね。
  //   props.myCallIsAcceptedActionCreator(props.socket, props.setShowCallingModal);
  // }, []);

  useEffect(() => {
    props.recieveCanceledCallActionCreator(props.socket);
  }, []);

  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <SnackBar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
  };

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

  useEffect(() => {
    return () => {
      // logutのapi callをここで実施するようにしましょう。
    };
  }, []);

  // useEffect(() => {
  //   props.socket.on('OOPS_CALLER_CANCELED_THE_CALL', () => {
  //     props.callWasCanceldActionCreator();
  //     props.setShow1on1(false);
  //     setShowCanceledModal(true);
  //   });
  // }, []);

  const renderCanceled = () => {
    if (props.mediaState.callCanceled) {
      const reloadPage = setTimeout(() => {
        window.location = '/';
      }, 3000);
      reloadPage();
      return (
        <div style={{ backgroundColor: 'red' }}>
          OOPS! Your partner disconnected accidently... Reloading this page immidiatelly.
        </div>
      );
    }
  };

  const renderModalBody = () => {
    if (props.mediaState.callAccepted) {
      return (
        <>
          <VideosWrapper
            show1on1={props.show1on1}
            setShow1on1={props.setShow1on1}
            socket={props.socket}
            // setOpenChatComponent={setOpenChatComponent}
            // setOpenTranscriptComponent={setOpenTranscriptComponent}
            // setOpenLanguageStatus={setOpenLanguageStatus}
            setOpenLanguageStatusAndTranscript={setOpenLanguageStatusAndTranscript}
            setOpenDoc={setOpenDoc}
            setOpenPartnerUserInfo={setOpenPartnerUserInfo}
            setShowRatingModal={props.setShowRatingModal}
          />
          {/* <MediaRecorder />
          <LanguageStatusAndTranscript
            socket={props.socket}
            countLearningLangLength={countLearningLangLength}
            countNativeLangLength={countNativeLangLength}
            setCountLearningLangLength={setCountLearningLangLength}
            setCountNativeLangLength={setCountNativeLangLength}
            setOpenLanguageStatusAndTranscript={setOpenLanguageStatusAndTranscript}
            openLanguageStatusAndTranscript={openLanguageStatusAndTranscript}
          />
          <DocEditor socket={props.socket} openDoc={openDoc} setOpenDoc={setOpenDoc} /> */}
          <PartnerUserInfo openPartnerUserInfo={openPartnerUserInfo} setOpenPartnerUserInfo={setOpenPartnerUserInfo} />
          {renderCanceled()}
        </>
      );
    }
  };

  // callAcceptedの時だけ、これをrenderするっていう感じだ。
  const screenRender = () => {
    // if (props.mediaState.callAccepted) {
    if (!props.mediaState.callCanceled) {
      return (
        <>
          <Modal
            show={props.show1on1}
            fullscreen={props.fullscreen1on1Modal}
            onHide={() => props.setShow1on1(false)}
            // style={{ backgroundColor: 'black' }}
          >
            {/* 単純に、propsでstyling用のwidthをvideos wrapperとverticalTabsWrapperそれぞれに渡せばいいや。*/}
            <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
              {renderModalBody()}
              <MediaRecorder />
              <LanguageStatusAndTranscript
                socket={props.socket}
                countLearningLangLength={countLearningLangLength}
                countNativeLangLength={countNativeLangLength}
                setCountLearningLangLength={setCountLearningLangLength}
                setCountNativeLangLength={setCountNativeLangLength}
                setOpenLanguageStatusAndTranscript={setOpenLanguageStatusAndTranscript}
                openLanguageStatusAndTranscript={openLanguageStatusAndTranscript}
              />
              <DocEditor socket={props.socket} openDoc={openDoc} setOpenDoc={setOpenDoc} />
            </Modal.Body>

            {/* <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
              <MediaRecorder />
              <VideosWrapper
                show1on1={props.show1on1}
                setShow1on1={props.setShow1on1}
                socket={props.socket}
                // setOpenChatComponent={setOpenChatComponent}
                // setOpenTranscriptComponent={setOpenTranscriptComponent}
                // setOpenLanguageStatus={setOpenLanguageStatus}
                setOpenLanguageStatusAndTranscript={setOpenLanguageStatusAndTranscript}
                setOpenDoc={setOpenDoc}
                setOpenPartnerUserInfo={setOpenPartnerUserInfo}
                setShowAfterFinishingModal={props.setShowAfterFinishingModal}
              />
              <LanguageStatusAndTranscript
                socket={props.socket}
                countLearningLangLength={countLearningLangLength}
                countNativeLangLength={countNativeLangLength}
                setCountLearningLangLength={setCountLearningLangLength}
                setCountNativeLangLength={setCountNativeLangLength}
                setOpenLanguageStatusAndTranscript={setOpenLanguageStatusAndTranscript}
                openLanguageStatusAndTranscript={openLanguageStatusAndTranscript}
              />
              <DocEditor socket={props.socket} openDoc={openDoc} setOpenDoc={setOpenDoc} />
              <PartnerUserInfo
                openPartnerUserInfo={openPartnerUserInfo}
                setOpenPartnerUserInfo={setOpenPartnerUserInfo}
              /> */}
            {/* <Chat
                socket={props.socket}
                openChatComponent={openChatComponent}
                setOpenChatComponent={setOpenChatComponent}
              /> */}
            {/* <SubtitleWrapper
                socket={props.socket}
                openTranscriptComponent={openTranscriptComponent}
                setOpenTranscriptComponent={setOpenTranscriptComponent}
                setCountLearningLangLength={setCountLearningLangLength}
                setCountNativeLangLength={setCountNativeLangLength}
              /> */}
            {/* <LanguageStatus
                socket={props.socket}
                countLearningLangLength={countLearningLangLength}
                countNativeLangLength={countNativeLangLength}
                openLanguageStatus={openLanguageStatus}
                setOpenLanguageStatus={setOpenLanguageStatus}
              /> */}
            {/* <AppsWrapper /> */}
            {/* </Modal.Body> */}
          </Modal>
        </>
        // <>
        //   <Desktop>
        //     <Modal
        //       show={props.show1on1}
        //       fullscreen={props.fullscreen1on1Modal}
        //       onHide={() => props.setShow1on1(false)}
        //       // style={{ backgroundColor: 'black' }}
        //     >
        //       {/* 単純に、propsでstyling用のwidthをvideos wrapperとverticalTabsWrapperそれぞれに渡せばいいや。*/}
        //       <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
        //         <MediaRecorder />
        //         {/* <MyClock /> */}
        //         <VideosWrapper
        //           show1on1={props.show1on1}
        //           setShow1on1={props.setShow1on1}
        //           socket={props.socket}
        //           setOpenChatComponent={setOpenChatComponent}
        //           setOpenTranscriptComponent={setOpenTranscriptComponent}
        //           setOpenLanguageStatus={setOpenLanguageStatus}
        //         />
        //         <Chat
        //           socket={props.socket}
        //           openChatComponent={openChatComponent}
        //           setOpenChatComponent={setOpenChatComponent}
        //         />
        //         <SubtitleWrapper
        //           socket={props.socket}
        //           openTranscriptComponent={openTranscriptComponent}
        //           setOpenTranscriptComponent={setOpenTranscriptComponent}
        //           setCountLearningLangLength={setCountLearningLangLength}
        //           setCountNativeLangLength={setCountNativeLangLength}
        //         />
        //         <LanguageStatus
        //           countLearningLangLength={countLearningLangLength}
        //           countNativeLangLength={countNativeLangLength}
        //           openLanguageStatus={openLanguageStatus}
        //           setOpenLanguageStatus={setOpenLanguageStatus}
        //         />
        //         {/* <AppsWrapper /> */}
        //       </Modal.Body>
        //     </Modal>
        //   </Desktop>

        //   <Tablet>
        //     <Modal
        //       show={props.show1on1}
        //       fullscreen={props.fullscreen1on1Modal}
        //       onHide={() => props.setShow1on1(false)}
        //       // style={{ backgroundColor: 'black' }}
        //     >
        //       <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
        //         {/* <MediaRecorder /> */}
        //         <VideosWrapper show1on1={props.show1on1} setShow1on1={props.setShow1on1} socket={props.socket} />
        //         {/* <VerticalTabsWrapper socket={props.socket} /> */}
        //         {/* <AppsWrapper /> */}
        //       </Modal.Body>
        //     </Modal>
        //   </Tablet>

        //   <Mobile>
        //     <Modal
        //       show={props.show1on1}
        //       fullscreen={props.fullscreen1on1Modal}
        //       onHide={() => props.setShow1on1(false)}
        //       // style={{ backgroundColor: 'black' }}
        //     >
        //       <Modal.Body bsPrefix='fullscreen1on1-modal-body'>
        //         {/* <MediaRecorder /> */}
        //         <VideosWrapper show1on1={props.show1on1} setShow1on1={props.setShow1on1} socket={props.socket} />
        //         {/* <VerticalTabsWrapper socket={props.socket} /> */}
        //         {/* <AppsWrapper /> */}
        //       </Modal.Body>
        //     </Modal>
        //   </Mobile>
        // </>
      );
    } else {
      // ここで、OOPSで'your partner canceled the call'のmodalを出して、閉じるボタンを出してpage reloadさせてあげる。
      return (
        <>
          <Modal show={showCanceledModal} backdrop='static' keyboard={false}>
            <Modal.Body bsPrefix='calling-modal-body'>
              <div style={{ color: 'black' }}>OOPS... Your partner canceled this call.</div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='contained'
                onClick={() => {
                  setShowCanceledModal(false);
                  window.location = '/worldmap'; // まあこれでいいのかね。
                }}
              >
                Finish this call
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    // } else {
    //   return null;
    // }
  };

  return <>{screenRender()}</>;
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, authState: state.authState, alertsState: state.alertsState };
};

export default connect(mapStateToProps, { callWasCanceldActionCreator, recieveCanceledCallActionCreator })(
  FullScreen1on1Modal
);
