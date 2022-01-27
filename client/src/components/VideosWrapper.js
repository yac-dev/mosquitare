import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

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
import { updateUserConversationToFalseActionCreator } from '../actionCreators/authActionCreators';

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

  const onHangUpClick = () => {
    // 1, modalを閉じて
    // 2, callacceptedを閉じるっていう具合かね。callacceptedがfalseを引き金に、mediarecorderとspeechrecognitionも停止する。
    props.setShow1on1(false);
    props.hangUpCallActionCreator(connectionRef);
    props.updateUserConversationToFalseActionCreator();
  };

  return (
    <>
      <div></div>
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
          <Button
            negative
            // disabled={!isMinimumTimePassed}
            className='hang-up-button'
            circular
            icon='sign out'
            onClick={() => onHangUpClick()}
          ></Button>
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
  updateUserConversationToFalseActionCreator,
})(VideosWrapper);
