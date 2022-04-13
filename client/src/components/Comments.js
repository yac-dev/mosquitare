import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button, Form, TextArea } from 'semantic-ui-react';
// mui
import { styled } from '@mui/system';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CreateIcon from '@mui/icons-material/Create';
import SortIcon from '@mui/icons-material/Sort';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Icon, Input } from 'semantic-ui-react';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Popover from '@mui/material/Popover';
import CommentIcon from '@mui/icons-material/Comment';
import Badge from '@mui/material/Badge';
import ReplyIcon from '@mui/icons-material/Reply';
// css
import '../styles/comments.css';

// ac
import { createCommentActionCreator } from '../actionCreators/commentsActionCreator';
import { getConversationCommentsActionCreator } from '../actionCreators/commentsActionCreator';
import { alertActionCreator } from '../actionCreators/alertsActionCreator';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 17,
  height: 17,
  // border: `2px solid ${theme.palette.background.paper}`,
}));

const myStyle = {
  '& .MuiInputBase-input': {
    // color: '#000000', // 入力文字の色
    color: 'white', // 入力文字の色
  },
  '& label': {
    // color: '#AAAAAA', // 通常時のラベル色
    color: 'white', // 通常時のラベル色
  },
  '& .MuiInput-underline:before': {
    // borderBottomColor: '#CCCCCC', // 通常時のボーダー色
    borderBottomColor: 'white', // 通常時のボーダー色
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    // borderBottomColor: '#DDDDDD', // ホバー時のボーダー色
    borderBottomColor: 'white', // ホバー時のボーダー色
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      // borderColor: '#CCCCCC', // 通常時のボーダー色(アウトライン)
      borderColor: 'white', // 通常時のボーダー色(アウトライン)
    },
    '&:hover fieldset': {
      // borderColor: '#DDDDDD', // ホバー時のボーダー色(アウトライン)
      borderColor: 'white', // ホバー時のボーダー色(アウトライン)
    },
  },
};

const MyTextField = styled(TextField)(myStyle);

const Comments = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    props.getConversationCommentsActionCreator();
  }, []);

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const renderNationalities = (nationalities) => {
    const nationalitiesList = nationalities.map((nationality) => {
      return (
        <>
          <span className='small-flag'>
            <img src={nationality.flagPics[0]} style={{ width: '15px', height: '10px' }} />
          </span>
          &nbsp;
          <span className='small-flag' style={{ width: '10px', height: '10px' }}>
            <img src={nationality.flagPics[0]} style={{ width: '15px', height: '10px' }} />
          </span>
          &nbsp;
          <span className='small-flag' style={{ width: '10px', height: '10px' }}>
            <img src={nationality.flagPics[0]} style={{ width: '15px', height: '10px' }} />
          </span>
        </>
      );
    });
    return <>{nationalitiesList}</>;
  };

  const renderComments = () => {
    if (props.commentsState.length) {
      const commentsList = props.commentsState.map((comment) => {
        return (
          <>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={<SmallAvatar src={comment.user.nationalities[0].flagPics[0]} />}
                >
                  {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
                  <Avatar sx={{ cursor: 'pointer' }}>{comment.user.name}</Avatar>
                  {/* <Avatar sx={{ cursor: 'pointer' }} alt={`${comment.user.name}`} /> */}
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      {comment.user.name}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      {comment.content}
                    </Typography>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      {comment.createdAt}
                    </Typography>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      <Tooltip title='Reply (Under construction 🚜🛠 Please wait for a bit.)'>
                        <ReplyIcon sx={{ fontSize: '17px', cursor: 'pointer' }} />
                      </Tooltip>
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant='inset' component='li' />
          </>
        );
      });

      return (
        <>
          <List>{commentsList}</List>
        </>
      );
    } else {
      return <div style={{ color: 'black' }}>No comments yet. Write a message or feedback if you have!</div>;
    }
  };

  const handleSendComment = (content) => {
    if (content && props.authState.currentUser) {
      props.createCommentActionCreator(content);
      setContent('');
    } else if (!props.authState.currentUser) {
      props.alertActionCreator('You need to signup or login to comment.', 'error');
    } else if (!content) {
      // alertかな。
      props.alertActionCreator('Please write a comment.', 'error');
    }
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.fa-close, .comments-app-menu, .comments'>
      <div className={`comments-component ${props.openComments ? undefined : 'hidden'}`}>
        <div className='comments-wrapper' style={{ display: 'flex', height: '10%' }}>
          <div className='comments-header' style={{ flex: 4 }}>
            {/* <div className='comments-close-button' onClick={() => props.setOpenComments(false)}> */}
            <i
              className='fa fa-close'
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => props.setOpenComments(false)}
            ></i>
            {/* </div> */}
            <p style={{ fontSize: '20px' }}>
              Comments&nbsp;
              <CommentIcon />
            </p>
          </div>
          <div className='comments-app-menu' style={{ display: 'flex', flex: 2, alignItems: 'center', gap: '30px' }}>
            <Tooltip title='Write a comment'>
              {/* <IconButton > */}
              <CreateIcon sx={{ cursor: 'pointer' }} onClick={handleClick} />
              {/* </IconButton> */}
            </Tooltip>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {/* dummyのdivを作っておく。*/}
              <div style={{ width: '300px', height: '100%', padding: '5px' }}>
                <TextField
                  id='input-with-icon-textfield'
                  label='Write a comment'
                  multiline
                  fullWidth
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Tooltip title='Send'>
                          <IconButton onClick={() => handleSendComment(content)}>
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  variant='standard'
                />
              </div>
            </Popover>

            <Tooltip title='Write a feedback'>
              {/* <IconButton> */}
              <FeedbackIcon sx={{ cursor: 'pointer' }} />
              {/* </IconButton> */}
            </Tooltip>
            <Tooltip title='Sort'>
              {/* <IconButton> */}
              <SortIcon sx={{ cursor: 'pointer' }} />
              {/* </IconButton> */}
            </Tooltip>
          </div>
        </div>

        <div
          className='comments'
          style={{
            height: '90%',
            backgroundColor: 'rgb(232, 232, 232)',
            overflow: 'auto',
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
            cursor: 'auto',
          }}
        >
          {renderComments()}
        </div>
        {/* <div className='input-and-send'>
          <Input
            icon={<Icon name='edit' style={{ cursor: 'pointer' }} />}
            placeholder='Add a message or feedback...'
            // onChange={(event) => setInputText(event.target.value)}
            // onKeyDown={(event) => sendChatByKeyDownEnter(event)}
            style={{ width: '100%', height: '100%' }}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <button onClick={() => handleSendComment(content)}>Send Message</button> */}
      </div>
    </Draggable>
  );
};

// まあ、基本はこのconversationIdに関連したcommentだけを引っ張ってくる感じよ。mapStateToPropsで。
const mapStateToProps = (state) => {
  return {
    conversationState: state.conversationState,
    commentsState: Object.values(state.commentsState),
    authState: state.authState,
  };
};

export default connect(mapStateToProps, {
  createCommentActionCreator,
  getConversationCommentsActionCreator,
  alertActionCreator,
})(Comments);
