import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

// ac
import { getTranscriptsByConversationIdActionCreator } from '../actionCreators/transcriptsActionCreator';

// css
import '../styles/renderedTranscripts.css';

const Transcripts = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    props.getTranscriptsByConversationIdActionCreator();
  }, []);

  const renderSecondsToTimes = (secs) => {
    const hours = Math.floor(secs / (60 * 60));
    const divisorForMinutes = secs % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);

    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);

    const obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };

    if (obj.hours === 0) {
      return (
        <>
          {obj.minutes}:{obj.seconds}
        </>
      );
    } else {
      return (
        <>
          {obj.hours}:{obj.minutes}:{obj.seconds}
        </>
      );
    }
  };

  const renderTranscripts = () => {
    if (props.transcriptsState.length) {
      const transcriptsList = props.transcriptsState.map((transcript) => {
        return (
          <>
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <Avatar alt={`${transcript.user.name}`} src='/static/images/avatar/1.jpg' />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      {/* &#64; 3:00&nbsp;&nbsp; */}
                      {renderSecondsToTimes(transcript.seconds)}
                      {transcript.user.name}&nbsp;said
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      {transcript.transcript}
                    </Typography>
                    <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                      <Tooltip title='Edit this transcript'>
                        <EditIcon sx={{ fontSize: '15px', cursor: 'pointer' }} />
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
          <List>{transcriptsList}</List>
        </>
      );
    } else {
      return <div>No transcripts.</div>;
    }
  };

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.fa-close, .transcripts-list'>
      <div className={`rendered-transcripts ${props.openTranscripts ? undefined : 'hidden'}`}>
        <div className='rendered-transcripts-wrapper' style={{ display: 'flex', height: '10%' }}>
          <div className='rendered-transcripts-header' style={{ flex: 4 }}>
            {/* <div className='rendered-transcripts-close-button' onClick={() => props.setOpenTranscripts(false)}> */}
            <i
              className='fa fa-close'
              onClick={() => props.setOpenTranscripts(false)}
              style={{ color: 'red', cursor: 'pointer' }}
            ></i>
            <p style={{ fontSize: '20px' }}>
              Transcripts&nbsp;
              <RecordVoiceOverIcon />
            </p>
            {/* </div> */}
          </div>
          <div className='transcripts-app-menu' style={{ display: 'flex', flex: 2, alignItems: 'center', gap: '30px' }}>
            <Tooltip title='Translate'>
              {/* <IconButton color='primary'> */}
              <GTranslateIcon sx={{ cursor: 'pointer' }} />
              {/* </IconButton> */}
            </Tooltip>
          </div>
        </div>
        <div className='transcripts-list'>{renderTranscripts()}</div>
      </div>
    </Draggable>
  );
};

const mapStateToProps = (state) => {
  return { transcriptsState: Object.values(state.transcriptsState) };
};

export default connect(mapStateToProps, { getTranscriptsByConversationIdActionCreator })(Transcripts);
