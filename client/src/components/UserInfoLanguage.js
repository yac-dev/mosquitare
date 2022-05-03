import React, { useEffect } from 'react';
import LanguageChart from './LanguageChart';

// mui icons
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';

// mui components
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

const UserInfoLanguage = (props) => {
  const renderNativeLanguages = (user) => {
    const wordsSum = [...props.user.learningLangs, ...props.user.nativeLangs]
      .map((lang) => lang.words)
      .reduce((partialSum, a) => partialSum + a, 0);

    const nativeLanguagesList = user.nativeLangs.map((language) => {
      if (language.words === 0) {
        return (
          <>
            {/* <div>{language.language.name} 0%</div> */}
            <ListItem
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'rgb(232, 232, 232)',
                borderRadius: '5px',
                border: '1px solid rgb(207, 207, 207)',
                marginBottom: '5px',
              }}
              secondaryAction={
                // <IconButton edge="end" aria-label="delete">
                //   <DeleteIcon />
                // </IconButton>
                <>0%</>
              }
            >
              {/* <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar> */}
              <ListItemText primary={`${language.language.name} (👍 native)`} secondary='0 words' />
            </ListItem>
          </>
        );
      } else {
        const wordsRatio = Math.floor((language.words / wordsSum) * 100);
        return (
          <>
            {/* <div>
              {language.language.name} {wordsRatio}%
            </div> */}
            <ListItem
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'rgb(232, 232, 232)',
                borderRadius: '5px',
                border: '1px solid rgb(207, 207, 207)',
                marginBottom: '5px',
              }}
              secondaryAction={
                // <IconButton edge="end" aria-label="delete">
                //   <DeleteIcon />
                // </IconButton>
                <>{wordsRatio}%</>
              }
            >
              {/* <ListItemAvatar>
                <Avatar sx={{ width: 14, height: 14, background: 'yellow' }} /> */}
              {/* <ImageIcon />
                </Avatar> */}
              {/* </ListItemAvatar> */}
              <ListItemText primary={`${language.language.name} (👍 native)`} secondary={`${language.words} words`} />
            </ListItem>
          </>
        );
      }
    });

    return (
      // <div className='native-languages' style={{ textAlign: 'center' }}>
      //   <span
      //     style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '5px', borderRadius: '5px', fontWeight: 'bolder' }}
      //   >
      //     Native Language
      //   </span>
      //   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{nativeLanguagesList}</div>
      // </div>
      <List sx={{ width: '100%', padding: 0, margin: 0 }}>{nativeLanguagesList}</List>
    );
  };

  const renderLearningLanguages = (user) => {
    const wordsSum = [...props.user.learningLangs, ...props.user.nativeLangs]
      .map((lang) => lang.words)
      .reduce((partialSum, a) => partialSum + a, 0);
    const learningLanguagesList = user.learningLangs.map((language) => {
      if (!language.words) {
        return (
          <>
            {/* <div>
          {language.language.name} 0%
          </div> */}
            <ListItem
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'rgb(232, 232, 232)',
                borderRadius: '5px',
                border: '1px solid rgb(207, 207, 207)',
                marginBottom: '5px',
              }}
              secondaryAction={
                // <IconButton edge="end" aria-label="delete">
                //   <DeleteIcon />
                // </IconButton>
                <>0%</>
              }
            >
              {/* <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar> */}
              <ListItemText primary={`${language.language.name} (💪 learning)`} secondary='0 words' />
            </ListItem>
          </>
        );
      } else {
        const wordsRatio = Math.floor((language.words / wordsSum) * 100);
        return (
          <>
            {/* <div>
            {language.language.name} {wordsRatio}%
          </div> */}
            <ListItem
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'rgb(232, 232, 232)',
                borderRadius: '5px',
                border: '1px solid rgb(207, 207, 207)',
                marginBottom: '5px',
              }}
              secondaryAction={
                // <IconButton edge="end" aria-label="delete">
                //   <DeleteIcon />
                // </IconButton>
                <>{wordsRatio}%</>
              }
            >
              {/* <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar> */}
              <ListItemText primary={`${language.language.name} (💪 learning)`} secondary={`${language.words} words`} />
            </ListItem>
          </>
        );
      }
    });

    return (
      // <div className='learning-languages' style={{ textAlign: 'center' }}>
      //   <span
      //     style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '5px', borderRadius: '5px', fontWeight: 'bolder' }}
      //   >
      //     Learning Language
      //   </span>
      //   <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>{learningLanguagesList}</div>
      // </div>
      <List sx={{ width: '100%', padding: 0, margin: 0 }}>{learningLanguagesList}</List>
    );
  };

  return (
    <div
      className='user-info-language'
      style={{ padding: '10px' }}
      // style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px', marginBottom: '10px' }}
    >
      <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)', marginBottom: '20px' }}>
        <BarChartIcon />
        Language Status&nbsp;
        <Tooltip title='This chart represents what language and how much the user speaks'>
          <HelpIcon />
        </Tooltip>
      </h6>

      <div className='language-status-flexbox' style={{ display: 'flex' }}>
        <div
          className='language-list-wrapper'
          style={{
            height: '100%',
            flex: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className='language-list'>
            {renderNativeLanguages(props.user)}
            {renderLearningLanguages(props.user)}
          </div>
        </div>
        <div className='language-chart' style={{ flex: 5, width: '100%', height: '100%' }}>
          <LanguageChart user={props.user} />
        </div>
      </div>
    </div>
  );
};

export default UserInfoLanguage;
