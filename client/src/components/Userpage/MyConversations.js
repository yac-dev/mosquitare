import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect } from 'react-redux';
// import { loadMeActionCreator } from '../../actionCreators/authActionCreators';
// import { Link } from 'react-router-dom';

// components
import DisplayVideoModal from './DisplayVideoModal';
import Conversation from './Conversation';

// context
import VideoContext from './contexts/VideoContext';

//css
import '../../styles/myConversations.css';

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

  // conversation一つ一つに関して、componentを作る必要があるわ。作り直そう。
  const renderConversationList = () => {
    if (!props.authState.currentUser) {
      return null;
    } else {
      const conversationList = props.myConversations.map((myConversation) => {
        return (
          <>
            <Conversation conversation={myConversation} />
          </>
        );
      });
      return (
        // <div className='conversation-list'>{conversationList}</div>
        <>{conversationList}</>
      );
    }
  };

  return (
    <>
      <div className='my-conversations'>{renderConversationList()}</div>
      {/* <VideoContext.Provider value={{ videoRef1: videoRef1.current, videoRef2: videoRef2.current }}>
        <DisplayVideoModal
          showVideoDisplayingModal={showVideoDisplayingModal}
          setShowVideoDisplayingModal={setShowVideoDisplayingModal}
        />
      </VideoContext.Provider> */}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps)(ConversationVideos);
