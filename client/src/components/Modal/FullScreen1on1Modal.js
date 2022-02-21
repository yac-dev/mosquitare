import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

// mui
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// components
import MediaRecorder from '../MediaRecord';
import VideosWrapper from '../VideosWrapper';
import VerticalTabsWrapper from '../VerticalTabsWrapper';
import AppsWrapper from '../ConversationApps/AppsWrapper';

// css
import '../../styles/1on1.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const FullScreen1on1Modal = (props) => {
  // これでも分かる通り、基本modalはdefaultでrenderされていることになるね。違うやり方だ。要は、このmodalがセットされたときに実行するって言うことをやりたいのよ。もう最初からこれ実行されている。
  const [open, setOpen] = useState(false);

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
          {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
              This is a success message!
            </Alert>
          </Snackbar> ここ後でいいか。*/}
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
