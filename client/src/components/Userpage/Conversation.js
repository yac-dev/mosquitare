import React, { useState } from 'react';

// components
import DisplayVideoModal from './DisplayVideoModal';

const Conversation = (props) => {
  const [showVideoDisplayingModal, setShowVideoDisplayingModal] = useState(false);

  const onConversationClick = (event) => {
    event.preventDefault();
    setShowVideoDisplayingModal(true);
    // どのvideoがclickされたか、event.targetとかで検知できないかね。そのurlのvideoをそのまま再生する的な感じでいいんだよな。
    // videoRef.current
    // videoRef2.current
  };

  const renderThumbnails = (userMedias) => {
    const thumbnails = userMedias.map((userMedia) => {
      return (
        <div className='conversation-video-wrapper'>
          <img
            className='thum'
            style={{ borderTopLeftRadius: '10px' }}
            src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${userMedia.thumbnail}`}
          />
        </div>
      );
    });

    return <div className='video-thumbnail'>{thumbnails}</div>;
  };

  return (
    <>
      <div className='conversation-wrapper' onClick={(event) => onConversationClick(event)}>
        {/* <div className='video-thumbnail'>
          <div className='conversation-video-wrapper'>
            <video className='thum' style={{ borderTopLeftRadius: '10px' }}>
              <source
                src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.calledUserMedia.videoFileName}`}
              />
            </video>
          </div>
          <div className='conversation-video-wrapper'>
            <video className='thum' style={{ borderTopRightRadius: '10px' }}>
              <source
                src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.recievedUserMedia.videoFileName}`}
              />
            </video>
          </div>
        </div> */}
        {renderThumbnails(props.conversation.userMedias)}

        <div className='conversation-information'>
          conversation info here!!
          <p>{props.conversation.createdAt}</p>
          {/* <p>Genre: {props.conversation.genre}</p> */}
          <p>Duration: {props.conversation.duration}</p>
        </div>
      </div>
      {/* modalの表示に関しては、ここでなくてもいい。 */}
      <DisplayVideoModal
        conversation={props.conversation}
        showVideoDisplayingModal={showVideoDisplayingModal}
        setShowVideoDisplayingModal={setShowVideoDisplayingModal}
      />
    </>
  );
};

export default Conversation;
