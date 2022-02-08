import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect } from 'react-redux';
// import { loadMeActionCreator } from '../../actionCreators/authActionCreators';
// import { Link } from 'react-router-dom';

// components
import DisplayVideoModal from './DisplayVideoModal';

// context
import VideoContext from './contexts/VideoContext';

const ConversationVideos = (props) => {
  const [showVideoDisplayingModal, setShowVideoDisplayingModal] = useState(false);
  const videoRef1 = useRef();
  const videoRef2 = useRef();

  useEffect(() => {}, []);
  // const test = () => {
  //   if (!props.authState.currentUser) {
  //     return null;
  //   } else {
  //     const conversationList = props.authState.currentUser.conversations.map((conversation) => {
  //       // それぞれのconversation (conversationね)のidを使ってconversationのobjectをとって、そっからcalled userとrecieved userのusermediaを取るようにすればいい感じかね。videoを表示するだけでいい。っていうかthumbnailの表示もできるかもな。
  //       // arrayのそれぞれの要素
  //       return (
  //         <Link to={`/uservideo/${props.authState.currentUser._id}/${conversation._id}`}>{conversation.createdAt}</Link>
  //       );
  //     });
  //     return <div>{conversationList}</div>;
  //   }
  // };

  const onConversationClick = (event) => {
    event.preventDefault();
    setShowVideoDisplayingModal(true);
    // どのvideoがclickされたか、event.targetとかで検知できないかね。そのurlのvideoをそのまま再生する的な感じでいいんだよな。
    // videoRef.current
    // videoRef2.current
  };

  const renderConversationList = () => {
    if (!props.authState.currentUser) {
      return null;
    } else {
      const conversationList = props.authState.currentUser.conversations.map((conversation) => {
        return (
          <>
            <div
              className='conversation-wrapper'
              style={{ cursor: 'pointer' }}
              onClick={(event) => onConversationClick(event)}
            >
              <div className='video-thumbnail'>
                <video style={{ borderTopLeftRadius: '10px' }}>
                  <source
                    src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${conversation.calledUserMedia.videoFileName}`}
                    ref={videoRef1}
                  />
                </video>
                <video style={{ borderTopRightRadius: '10px' }}>
                  <source
                    src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${conversation.recievedUserMedia.videoFileName}`}
                    ref={videoRef2}
                  />
                </video>
              </div>
              <div className='conversation-information'>
                information here!!
                <p>{conversation.createdAt}</p>
              </div>
            </div>
          </>
        );
      });
      return <div className='conversation-list'>{conversationList}</div>;
    }
  };

  return (
    <>
      {renderConversationList()}
      <VideoContext.Provider value={{ videoRef1: videoRef1.current, videoRef2: videoRef2.current }}>
        <DisplayVideoModal
          showVideoDisplayingModal={showVideoDisplayingModal}
          setShowVideoDisplayingModal={setShowVideoDisplayingModal}
          // videoRef1={videoRef1.current}
          // videoRef2={videoRef2.current}
        />
      </VideoContext.Provider>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps)(ConversationVideos);