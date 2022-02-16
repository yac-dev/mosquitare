import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
// import { Button } from 'semantic-ui-react';

// mui
import TranslateIcon from '@mui/icons-material/Translate';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';

// call recieve側
import { answerCallActionCreator2 } from '../actionCreators/mediaActionCreator';
import { getConversationIdFromCalledUserActionCreator } from '../actionCreators/conversationActionCreators';
import { updateConversationRecievedUserActionCreator } from '../actionCreators/conversationActionCreators';

// call した側
import { completeConnectionWithMyPartnerActionCreator1 } from '../actionCreators/mediaActionCreator';
import { createConversationActionCreator } from '../actionCreators/conversationActionCreators';
import { sendConversationIdActionCreator } from '../actionCreators/conversationActionCreators';

// 共通
import { updateUserConversationStateActionCreator } from '../actionCreators/authActionCreators';
import { updateUserConversationsActionCreator } from '../actionCreators/authActionCreators';

// call 終わり
import { hangUpCallActionCreator } from '../actionCreators/mediaActionCreator';
import { disconnectCallActionCreator } from '../actionCreators/mediaActionCreator';
import { updateUserConversationToFalseActionCreator } from '../actionCreators/authActionCreators';

// styles for mui
const LogoutIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(255, 0, 0)',
  '&:hover': {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
}));

const SwitchLangIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(36, 106, 212)',
  '&:hover': {
    backgroundColor: 'rgba(17, 109, 247)',
  },
}));

const MicIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(36, 208, 145)',
  '&:hover': {
    backgroundColor: 'rgba(36, 208, 145,0.8)',
  },
}));

const VideosWrapper = (props) => {
  const myVideoRef = useRef();
  const oppositeVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (props.show1on1) {
      if (props.mediaState.amIRecieving) {
        props.answerCallActionCreator2(props.socket, myVideoRef, oppositeVideoRef, connectionRef).then(() => {
          return props.updateUserConversationStateActionCreator();
        });
      } else if (props.mediaState.amICalling) {
        props
          .completeConnectionWithMyPartnerActionCreator1(myVideoRef, oppositeVideoRef, connectionRef)
          .then(() => {
            return props.updateUserConversationStateActionCreator();
          })
          .then(() => {
            return props.createConversationActionCreator();
          })
          .then(() => {
            return props.sendConversationIdActionCreator(props.socket);
          })
          .then(() => {
            return props.updateUserConversationsActionCreator();
          });
      }
    }
  }, [props.show1on1]);

  // call受けた側で実行される。
  useEffect(() => {
    props
      .getConversationIdFromCalledUserActionCreator(props.socket)
      .then(() => {
        return props.updateUserConversationsActionCreator();
      })
      .then(() => {
        return props.updateConversationRecievedUserActionCreator();
      });
  }, []);

  useEffect(() => {
    if (props.mediaState.apiCallResult === 1) {
      props.hangUpCallActionCreator(); //これだけだと、下ですぐにmodalを閉じて、api callをさまたげることになる。
      props.setShow1on1(false);
      props.updateUserConversationToFalseActionCreator();
    }
  }, [props.mediaState.apiCallResult]); // これ、どういう目的で作った。。。？

  const onHangUpClick = () => {
    // 1, callacceptedを閉じるっていう具合かね。callacceptedがfalseを引き金に、mediarecorderとspeechrecognitionも停止する。
    // 2, modalを閉じる。
    // modalを閉じてからだと、そもそもsubtitleとmediaRecorder共に、useEffect効かんわ。まあ当然だな。callAcceptedを閉じてから、modalを閉じないとな。
    props.disconnectCallActionCreator(connectionRef);

    // そうか、そもそもcallAcceptedをfalseにした時点で、もうmodalが表示されないようになっているんだ。
    // props.setShow1on1(false);
    // props.updateUserConversationToFalseActionCreator();
  };

  return (
    <>
      {/* <div></div> */}
      <div className='videos-wrapper'>
        <video
          className='partner-video'
          playsInline
          ref={oppositeVideoRef}
          autoPlay
          style={{ width: '960px', height: '540px' }} // これだとなんで真ん中に寄ってくれるの？？
          // style={{ width: '400px', height: '500px' }}
        />
        <video
          className='myvideo'
          playsInline
          muted
          ref={myVideoRef}
          autoPlay
          style={{ width: '160px', height: '90px' }}
        />
        <div className='button-wrapper'>
          <Tooltip title='Disconnect call'>
            {/* <LogoutButton variant='contained' onClick={() => onHangUpClick()}>
              <LogoutIcon /> */}
            <LogoutIconButton>
              <LogoutIcon />
            </LogoutIconButton>
            {/* </LogoutButton> */}
          </Tooltip>
          <Tooltip title='Switch current language' variant='contained'>
            <SwitchLangIconButton sx={{ margin: '5px' }}>
              {/* {'lang'}&nbsp; */}
              {/* <SwitchRightIcon /> */}
              <TranslateIcon />
              {/* &nbsp;{'lang'} */}
            </SwitchLangIconButton>
          </Tooltip>
          <Tooltip title='Volume change' variant='contained'>
            <MicIconButton>
              {/* {'lang'}&nbsp; */}
              {/* <SwitchRightIcon /> */}
              <MicIcon />
              {/* &nbsp;{'lang'} */}
            </MicIconButton>
          </Tooltip>
          {/* <Button
            negative
            // disabled={!isMinimumTimePassed}
            className='hang-up-button'
            circular
            icon='sign out'
            onClick={() => onHangUpClick()}
          ></Button> */}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, {
  answerCallActionCreator2,
  getConversationIdFromCalledUserActionCreator,
  updateConversationRecievedUserActionCreator,
  completeConnectionWithMyPartnerActionCreator1,
  updateUserConversationStateActionCreator,
  createConversationActionCreator,
  sendConversationIdActionCreator,
  updateUserConversationsActionCreator,
  hangUpCallActionCreator,
  disconnectCallActionCreator,
  updateUserConversationToFalseActionCreator,
})(VideosWrapper);
