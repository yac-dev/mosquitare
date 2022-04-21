import React from 'react';
import { SocialIcon } from 'react-social-icons';

// mui icons
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HelpIcon from '@mui/icons-material/Help';
import HailIcon from '@mui/icons-material/Hail';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import BarChartIcon from '@mui/icons-material/BarChart';
import WorkIcon from '@mui/icons-material/Work';

// mui components
import Tooltip from '@mui/material/Tooltip';

// components
import PersonalityChart from './PersonalityChart';

// css
import '../styles/userInfoPersonal.css';

const UserInfoPersonal = (props) => {
  // const renderBadges = (user) => {
  //   return <div>{user.name} Badges</div>;
  // };

  const renderBadges = () => {
    const personalStatusList = props.user.personalStatus.map((status) => {
      return (
        <>
          <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>{status}</span>
          &nbsp;
        </>
      );
    });

    return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>{personalStatusList}</div>;
  };

  const renderDating = () => {
    if (props.user.ratingAverage[5] >= 1) {
      return (
        <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>
          💕💕 Dating hunter +{props.user.ratingAverage[5]}
        </span>
      );
    }
  };

  const renderMoney = () => {
    if (props.user.ratingAverage[6] >= 1) {
      return (
        <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>
          💰💰 Money hunter +{props.user.ratingAverage[5]}
        </span>
      );
    }
  };

  return (
    <div className='user-info-personal' style={{ padding: '10px' }}>
      <div className='badges' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <BarChartIcon />
          Personal Status&nbsp; <span></span>
          <Tooltip title='This status is based on user reviews.'>
            <HelpIcon />
          </Tooltip>
        </h6>
        {/* {renderBadges(props.user)} */}
        <PersonalityChart user={props.user} />
        <div style={{ display: 'flex', flexWrap: 'wrape', gap: '5px' }}>
          {renderDating()}
          {renderMoney()}
        </div>
      </div>

      <div className='self-introduction' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <EmojiPeopleIcon />
          Self-Introduction&nbsp;
        </h6>
        <p>{props.user.selfIntroduction}</p>
      </div>

      {/* <div className='socials' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <WorkIcon />
          Job&nbsp;
        </h6>
      </div> */}
    </div>
  );
};

export default UserInfoPersonal;
