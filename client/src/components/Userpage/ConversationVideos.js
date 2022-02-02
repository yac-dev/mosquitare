import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import { loadMeActionCreator } from '../../actionCreators/authActionCreators';
// import { Link } from 'react-router-dom';

// components
import VideoDisplayingModal from './VideoDisplayingModal';

const ConversationVideos = (props) => {
  const [showVideoDisplayingModal, setShowVideoDisplayingModal] = useState(false);
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

  const handleClose = () => setShowVideoDisplayingModal(false);
  const handleShow = () => setShowVideoDisplayingModal(true);

  const onConversationClick = (event) => {
    event.preventDefault();
    console.log('conversation here!!');
    setShowVideoDisplayingModal(true);
    // ここを押したら、modal画面でvideoを再生できるようにする。面白いね。
  };

  const renderConversationList = () => {
    if (!props.authState.currentUser) {
      return null;
    } else {
      // controlなし。再生できないようにしている。あくまでthunmnailを見せることが目的。
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
                  />
                </video>
                <video style={{ borderTopRightRadius: '10px' }}>
                  <source
                    src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${conversation.recievedUserMedia.videoFileName}`}
                  />
                </video>
              </div>{' '}
              {/* ここ、二つ並べるようにする。*/}
              <div className='conversation-information'>
                information here!!
                <p>{conversation.createdAt}</p>
              </div>
            </div>
          </>
        );
      });

      // conversation list自体、gridで横に並べるようにしましょう。
      return <div className='conversation-list'>{conversationList}</div>;
    }
  };

  return (
    <>
      {renderConversationList()}
      <VideoDisplayingModal
        showVideoDisplayingModal={showVideoDisplayingModal}
        setShowVideoDisplayingModal={setShowVideoDisplayingModal}
      />
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps)(ConversationVideos);
