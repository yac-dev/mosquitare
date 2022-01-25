import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { answerCallActionCreator2 } from '../actionCreators/mediaActionCreator';
import { completeConnectionWithMyPartnerActionCreator1 } from '../actionCreators/mediaActionCreator';

const VideosWrapper = (props) => {
  const myVideoRef = useRef(); // ここの部分は、if文でrenderするようにしようか。
  const oppositeVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (props.show1on1) {
      if (props.mediaState.amIRecieving) {
        props.answerCallActionCreator2(props.socket, myVideoRef, oppositeVideoRef, connectionRef);
        console.log('useEffect of fullscreen');
      } else if (props.mediaState.amICalling) {
        props.completeConnectionWithMyPartnerActionCreator1(myVideoRef, oppositeVideoRef, connectionRef);
      }
    }
  }, [props.show1on1]);

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
            onClick={() => props.onHangUpClick()} // ここで、recorderのstopがかかって、onstopのeventが動くようになる。
          ></Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, { answerCallActionCreator2, completeConnectionWithMyPartnerActionCreator1 })(
  VideosWrapper
);
