import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// mui
import { styled } from '@mui/system';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import CreateIcon from '@mui/icons-material/Create';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment } from '@mui/material';
import { Icon, Input } from 'semantic-ui-react';

// css
import '../styles/comments.css';

// ac
import { createCommentActionCreator } from '../actionCreators/commentsActionCreator';
import { connect } from 'react-redux';

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
  const [value, setValue] = React.useState('Controlled');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const renderComments = (comments) => {
    // if (comments) {
    //   const commentsList = comments.map((comment) => {
    //     return (
    //       <ListItem alignItems='flex-start'>
    //         <ListItemAvatar>
    //           <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
    //         </ListItemAvatar>
    //         <ListItemText
    //           primary='Brunch this weekend?'
    //           secondary={
    //             <React.Fragment>
    //               <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
    //                 Ali Connors
    //               </Typography>
    //               {" — I'll be in your neighborhood doing errands this…"}
    //             </React.Fragment>
    //           }
    //         />
    //       </ListItem>
    //     );
    //   });

    //   return <>{commentsList}</>;
    // } else {
    //   return <div>No comments yet. Send a message or feedback if you have!!!</div>;
    // }

    return (
      <>
        <div
          style={{
            width: '100%',
            height: '450px',
            backgroundColor: 'red',
            overflow: 'auto',
            borderRadius: '10px',
          }}
        >
          <List>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary='Brunch this weekend?'
                secondary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            {/* <Divider variant='inset' component='li' /> */}
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary='Summer BBQ'
                secondary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                      to Scott, Alex, Jennifer
                    </Typography>
                    {" — Wish I could come, but I'm out of town this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            {/* <Divider variant='inset' component='li' /> */}
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt='Cindy Baker' src='/static/images/avatar/3.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary='Oui Oui'
                secondary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                      Sandra Adams
                    </Typography>
                    {' — Do you have Paris recommendations? Have you ever…'}
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary='Brunch this weekend?'
                secondary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary='Brunch this weekend?'
                secondary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary='Brunch this weekend?'
                secondary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component='span' variant='body2' color='text.primary'>
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
        </div>
      </>
    );
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.comment-close-btn'>
      <div className={`comments-component ${props.openComments ? undefined : 'hidden'}`}>
        <div className='comments-header'>
          <p>Comments</p>
          <div className='comments-close-button' onClick={() => props.setOpenComments(false)}>
            <i className='fa fa-close' style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}></i>
          </div>
        </div>
        <div className='comments'>{renderComments()}</div>
        <div className='input-and-send'>
          <Input
            icon={<Icon name='edit' style={{ cursor: 'pointer' }} />}
            placeholder='Add a message or feedback...'
            // onChange={(event) => setInputText(event.target.value)}
            // onKeyDown={(event) => sendChatByKeyDownEnter(event)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <button onClick={() => props.createCommentActionCreator()}></button>
      </div>
    </Draggable>
  );
};

// まあ、基本はこのconversationIdに関連したcommentだけを引っ張ってくる感じよ。mapStateToPropsで。
const mapStateToProps = (state) => {
  return { conversationState: state.conversationState };
};

export default connect(mapStateToProps, { createCommentActionCreator })(Comments);
