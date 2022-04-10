import React from 'react';
import LanguageChart from './LanguageChart';

// mui icons
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';

// mui components
import Tooltip from '@mui/material/Tooltip';

const UserInfoLanguage = (props) => {
  const renderNativeLanguages = (user) => {
    const nativeLanguagesList = user.nativeLangs.map((language) => {
      return <p>{language.name}</p>;
    });

    return (
      <div className='native-languages' style={{ textAlign: 'center' }}>
        <span style={{ borderBottom: '1px solid black' }}>Native Language</span>
        {nativeLanguagesList}
      </div>
    );
  };

  const renderLearningLanguages = (user) => {
    const learningLanguagesList = user.learningLangs.map((language) => {
      return <p>{language.name}</p>;
    });

    return (
      <div className='learning-languages' style={{ textAlign: 'center' }}>
        <span style={{ borderBottom: '1px solid black' }}>Learning Language</span>
        {learningLanguagesList}
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
            width: '40%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className='language-list' style={{}}>
            {renderNativeLanguages(props.user)}
            {renderLearningLanguages(props.user)}
          </div>
        </div>
        <div className='language-chart' style={{ width: '60%' }}>
          <LanguageChart user={props.user} />
        </div>
      </div>
    </div>
  );
};

export default UserInfoLanguage;
