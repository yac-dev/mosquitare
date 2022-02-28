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

  return (
    <>
      <div className='conversation-wrapper' onClick={(event) => onConversationClick(event)}>
        <div className='video-thumbnail'>
          <div className='conversation-video-wrapper'>
            <video className='thum' style={{ borderTopLeftRadius: '10px' }}>
              <source
                src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.calledUserMedia.videoFileName}`}
                // ref={videoRef1}
              />
            </video>
          </div>
          <div className='conversation-video-wrapper'>
            <video className='thum' style={{ borderTopRightRadius: '10px' }}>
              <source
                src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.recievedUserMedia.videoFileName}`}
                // ref={videoRef2}
              />
            </video>
          </div>
        </div>

        <div className='conversation-information'>
          conversation info here!!
          <p>{props.conversation.createdAt}</p>
          <p>Genre: {props.conversation.genre}</p>
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
