import React, { useEffect } from 'react';
import LanguageChart from './LanguageChart';

// mui icons
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';

// mui components
import Tooltip from '@mui/material/Tooltip';

const UserInfoLanguage = (props) => {
  const renderNativeLanguages = (user) => {
    const wordsSum = [...props.user.learningLangs, ...props.user.nativeLangs]
      .map((lang) => lang.words)
      .reduce((partialSum, a) => partialSum + a, 0);

    const nativeLanguagesList = user.nativeLangs.map((language) => {
      const wordsRatio = Math.floor((language.words / wordsSum) * 100);
      return (
        <div>
          {language.language.name} {wordsRatio}%
        </div>
      );
    });

    return (
      <div className='native-languages' style={{ textAlign: 'center' }}>
        <span
          style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '5px', borderRadius: '5px', fontWeight: 'bolder' }}
        >
          Native Language
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{nativeLanguagesList}</div>
      </div>
    );
  };

  const renderLearningLanguages = (user) => {
    const wordsSum = [...props.user.learningLangs, ...props.user.nativeLangs]
      .map((lang) => lang.words)
      .reduce((partialSum, a) => partialSum + a, 0);
    const learningLanguagesList = user.learningLangs.map((language) => {
      const wordsRatio = Math.floor((language.words / wordsSum) * 100);
      return (
        <div>
          {language.language.name} {wordsRatio}%
        </div>
      );
    });

    return (
      <div className='learning-languages' style={{ textAlign: 'center' }}>
        <span
          style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '5px', borderRadius: '5px', fontWeight: 'bolder' }}
        >
          Learning Language
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>{learningLanguagesList}</div>
      </div>
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
            flex: 4,
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
        <div className='language-chart' style={{ flex: 6 }}>
          <LanguageChart user={props.user} />
        </div>
      </div>
    </div>
  );
};

export default UserInfoLanguage;
