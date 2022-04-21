import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon, Popup } from 'semantic-ui-react';

// mui
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import BarChartIcon from '@mui/icons-material/BarChart';
import TranslateIcon from '@mui/icons-material/Translate';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// components
import CallButton from './CallButton';
import LanguageChart from './LanguageChart';

// css
import '../styles/userInfocardNew.css';

// action creatores
import { callActionCreator } from '../actionCreators/mediaActionCreator';

const bull = (
  <Box component='span' sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

const UserInfoCardNew = (props) => {
  // const onCallClick = (event, oppositeSocketId) => {
  //   event.preventDefault();
  //   props.setIsPopupOpen(false);
  //   const mySocketId = props.authState.currentUser.socketId;
  //   props.setShowCallingModal(true);
  //   props.callActionCreator(props.socket, mySocketId, oppositeSocketId);
  // };

  const card = () => {
    return (
      <React.Fragment>
        <CardContent>
          <Typography variant='h4' color='text.secondary' gutterBottom>
            {props.user.name}
          </Typography>
          {/* <Typography variant='h5' component='div'>
            be{bull}nev{bull}o{bull}lent
          </Typography> */}
          <Typography gutterBottom variant='h6' component='div' color='text.secondary'>
            Native Languages
          </Typography>
          {renderUserNativeLanguages(props.user)}
          <Typography gutterBottom variant='h6' component='div' color='text.secondary'>
            Learning Languages
          </Typography>
          {renderUserLearningLanguages(props.user)}
          {/* <Typography sx={{ mb: 1.5 }} color='text.secondary'>
            adjective
          </Typography> */}

          {/* <Typography variant='body2'>
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography> */}
        </CardContent>
        {/* <CardActions>
          <Button size='small'>Learn More</Button>
        </CardActions> */}
      </React.Fragment>
    );
  };
  // flagは面倒くさそうだ。今はやめよう。
  const renderCountriesFlag = () => {};

  const renderUserStatus = (user) => {
    if (user.status.dating) {
      return <div>💓💓💓 I'm looking for dating partner 💓💓💓</div>;
    } else if (user.status.money) {
      return <div>💰💰💰 Help!! I need some money 💰💰💰</div>;
    } else if (user.status.dating && user.status.money) {
      return (
        <>
          <div>💓💓💓 I'm looking for dating partner 💓💓💓</div>
          <div>💰💰💰 Help!! I need some money 💰💰💰 Can you help me???</div>
        </>
      );
    } else {
      return null;
    }
  };

  const renderUserNativeLanguages = (user) => {
    const userNativeLanguages = user.nativeLangs.map((nativeLanguage) => {
      return (
        <>
          <div>{nativeLanguage.language.name}</div>
        </>
      );
    });

    return (
      <div className='user-native-languages'>
        {/* <span style={{ borderBottom: '1px solid black' }}>native languages</span> */}
        {userNativeLanguages}
      </div>
    );
  };

  const renderUserLearningLanguages = (user) => {
    const userLearningLanguages = user.learningLangs.map((learningLanguage) => {
      return (
        <>
          <div>{learningLanguage.language.name}</div>
        </>
      );
    });

    return (
      <div className='user-learning-languages'>
        {/* <span style={{ borderBottom: '1px solid black' }}>leaning languages</span> */}
        {userLearningLanguages}
      </div>
    );
  };

  const renderLanguageChart = () => {
    // 今はとりあえず, if statementでrenderしておこう。
    // if (props.user.myLangs) {
    //   return <LanguageChart user={props.user} />;
    // } else {
    //   return null;
    // }
    // return ()
  };

  const renderUserInfoCard = () => {
    return (
      // 元々のcode
      // <div className='user-info-card' style={{ border: '1px solid red', padding: '10px' }}>
      //   <div className='user-info-overview'>
      //     {/* <div className='user-image'> */}
      //     <img className='user-image' src={props.user.photo} alt={props.user.name} style={{ borderRadius: '10px' }} />
      //     {/* </div> */}
      //     <div className='user-name-and-job'>
      //       <div className='user-name'>{props.user.name}</div>
      //       {/* <div className='user-job'>{props.user.job}</div> */}
      //     </div>
      //   </div>
      <Box sx={{ minWidth: 275 }}>
        <Card variant='outlined'>{card()}</Card>
      </Box>
    );
  };

  {
    /* <div className='language-and-status' style={{ width: '300px', marginBottom: '10px' }}>
          <div

          // style={{ borderBottom: '1px solid black' }}
          >
            <TranslateIcon />
            <BarChartIcon /> Languages &amp; Status{' '}
            <Popup
              content='This chart shows you what language and how much this user speak.'
              trigger={<HelpIcon fontSize='small' />}
            />
          </div>
          <hr style={{ width: '70%', textAlign: 'left', marginLleft: '0' }}></hr>
          <Tooltip title='This shows you which language and how much this user speak.' placement='top'>
            <IconButton>
              <HelpIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <LanguageChart user={props.user} />
        </div> */
  }
  {
    /* <div className='user-personal-status'>{renderUserStatus()}</div> ここは後でrenderするようにする。*/
  }
  {
    /* <div className='user-language-overview'>
          <div className='languages-list'>
            {renderUserNativeLanguages(props.user)}
            {renderUserLearningLanguages(props.user)}
          </div>
        </div> */
  }

  {
    /* <div className='user-message' style={{ marginBottom: '10px' }}>
          <div>Self-Introduction</div>
          <hr style={{ width: '70%', textAlign: 'left', marginLleft: '0' }}></hr>
          {props.user.selfIntroduction}
        </div> */
  }

  {
    /* <CallButton
          user={props.user}
          socket={props.socket}
          setIsPopupOpen={props.setIsPopupOpen}
          setShowCallingModal={props.setShowCallingModal}
        /> */
  }
  {
    /* <div className='languages-chart'>
          <LanguageChart user={props.user} />
        </div> */
  }
  {
    /* <Button
          positive
          // disabled={!props.mediaState}
          // disabled={checkCallableOrNot() ? 'false' : 'true'}
          onClick={(event) => onCallClick(event, props.user.socketId)}
          style={{ width: '80%' }}
        >
          <i className='video icon'>call</i>
        </Button> */
  }
  // </div>
  // );
  return <>{renderUserInfoCard()}</>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { callActionCreator })(UserInfoCardNew);
