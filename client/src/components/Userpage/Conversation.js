import React, { useState } from 'react';
import { connect } from 'react-redux';

// mui
import LanguageIcon from '@mui/icons-material/Language';

// components
import DisplayVideoModal from './DisplayVideoModal';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
// ac
import { selectConversation } from '../../actionCreators/conversationActionCreators';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 17,
  height: 17,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

const Conversation = (props) => {
  const [showVideoDisplayingModal, setShowVideoDisplayingModal] = useState(false);

  // const onConversationClick = (event, conversation) => {
  //   event.preventDefault();
  //   props.selectConversation(conversation);
  //   setShowVideoDisplayingModal(true);
  // };

  const onConversationClickNew = (event) => {
    // windowかなここは。props.conversation._idを使って。
    window.location = `/myconversation/${props.conversation._id}`;
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
      <>
        <div style={{ flex: 1, display: 'flex', gap: '5px', alignItems: 'center' }}>
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<SmallAvatar src={users[0].nationalities[0].flagPics[0]} />}
          >
            {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
            <Avatar sx={{ cursor: 'pointer' }}>{users[0].name}</Avatar>
          </Badge>

          <span>{users[0].name}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: '5px', alignItems: 'center' }}>
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<SmallAvatar src={users[1].nationalities[0].flagPics[0]} />}
          >
            {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
            <Avatar sx={{ cursor: 'pointer' }}>{users[1].name}</Avatar>
          </Badge>

          {users[1].name}
        </div>
      </>
    );
  };

  const renderGenre = (genre) => {
    return (
      <>
        {/* <LanguageIcon /> */}
        Exchanged&nbsp;{genre[0].name} &amp; {genre[1].name}
      </>
    );
  };

  const renderDuration = (duration) => {
    let converted;
    let minutes;
    let seconds;
    if (duration >= 60) {
      minutes = Math.floor(duration / 60);
      seconds = Math.floor(duration % 60);
      if (seconds < 9) {
        return (
          <>
            &nbsp;<span>{minutes}</span>
            <span>&#58;</span>0{seconds}
          </>
        );
      } else {
        return (
          <>
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
            &nbsp;<span>{minutes}</span>
            <span>&#58;</span>0{seconds}
          </>
        );
      } else {
        return (
          <>
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
      <div className='conversation-wrapper'>
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={(event) => onConversationClickNew(event, props.conversation)}
        >
          <video style={{ width: '100%' }}>
            <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.conversation.videoFilename}`} />
          </video>
          <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
            {renderDuration(props.conversation.duration)}
          </div>
        </div>
        <div className='conversation-information'>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {renderPeople(props.conversation.users)}
          </div>
          <div className='thumbnai-genre' style={{ marginBottom: '20px' }}>
            {renderGenre(props.conversation.genre)}
          </div>

          <div className='conversation-stats' style={{ display: 'flex' }}>
            <div className='conversation-good-and-comment' style={{ flex: 5 }}>
              <div className='icon-wrapper' style={{ display: 'flex', gap: '10px' }}>
                <div>
                  <VisibilityIcon />
                  1k
                </div>
                <div>
                  <ThumbUpAltIcon />
                  10
                </div>
                <div>
                  <CommentIcon />
                  10
                </div>
              </div>
            </div>
            <div className='video-date' style={{ flex: 5 }}>
              {renderISODateToString(props.conversation.createdAt)}
            </div>
          </div>

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

export default connect(null, { selectConversation })(Conversation);
