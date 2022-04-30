import React, { useState } from 'react';
import TranslateTranscript from '../TranslateTranscript';
import store from '../../store';

// mui
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const EachTranscript = (props) => {
  const [translated, setTranslated] = useState('');

  const renderName = (conversationTranscript) => {
    if (conversationTranscript.user === store.getState().authState.currentUser._id) {
      return <>You</>;
    } else if (conversationTranscript.user === store.getState().mediaState.callingWith._id) {
      return <>{conversationTranscript.name}</>;
    }
  };

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

    if (obj.h === 0) {
      return (
        <>
          <span style={{ color: 'rgb(37, 95, 184)' }}>
            @{obj.m}:{obj.s}
          </span>
        </>
      );
    } else {
      return (
        <>
          <span style={{ color: 'rgb(37, 95, 184)' }}>
            @{obj.h}:{obj.m}:{obj.s}
          </span>
        </>
      );
    }
  };

  return (
    <>
      <ListItem
        alignItems='flex-start'
        secondaryAction={
          <Tooltip title='translate'>
            <IconButton edge='end'>
              <TranslateTranscript
                translateInput={props.conversationTranscript.transcript}
                setTranslated={setTranslated}
                // setGoogleTranslated={setGoogleTranslated}
              />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemAvatar>
          <Avatar alt={`${props.conversationTranscript.name}`} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                {renderName(props.conversationTranscript)}&nbsp;
                {renderSecondsToTimes(props.conversationTranscript.seconds)}
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography component='div' variant='body2' sx={{ color: 'black' }}>
                {props.conversationTranscript.transcript}
                Translated <p>{translated}</p>
                {/* <TranslatedText googleTranslated={googleTranslated} /> */}
                {/* <Tooltip title='translate'>
                      <IconButton edge='end'>
                        <TranslateTranscript translateInput={conversationTranscript.transcript} />
                      </IconButton>
                    </Tooltip> */}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant='inset' component='li' />
    </>
  );
};

export default EachTranscript;
