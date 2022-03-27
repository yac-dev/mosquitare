import React, { useState } from 'react';

// mui
import LanguageIcon from '@mui/icons-material/Language';

// components
import DisplayVideoModal from './DisplayVideoModal';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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

  const renderPeople = (users) => {
    return (
      <h2>
        {users[0].name} &amp; {users[1].name}
      </h2>
    );
  };

  const renderGenre = (genre) => {
    return (
      <p style={{ margin: '0px' }}>
        <LanguageIcon />
        &nbsp;{genre[0].name} &amp; {genre[1].name}
      </p>
    );
  };

  const renderDuration = (duration) => {
    let converted;
    let minutes;
    let seconds;
    if (duration >= 60) {
      minutes = Math.floort(duration / 60);
      seconds = Math.floor(duration % 60);
      if (seconds < 9) {
        return (
          <>
            <AccessTimeIcon />
            &nbsp;<span>{minutes}</span>
            <span>&#58;</span>0{seconds}
          </>
        );
      } else {
        return (
          <>
            <AccessTimeIcon />
            &nbsp;<span>{minutes}</span>
            <span>&#58;</span>
            <span>{seconds}</span>
          </>
        );
      }
    } else {
      minutes = 0;
      seconds = duration;
      if (seconds < 9) {
        return (
          <>
            <AccessTimeIcon />
            &nbsp;<span>{minutes}</span>
            <span>&#58;</span>0{seconds}
          </>
        );
      } else {
        return (
          <>
            <AccessTimeIcon />
            &nbsp;<span>{minutes}</span>
            <span>&#58;</span>
            <span>{seconds}</span>
          </>
        );
      }
    }
  };

  const renderISODateToString = (ISODate) => {
    const converted = new Date(ISODate).toISOString().substring(0, 10);
    return (
      <>
        <p>
          <CalendarTodayIcon />
          &nbsp;{converted}
        </p>
      </>
    );
  };

  const renderPublic = () => {
    return (
      <>
        <PublicIcon /> &nbsp;Public
      </>
    );
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
        {/* {renderThumbnails(props.conversation.userMedias)} */}
        <video style={{ width: '100%', borderRadius: '10px' }}>
          <source
            src={`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${props.conversation.videoFilename}`}
          />
        </video>
        <div className='conversation-information'>
          {renderPeople(props.conversation.users)}
          {renderGenre(props.conversation.genre)}
          {renderDuration(props.conversation.duration)}
          {renderISODateToString(props.conversation.createdAt)}
          {/* {renderPublic()} */}
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
